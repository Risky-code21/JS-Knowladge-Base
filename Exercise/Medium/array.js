"use strict";

// Base array
let sensor = [30, 32, 100, 500, 500, 500];
console.log(sensor);

let dumpSensor;

// Mutating methode array
// !! It's mean we can change the array without need to make new array. Sometime this method can make our app performance more slowly, because the Heap memory need to shift all element of array to make new update we want in array, it depends to how large size of the array.
// !! Mutating method sendiri berarti, metode yang memang berasal dari array yang digunakan untuk memanipulasi array tanpa perlu membuat array baru untuk melihat perubahaannya. Kadang - kadang fungsi yang masuk dalam bagian metode ini bisa memperlambat performa website kita, karena bagian memory yang bersifat dinamis ( HEAP ) perlu menggeser elemen array ke tempat baru guna menambah, ataupun mengurangi elemen yang ada didalamnya. Ini tergantung juga pada seberapa besar array yang kita miliki, semakin besar array performa ketika menggunakan metode ini juga akan semakin lambat
// !! ralat ---- ini hanya untuk metode shift dan unshift saja karena menghapus elemen array dibagian depan

// 1. Push
console.time("Execution mutating method ---- Push");
sensor.push(200);
console.timeEnd("Execution mutating method ---- Push");

// 2. Pop
console.time("Execution mutating method ---- Pop");
sensor.pop(200);
console.timeEnd("Execution mutating method ---- Pop");

// !! Be carefull, read the warning above before use this methode
// 3. Unshift
console.time("Execution mutating method ---- Unshift");
sensor.unshift(200);
console.timeEnd("Execution mutating method ---- Unshift");

// 4. Shift
console.time("Execution mutating method ---- Shift");
sensor.shift();
console.timeEnd("Execution mutating method ---- Shift");

// Non mutating methode array
// !! Diffrent from mutating methode, Non mutating methode make change to array but it will make a new array that include the changes we have changed before.
// !! Berbede dengan metode sebelumnya, Non mutating methode membuat perubahan dalam array namun perubahan tersebut tidak merubah nilai array sumber melainkan membuat array baru yang membawa perubahan baru tersebut

// 1. Map
dumpSensor = sensor.map(function (s) {
  return s * 2;
});
console.log(dumpSensor);

// !! Reintialitation to empty value
dumpSensor = [];

// 2. Fillter
dumpSensor = sensor.filter(function (s) {
  return s == 500;
});
console.log(dumpSensor);
// !! Reintialitation to empty value
dumpSensor = [];

// 3. Reduce
dumpSensor = sensor.reduce(function (acc, curr) {
  return acc + curr;
}, 0);
console.log(dumpSensor);
