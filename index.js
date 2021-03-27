const width_num = 6;
const height_num = 15;
const speed = 8;
let clickOn = true;
canvas = document.getElementById('tutorial');
c = canvas.getContext('2d');

class App{
    constructor(){
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
        this.draw()
    }

    resize(){
        this.width = document.body.clientWidth - (document.body.clientWidth % width_num);
        this.height = document.body.clientHeight -(document.body.clientHeight % height_num);
        canvas.width = this.width;
        canvas.height = this.height;
    }
    draw(){
        c.rect(0, 0, this.width, this.height);
        c.fillStyle = 'black';
        c.fill()
    }
}

class Block{
    constructor(x, y, num){
        this.num = num;
        this.x = x;
        this.y = y;
        this.width = canvas.width / width_num;
        this.height = canvas.height / height_num;
    }
    draw(){
        c.beginPath();
        c.rect(this.x * this.width, this.y * this.height, this.width, this.height);
        c.fillStyle = '#0095DD';
        c.strokeStyle = 'black';
        c.stroke();
        c.fill();
        c.closePath();
        c.fillStyle="black"
        c.font = "20px Arial";
        c.fillText(this.num, this.x * this.width + (this.width / 2), this.y * this.height + (this.height / 2))
    }
    set_position(x, y){
        this.x = x;
        this.y = y;
    }
}

class BlockControl{
    constructor(){
        this.block_num = 0;
        this.blocks = []
        for(var r = 0; r < height_num; r++){
            this.blocks[r] = [];
        }
        for(var r = 0; r < height_num; r++){
            for(var c = 0; c < width_num; c++){
                this.blocks[r][c] = new Block(c, r, 0);
            }
        }
    }
    add_line(){
        this.block_num++;
        for(var r = height_num - 1; r > 0 ; r--){
            for(var c = 0; c < width_num; c++){
                this.blocks[r][c] = this.blocks[r-1][c];
                this.blocks[r][c].set_position(c, r);
            }
        }
        for(var c = 0; c < width_num; c++){
            this.blocks[0][c] = new Block(c, 0);
        }
        var block_position = this.select_position();
        block_position.forEach(function(ele){
            this.blocks[0][ele].num = this.block_num;
        }, this);
    }
    draw(){
        for(var r = 0; r < height_num; r++){
            for(var c = 0; c < width_num; c++){
                if(this.blocks[r][c].num > 0){
                    this.blocks[r][c].draw();
                }
            }
        }
    }
    select_position(){
        var block_num = Math.floor(Math.random() * (width_num - 1)) + 1;
        var arr = Array.from(Array(width_num).keys());
        var return_arr = [];
        var w = width_num;
        for(var i = 0; i < block_num; i++){
            var rand = Math.floor(Math.random() * w);
            return_arr.push(arr[rand]);
            if(rand > -1){
                arr.splice(rand, 1);
            }
            w--;
        }
        return return_arr;
    }
}

class Ball{
    constructor(){
        this.x = canvas.width/2;
        this.r = canvas.height / height_num / 3;
        this.y = canvas.height - this.r; 
        this.dx = 0;
        this.dy = 0;
        this.move = false;
        window.addEventListener('click', this.click.bind(this));
    }
    moveto(x){

    }
    click(e){
        if(!this.move){
            this.move = true;
            var mouse_x = e.clientX;
            var mouse_y = e.clientY;
            var dis_x = mouse_x - this.x
            var dis_y = mouse_y - this.y
            var distance = Math.sqrt(Math.abs(dis_x*dis_x)+Math.abs(dis_y*dis_y));
            this.dx = dis_x / distance * speed;
            this.dy = dis_y / distance * speed;
        }
    }
    update(){
        this.draw();
        if(this.x + this.dx > canvas.width - this.r || this.x + this.dx < this.r){
            this.dx = -this.dx;
        }
        if(this.y + this.dy < this.r){
            this.dy = -this.dy;
        }
        if(this.y + this.dy > canvas.height - this.r){
            this.dx = 0;
            this.dy = 0;
            return true; //ball moving finished
        }
        this.x += this.dx;
        this.y += this.dy;
        return false; //ball moving
    }
    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI*2);
        c.fillStyle = "white";
        c.fill();
        c.closePath();
    }
}

class BallControl{
    constructor(block_control){
        this.block_control = block_control;
        this.balls = [];
        this.turn_finished = 0;
        this.balls.push(new Ball());
    }
    draw(){
        this.collisionDetection();
        for(let b = 0; b <this.balls.length; b++){
            this.turn_finished += this.balls[b].update() ? 1 : 0;
        }
        if(this.turn_finished === this.balls.length){
            for(let b = 0; b < this.balls.length; b++){
                this.balls[b].move = false;
            }
            this.turn_finished = 0;
            this.block_control.add_line();
            this.add_ball();
        }
    }
    add_ball(){
        let tempBall = new Ball();
        tempBall.x = this.balls[0].x;
        tempBall.y = this.balls[0].y;
        this.balls.push(tempBall);
    }
    collisionDetection(){
        for(let ba = 0; ba < this.balls.length; ba++){
            for(var r = 0; r < height_num; r++){
                for(var c = 0; c < width_num; c++){
                    let ball = this.balls[ba];
                    let b = this.block_control.blocks[r][c];
                    if(b.num > 0){
                        var circle = {x : ball.x, y : ball.y, r : ball.r};
                        var rect = {x : b.x * b.width, y : b.y * b.height, w : b.width, h : b.height};
                        if(this.RectCircleColliding(circle, rect) === 1){
                            ball.dy = -ball.dy;
                            b.num--;
                        }
                        else if(this.RectCircleColliding(circle, rect) === 2){
                            ball.dx = -ball.dx;
                            b.num--;
                        }
                    }
                }
            }
        }
    }
    RectCircleColliding(circle,rect){
        var distX = Math.abs(circle.x - rect.x-rect.w/2);
        var distY = Math.abs(circle.y - rect.y-rect.h/2);
    
        if (distX > (rect.w/2 + circle.r)) { return false; }
        if (distY > (rect.h/2 + circle.r)) { return false; }
    
        if (distX <= (rect.w/2)) { return 1; } 
        if (distY <= (rect.h/2)) { return 2; }
    
        var dx=distX-rect.w/2;
        var dy=distY-rect.h/2;
        return (dx*dx+dy*dy<=(circle.r*circle.r) ? 1 : 0);
    }
}

var app = new App();
var block_control = new BlockControl();
var ball_control = new BallControl(block_control);
block_control.add_line();

function draw(){
    app.draw();
    block_control.draw();
    ball_control.draw();
}

setInterval(() => {
   draw(); 
}, 10);