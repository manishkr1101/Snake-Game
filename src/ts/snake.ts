import Drawer from "./drawer"
import * as UICtrl from './UIController'
import { unit, snakeColor, gap } from './config'
import * as db from './db'

type coord = {
    x:number,
    y:number
}
const HIGH_SCORE='high-score'
const ctx = new Drawer('board')


// const board = document.getElementById('board')
// // width of board
// let width =parseInt(board.getAttribute('width'))
// // height of board
// let height =parseInt(board.getAttribute('height'))

let food = new Image()

const eatSound = new Audio('assets/audio/Apple-bite.mp3')
const failSound = new Audio('assets/audio/fail.mp3')

async function wait(ms){
    return new Promise((res, rej) => setTimeout(res, ms))
}

export default class Snake{
    
    private pos: coord[]
    private size:number
    private gap: number
    private color: string
    public direction: 'left'|'right'|'up'|'down'
    private randomBlock: coord
    private flag: boolean
    private totalScore: number
    private level: number
    private foodEaten: number // food eaten in current level
    constructor(){
        this.size = unit
        // this.gap = Math.floor(this.size / 10)
        this.gap= gap
        this.pos = [{x:this.gap, y: this.gap},{x:2*this.gap+this.size, y: this.gap}]
        this.color = snakeColor
        this.direction = "right"
        // this.init()
        this.getRandomBlock()
        this.flag = false
        this.totalScore = 0
        this.level = 1
        this.foodEaten = 0
        food.src = 'assets/images/food-30x30.png'
        food.onload = () => ctx.draw_image(food,this.randomBlock.x, this.randomBlock.y, this.size)
    }

    

    init(){
        ctx.draw_rect(0,0,Board.width,Board.height,"red", true)
    }

    getFlag(){
        return this.flag
    }

    async start(){
        this.flag = true
        try {
            // this.draw(this.randomBlock.x, this.randomBlock.y)
            while(this.flag){
                await this.update()
            }
        } catch (error) {
            failSound.play()
            if('vibrate' in navigator){
                navigator.vibrate(100)
            }
            let high_score = db.getHighScore()
            if(!high_score || (high_score < this.totalScore)){
                db.setHighScore(this.totalScore)
            }
            console.log(error)
        }
        
        
    }

    async pause(){
        this.flag = false
    }

    async resume(){
        if(this.flag===true) return
        this.start()
    }

    async update(){
        await wait(300-this.level*40)
        // check 

        // move in direction it is
        
        const toRemove = this.updateArray()

        // check boundary && self collision
        this.checkBoundary()

        

        //1. remove last block
        if(toRemove){
            this.clear(toRemove.x, toRemove.y)
        } else {
            // console.log('got food')
            eatSound.play()
            this.updateScore()
            this.manageLevel()
            this.getRandomBlock()
        }
        

        const front = this.pos[this.pos.length-1]
        //2. add block in front
        this.draw(front.x, front.y);

        

    }

    display(){
        for(let c of this.pos){
            this.draw(c.x, c.y)
        }
        this.drawFood()
    }

    checkFood(): boolean{
        const front = this.pos[this.pos.length-1]
        if(this.randomBlock.x == front.x && this.randomBlock.y == front.y){
            return true
        }
        return false

    }

    /**
     * increment level after eating required apple/food
     */
    manageLevel(){
        this.foodEaten++
        if(this.foodEaten >= this.level*5){
            // increment level
            this.level++
            // reset foodEaten
            this.foodEaten = 0
        }
    }

    checkBoundary(){
        
        const front = this.pos[this.pos.length-1]
        if(front.x >= Board.width || front.x < 0 || front.y < 0 || front.y >= Board.height){
            // failSound.play()
            throw Error('collision with wall')
        }

        // checking self collision
        // if(
        //     (this.direction === 'right' && this.isSnake(front.x+this.size+this.gap, front.y)) || 
        //     (this.direction === 'left' && this.isSnake(front.x-this.size-this.gap, front.y)) ||
        //     (this.direction === 'up' && this.isSnake(front.x, front.y-this.size-this.gap)) ||
        //     (this.direction === 'down' && this.isSnake(front.x, front.y+this.size+this.gap))            
        // ){
        //     throw Error('collistion with snake')    
        // }
        if(this.isSnake(front.x, front.y)){
            // failSound.play()
            throw Error('collision with snake')
        }
    }

    isSnake(x:number, y:number):boolean{
        const n = this.pos.length
        const found = this.pos.find((value, index) => index != n-1 && value.x === x && value.y=== y)
        if(found)
            return true
        return false
    }

    /**
     * generate random position for food and render it on UI
     */
    getRandomBlock(): coord{
        const x_offset = Math.floor(Math.random()*Board.blocksInRow)
        const y_offset = Math.floor(Math.random()*Board.blocksInCol)

        const block:coord = {
            x: this.gap + x_offset*(this.gap+this.size),
            y: this.gap + y_offset*(this.gap+this.size)
        }

        const res = this.pos.find((value) => value.x == block.x && value.y == block.y)
        if(res){
            return this.getRandomBlock()
        }
        // this.draw(block.x, block.y, 'black')
        // ctx.circle(block.x+this.size/2, block.y+this.size/2, this.size/2, 'black')
        
        this.randomBlock = block
        // ctx.draw_image(food,block.x, block.y, this.size)
        this.drawFood()
        return block
    }

    private drawFood(){
        ctx.draw_image(food,this.randomBlock.x, this.randomBlock.y, this.size)
        
    }

    private updateArray():coord{
        const front = this.pos[this.pos.length-1]
        const len = this.size+this.gap

        const block:coord = {
            x: front.x,
            y: front.y
        }

        switch(this.direction){
            case 'right':
                block.x += len
                break;
            case 'down':
                block.y += len
                break;
            case 'left':
                block.x -= len
                break;
            case 'up':
                block.y -= len
                break;
        }

        this.pos.push(block)
        // check if food is ahead
        if(this.checkFood()){
            
            return
        }

        return this.pos.shift()
    }

    updateScore(){
        this.totalScore += this.level*10
        UICtrl.updateScore(this.totalScore)
    }

    draw(x:number, y:number, color:string=this.color){
        const len = this.size
        ctx.draw_rect(x, y, len, len, color, true)
    }

    clear(x:number, y:number){
        const len = this.size+this.gap
        ctx.clear(x, y, len, len)
    }
}

export class Board{
    public static height:number
    public static width:number
    public static blocksInRow:number
    public static blocksInCol:number
    constructor(){

    }

    static approximateBlock(length:number):number{
        return Math.floor((length-gap)/(unit+gap))
    }

    /**
     * adjust dimension of board according to device width and height
     */
    static adjustDimension():{height:number, width:number} {
        let screenWidth = document.documentElement.clientWidth;
        let screenHeight = document.documentElement.clientHeight;

        if(screenWidth > 768){
            // desktop
            screenWidth = 0.75*screenWidth
            screenHeight = 0.7*screenHeight
        } else {
            // mobile or tablet
            let border = 20
            screenWidth -= 2*border
            screenHeight = screenHeight*0.7-2*border

        }

        this.blocksInRow = this.approximateBlock(screenWidth)
        this.blocksInCol = this.approximateBlock(screenHeight)

        this.height = this.blocksInCol*(unit+gap) + gap
        this.width = this.blocksInRow*(unit+gap) + gap

        return {height: this.height, width: this.width}
    }
}