import Snake, { Board } from "./snake";
import elements from "./elements";
import * as UICtrl from './UIController'

async function wait(ms){
    return new Promise((res, rej) => setTimeout(res, ms))
}

function setupBoard(){
    const {height, width} = Board.adjustDimension()
    UICtrl.setDimension(height, width)
    // snake.display()
}

window.addEventListener('resize',() => {
    setupBoard()
    snake.display()
})

setupBoard()
const snake = new Snake();
// setupBoard()

// console.log(snake)

snake.display();
// snake.start()



window.addEventListener('keydown', (e) => {
    // console.log(e)
    switch(e.code){
        case 'ArrowRight': 
            if(snake.direction != 'left')
                snake.direction = "right"
            break;
        case 'ArrowLeft':
            if(snake.direction != "right")
                snake.direction = "left"
            break;
        case 'ArrowUp':
            if(snake.direction != "down")
                snake.direction = "up"
            break;
        case 'ArrowDown':
            if(snake.direction != "up")
            snake.direction = "down"
            break;
        case 'Space':
            if(snake.getFlag()){
                pauseGame()
            } else{
                playGame()
            }
            break;
    }
})

function playGame(){
    snake.resume()
}

function pauseGame(){
    snake.pause()
}


elements.playBtn.addEventListener('click', playGame)
elements.pauseBtn.addEventListener('click', pauseGame)

if('serviceWorker' in navigator){
    navigator.serviceWorker
        .register('../sw.js')
        .then(() => {
            console.log('service worker is installing')
        })
} 

// let board:any = document.getElementById('board')
// let ctx: CanvasRenderingContext2D = board.getContext('2d')



// ctx.beginPath()
// ctx.fillStyle = 'black'
// ctx.moveTo(50,50)
// ctx.lineTo(50,100)
// ctx.lineTo(100,50)
// ctx.fill()

// ctx.moveTo(110,60)
// ctx.lineTo(60, 110)
// ctx.lineTo(110, 110)
// ctx.lineTo(110, 60)
// ctx.stroke()