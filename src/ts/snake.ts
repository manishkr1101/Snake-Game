import Drawer from "./drawer"
import * as UICtrl from './UIController'

type coord = {
    x:number,
    y:number
}

const ctx = new Drawer('board')

const board = document.getElementById('board')
let width =parseInt(board.getAttribute('width'))
let height =parseInt(board.getAttribute('height'))

let food = new Image()

const eatSound = new Audio('assets/audio/Apple-bite.mp3')
const failSound = new Audio('assets/audio/fail.mp3')

async function wait(ms){
    return new Promise((res, rej) => setTimeout(res, ms))
}

export default class Snake{
    private pos: coord[]
    size:number
    private gap: number
    color: string
    direction: 'left'|'right'|'up'|'down'
    private randomBlock: coord
    private flag: boolean
    totalScore: number
    level: number
    constructor(size:number, color:string){
        this.size = size
        this.gap = Math.floor(this.size / 10)
        this.pos = [{x:this.gap, y: this.gap},{x:2*this.gap+size, y: this.gap}]
        this.color = color
        this.direction = "right"
        // this.init()
        this.getRandomBlock()
        this.flag = false
        this.totalScore = 0
        this.level = 1
        food.src = 'assets/images/food-30x30.png'
        food.onload = () => ctx.draw_image(food,this.randomBlock.x, this.randomBlock.y)
    }

    init(){
        ctx.draw_rect(0,0,width,height,"red", true)
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
            console.log(error)
        }
        
        
    }

    async pause(){
        this.flag = false
    }

    async resume(){
        
        this.start()
    }

    async update(){
        await wait(400)
        // check 

        // move in direction it is
        
        const toRemove = this.updateArray()

        // check boundary && self collision
        this.checkBoundary()

        

        //1. remove last block
        if(toRemove){
            this.clear(toRemove.x, toRemove.y)
        }
        

        const front = this.pos[this.pos.length-1]
        //2. add block in front
        this.draw(front.x, front.y);

        

    }

    display(){
        for(let c of this.pos){
            this.draw(c.x, c.y)
        }
        
    }

    checkFood(): boolean{
        const front = this.pos[this.pos.length-1]
        if(this.randomBlock.x == front.x && this.randomBlock.y == front.y){
            return true
        }
        return false

    }

    checkBoundary(){
        
        const front = this.pos[this.pos.length-1]
        if(front.x >= width || front.x <= 0 || front.y <= 0 || front.y >= height){
            failSound.play()
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
            failSound.play()
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

    getRandomBlock(): coord{
        const x_offset = Math.floor(Math.random()*15)
        const y_offset = Math.floor(Math.random()*10)

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
        
        ctx.draw_image(food,block.x, block.y)
        this.randomBlock = block
        return block
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
            // console.log('got food')
            eatSound.play()
            this.updateScore()
            this.getRandomBlock()
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