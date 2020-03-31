import Snake from "./snake";
async function wait(ms) {
    return new Promise((res, rej) => setTimeout(res, ms));
}
const snake = new Snake(30, 'green');
console.log(snake);
snake.display();
snake.start();
// snake.moveUp()
// snake.moveRight()
// setInterval(snake.moveRight.call,1000, snake)
window.addEventListener('keydown', (e) => {
    // console.log(e)
    switch (e.code) {
        case 'ArrowRight':
            snake.direction = "right";
            break;
        case 'ArrowLeft':
            snake.direction = "left";
            break;
        case 'ArrowUp':
            snake.direction = "up";
            break;
        case 'ArrowDown':
            snake.direction = "down";
            break;
    }
});
