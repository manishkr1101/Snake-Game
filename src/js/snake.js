import Drawer from "./drawer";
const ctx = new Drawer('board');
async function wait(ms) {
    return new Promise((res, rej) => setTimeout(res, ms));
}
export default class Snake {
    constructor(size, color) {
        this.size = size;
        this.gap = Math.floor(this.size / 10);
        this.pos = [{ x: this.gap, y: this.gap }, { x: 2 * this.gap + size, y: this.gap }];
        this.color = color;
        this.direction = "right";
        this.randomBlock = this.getRandomBlock();
    }
    init() {
    }
    async start() {
        this.draw(this.randomBlock.x, this.randomBlock.y);
        while (true) {
            await this.update();
        }
    }
    async update() {
        await wait(800);
        // move in direction it is
        const toRemove = this.updateArray();
        //1. remove last block
        this.clear(toRemove.x, toRemove.y);
        const front = this.pos[this.pos.length - 1];
        //2. add block in front
        this.draw(front.x, front.y);
    }
    display() {
        for (let c of this.pos) {
            this.draw(c.x, c.y);
        }
    }
    addBlock() {
    }
    getRandomBlock() {
        const x_offset = Math.floor(Math.random() * 15);
        const y_offset = Math.floor(Math.random() * 10);
        const block = {
            x: this.gap + x_offset * (this.gap + this.size),
            y: this.gap + y_offset * (this.gap + this.size)
        };
        const res = this.pos.find((value, index) => value.x == block.x && value.y == block.y);
        if (res) {
            return this.getRandomBlock();
        }
        return block;
    }
    updateArray() {
        const front = this.pos[this.pos.length - 1];
        const len = this.size + this.gap;
        const block = {
            x: front.x,
            y: front.y
        };
        switch (this.direction) {
            case 'right':
                block.x += len;
                break;
            case 'down':
                block.y += len;
                break;
            case 'left':
                block.x -= len;
                break;
            case 'up':
                block.y -= len;
                break;
        }
        this.pos.push(block);
        return this.pos.splice(0, 1)[0];
    }
    draw(x, y) {
        const len = this.size;
        ctx.draw_rect(x, y, len, len, this.color, true);
    }
    clear(x, y) {
        const len = this.size + this.gap;
        ctx.clear(x, y, len, len);
    }
}
