var width_num = 6;
class BlockControl{
    constructor(){
        this.line = 1;
    }
    add_line(){
        this.line++;
    }
    draw(){

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

var block_control = new BlockControl();
for(var i = 0; i < 10; i++){
    console.log(block_control.select_position());
}