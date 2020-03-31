export default class Drawer {
    constructor(id) {
        const board = document.getElementById(id);
        const context = board.getContext('2d');
        this.context = context;
    }
    draw_rect(x, y, width, height, color, fill = false) {
        this.context.fillStyle = color;
        if (fill) {
            this.context.fillRect(x, y, width, height);
        }
        else {
            this.context.strokeRect(x, y, width, height);
        }
    }
    draw_wall(x, y, width, height, color, blocks, fill = false) {
        let dx = 10;
        for (let i = 0; i < blocks; i++) {
            this.draw_rect(x, y, width, height, color, fill);
            x += width + dx;
        }
    }
    clear(x, y, w, h) {
        this.context.clearRect(x, y, w, h);
    }
}
