
function updatePrimitive(x){
    x = {value: x.value +10};
    return x;
}

function updateObject(y){
    y.value +=10;
    return y
}

let obj1 = {value: 5};
let obj2 = {value: 5};

let newObj1 = updatePrimitive(obj1);
let newObj2 = updateObject(obj2);


console.log(obj1.value); // 5
console.log(newObj1.value); // 15
console.log(obj2.value); // 15
console.log(newObj2.value);  //15