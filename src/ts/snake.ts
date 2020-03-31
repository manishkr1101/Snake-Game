import Drawer from "./drawer"

type coord = {
    x:number,
    y:number
}

const ctx = new Drawer('board')

const board = document.getElementById('board')

async function wait(ms){
    return new Promise((res, rej) => setTimeout(res, ms))
}

export default class Snake{
    private pos: coord[]
    size:number
    private gap: number
    color: string
    direction: 'left'|'right'|'up'|'down'
    randomBlock: coord
    constructor(size:number, color:string){
        this.size = size
        this.gap = Math.floor(this.size / 10)
        this.pos = [{x:this.gap, y: this.gap},{x:2*this.gap+size, y: this.gap}]
        this.color = color
        this.direction = "right"
        this.getRandomBlock()
    }

    init(){

    }

    async start(){
        try {
            // this.draw(this.randomBlock.x, this.randomBlock.y)
            while(true){
                await this.update()
            }
        } catch (error) {
            console.log(error)
        }
        
        
    }

    async update(){
        await wait(800)
        // check 

        // move in direction it is
        
        const toRemove = this.updateArray()

        // check boundary collision
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
        let width =parseInt(board.getAttribute('width'))
        let height =parseInt(board.getAttribute('height'))
        const front = this.pos[this.pos.length-1]
        if(front.x >= width || front.x <= 0 || front.y <= 0 || front.y >= height){
            throw Error('collision')
        }
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
        this.draw(block.x, block.y)
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
            console.log('got food')
            this.getRandomBlock()
            return
        }

        return this.pos.splice(0,1)[0]
    }

    draw(x:number, y:number){
        const len = this.size
        ctx.draw_rect(x, y, len, len, this.color, true)
    }

    clear(x:number, y:number){
        const len = this.size+this.gap
        ctx.clear(x, y, len, len)
    }
}