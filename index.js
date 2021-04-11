const width_num = 6;
const height_num = 15;
const speed = 8;
const timeFrame = 10;
let clickOn = true;
let Mode = "drawFlyMovement";
let gameFinished = false;
let app;
let block_control;
let ball_control;
canvas = document.getElementById('tutorial');
c = canvas.getContext('2d');

class App{
    constructor(){
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
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
        this.block_num = 0; //block얀에 있는 숫자를 의미함
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
    add_line(){ // block line을 추가 맨 마지막 칸에 block line이 추가되면 true를 리턴
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

        for(var c = 0; c < width_num; c++){
            if(this.blocks[height_num-1][c].num > 0){
                return true;
            }
        }
        document.getElementById("score").innerText = this.block_num;
        return false;
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
    }
    moveto(x){
        this.draw();
        if(Math.abs(x - this.x) < speed){
            this.x = x;
            return true;
        }
        else{
            let direction_x = (x - this.x) > 0 ? 1 : -1;
            this.x += direction_x * speed;
            return false;
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
        this.drawFlyMovementfinished = 0;
        this.balls.push(new Ball());
        this.finished_x = this.balls[0].x;
        this.clickOn = true;
        document.getElementById('tutorial').addEventListener('click', this.click.bind(this));
    }
    click(e){
        if(this.clickOn){
            this.clickOn = false;
            let mouse_x = e.clientX;
            let mouse_y = e.clientY;
            let dis_x = mouse_x - this.balls[0].x;
            let dis_y = mouse_y - this.balls[0].y;
            let distance = Math.sqrt(Math.abs(dis_x*dis_x)+Math.abs(dis_y*dis_y));
            let dx = dis_x / distance * speed;
            let dy = dis_y / distance * speed;
            for(let b = 0; b < this.balls.length; b++){
                setTimeout(() => {
                    this.balls[b].dx = dx;
                    this.balls[b].dy = dy;
                }, timeFrame * b * 3);
            }
        }
    }
    drawFlyMovement(){
        this.collisionDetection();
        for(let b = 0; b < this.balls.length; b++){
            this.drawFlyMovementfinished += this.balls[b].update() ? 1 : 0;
            if(this.drawFlyMovementfinished === 1){
                this.finished_x = this.balls[b].x;
            }
        }
        if(this.drawFlyMovementfinished === this.balls.length){
            Mode = "drawCollectMovement";
            this.drawFlyMovementfinished = 0;
        }
    }
    drawCollectMovement(){
        let finished = true;
        for(let b = 0; b < this.balls.length; b++){
            let tem = this.balls[b].moveto(this.finished_x);
            finished = finished && tem;
        }
        if(finished){
            Mode = "drawMapMovement";
        }
    }
    drawMapMovement(){
        gameFinished = this.block_control.add_line();
        this.add_ball();
        if(!gameFinished){
            this.clickOn = true;
            Mode = "drawFlyMovement";
        }
        else{
            app.draw();
            this.block_control.draw();
            alert("game Finished");
        }
    }
    add_ball(){
        let tempBall = new Ball();
        tempBall.x = this.finished_x;
        tempBall.y = canvas.height - tempBall.r;
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

function init(){
    app = new App();
    block_control = new BlockControl();
    ball_control = new BallControl(block_control);
    block_control.add_line();
    gameFinished = false;
    Mode = "drawFlyMovement";
}

init();

function draw(){
    if(!gameFinished){
        app.draw();
        block_control.draw();
        if(Mode === "drawFlyMovement"){
            ball_control.drawFlyMovement();
        }
        if(Mode === "drawCollectMovement"){
            ball_control.drawCollectMovement();
        }
        if(Mode === "drawMapMovement"){
            ball_control.drawMapMovement();
        }
    }
}

setInterval(() => {
   draw(); 
}, timeFrame);