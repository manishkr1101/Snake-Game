import Snake from "./snake";

async function wait(ms){
    return new Promise((res, rej) => setTimeout(res, ms))
}

const snake = new Snake(30, 'green')

console.log(snake)

snake.display();
snake.start()



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
    }
})