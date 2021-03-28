
let t = true;
let arr = [false, true, true, false];
for(let i = 0; i < 10; i++){
    console.log(i);
    t = t && arr[i];
}