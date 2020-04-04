export default class Drawer {
    private context: CanvasRenderingContext2D
    constructor(id: string) {
        const board: any = document.getElementById(id)
        const context: CanvasRenderingContext2D = board.getContext('2d')
        this.context = context
    }

    arc(){
        
    }

    circle(x:number, y:number, radius:number, color:string, fill:boolean=true){
        this.context.beginPath()
        this.context.arc(x,y,radius,0,Math.PI*2,true)
        this.context.fillStyle = color
        if(fill){
            this.context.fill()
        } else{
            this.context.stroke()
        }
        this.context.closePath()
    }

    draw_image(image:HTMLImageElement, dx:number, dy:number, size:number){
        this.context.drawImage(image, dx, dy, size, size)
    }

    draw_rect(x: number, y: number, width: number, height: number, color: string, fill: boolean = false) {
        this.context.fillStyle = color
        if (fill) {
            this.context.fillRect(x, y, width, height)
        } else {
            this.context.strokeRect(x, y, width, height)
        }

    }

    draw_wall(x: number, y: number, width: number, height: number, color: string, blocks:number, fill: boolean = false){
        let dx = 10;
        for(let i=0; i<blocks; i++){
            this.draw_rect(x,y,width,height,color,fill)
            x += width+dx
        }
    }

    clear(x,y,w,h){
        this.context.clearRect(x,y,w,h)
    }
}