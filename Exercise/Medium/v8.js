/// todo ------------------------------------------------------ V8 learn scope

// todo -------------------- some experiment
// These keywords use to actived the strict mode of JS ES6 rule, and ignore last rule from ES5 or down version before it
"use strict";

// Trying to implement case when we use interpreted, jit or both of them
// Condition when js V8 engine is use interpreted
function add(a, b) {
  return a + b;
}

// The first initialition and used function will make the V8 engine predict that the 'add' function only recive the paramater with type number
// !!tips, if we use static type in our variable, function param, or the other that use to store a value, we can make compile process more quick, because V8 engine like it.
add(10, 20);
add(10, 90);
add(20, 20);

// But if we change the parameter except integer, exmp like string or the other type
// V8 will use the interpreter because that will always predircted, never fixed or static type
add("My", "Name");

// Chekcking when JS engine will use same hidden class in there in the turboFan ( part of JIT compilation ) and when it will use Ignitation interpreted and made template manually and translated it into intermediate languange. Ignitation interpreted process above will repeated until JS engine get the fixed structure of the program block
// !! change from 10.000.000 to 10, to execute other program
const limitCount = 10;
// Empty array to save object data that was made by the loop process
let dumpArray = [];

// Method 1, it will run cleary by the JIT compilation
// Because the object will always in same structure until the end of loop
console.time("Execution time of structured object push method");
for (let i = 0; i < limitCount; i++) {
  // Predictable by JIT compilation, because it has same structure
  let structuredObject = { x: i, y: i + 1 };
  // !!I add this array method
  // !!Why ??, because if we don't use the object for anything in our program, that object won't made by the program, because the program is secure and lazy,if the object is never used, it wont't created by the engine or our program
  // !! Indo version, mengapa saya menambahkan metode array push dalam hal ini ? karena jika object yang kita buat tidak kita gunakan, object tersebut akan dianggap sebuah kode mati dan tidak akan diproses ataupun dibuat oleh V8 engine JS
  dumpArray.push(structuredObject);
}
console.timeEnd("Execution time of structured object push method");

// The result of structured object
console.log("Total data Method 1:", dumpArray.length);

// Reinsialitation the array to empty value
dumpArray = [];

// Method 2 it will run cleary but more slowly then first method we have declared
// Because the object never has a predicted structure, and then will make V8 and JIT always predict to how we will make a storage in RAM for save this object.
console.time("Execution time of unstructured object push method");
for (let i = 0; i < limitCount; i++) {
  // Transition hell will make process slowly
  // Becaause it never has a fix structet
  // Same as we declared a variable but in any type and without fix or static type
  let unstructredObj = {};
  unstructredObj.x = i;
  unstructredObj.y = i + 1;
  // !!I add this array method
  // !!Why ??, because if we don't use the object for anything in our program, that object won't made by the program, because the program is secure and lazy,if the object is never used, it wont't created by the engine or our program
  // !! Indo version, mengapa saya menambahkan metode array push dalam hal ini ? karena jika object yang kita buat tidak kita gunakan, object tersebut akan dianggap sebuah kode mati dan tidak akan diproses ataupun dibuat oleh V8 engine JS
  dumpArray.push(unstructredObj);
}
console.timeEnd("Execution time of unstructured object push method");

// The result of unstructured object
console.log("Total data Method 2:", dumpArray.length);

// !!tips, V8 and JIT never care about the length of variable value, they always care about how they can make the object have clear storage to save
// !! Indo version, initinya V8 dan JIT tidak akan peduli apakah nilai variable kita panjang atau tidak, tapi mereka lebih peduli tentang seberapa konsisten kita mendefinsikan variable dalam type apa agar mereka bisa mengalokasikan memori yang benar untuk variable tersebut

// todo -------------------- some pratice
// todo - task 1, how to optimize GC ( Garbage collector ) to throw away the useless block code on this program

console.time("task 1 execution time");
// Array log task 1, array save all log
let logGroupGlobal = [];

// Function to insert log to global group array, so we don't need to insert it manualy in array
function insertLog(newLog) {
  logGroupGlobal.push(newLog);
  console.log(`log ${newLog} saved succsesfully!`);
}

// iteration to represent many log inserted in the same time by the program
// !! change from 1.000.000 to 10, to execute other program
for (let i = 0; i < 10; i++) {
  insertLog(`data ${i + 1}`);
}

console.timeEnd("task 1 execution time");

//!! after execution i try to reintialitaion the log array, and mark the data was saved in this area as rubbish
logGroupGlobal = [];

// todo - end of task 1

// todo - task 2, how V8 mutable dan immutable work in variable and array, and what diffrence between of them

let var1 = "my name";
let var2 = var1;
var1 = "my super name";

// the result
console.log(var1); // output my super name
console.log(var2); // output my name. diffrent value with value in var1, this variable use pass by value consept
// !! pass by value consept is, where the variable has refrence value but they not save pointer value that contains real value, but they save the real value of the variable that they refrenced. Usually if variable set a primal type as number, string and other
// !! indo version, pass by value hanya digunakan ketika kita mengset variable kedalam type data yang primitif, variable tersebut akan memesan memori di stack dan memasukan nilai asli bukan nilai pointer dari variable yang mereka refrensikan, sehingga itu mereka independen walau terlihat saling mempengaruhi satu sama lain didalam kode yang kita buat

let array1 = ["my", "super", "name"];
let array2 = array1;
array1.push("is");

console.log(array1); // output ["my", "super", "name", "is"]
console.log(array2); // output ["my", "super", "name", "is"], because it link into same pointer as array1 values, because for each dynamic data will always use pass by refrence consept
//!! Pass by refrence consept is, where the variable just only set their value into pointer value end then use the pointer to refrence the real value. Usually use if variable set a dynamic value as array, object and other
// !! indo version, pass by refrence hanya digunakan ketika mengset variable kedalam dynamic value contohnya array , object dan list lainnya, dan value tersebut akan disimpan didalam memori Heap. Berbeda dengan pass by value yang langsung menyimpan isi murni dari variable, variable yang disimpan di stack hanya menyimpan alamat memori tempat nilai variable asli disimpan didalam stack, jadi jika satu array menjadi refrensi nilai untuk array lain, walau nilai array yang menjadi refrensi ini dirubah setiap variable yang merefrensikan alamat nilai akan mendapatkan nilai yang sama dengan yang ada di Heap memori

// todo - end of task 2

// todo - task 3, how the V8 turbofan act if in the function there are any type of param, and then we insert that param with argument that have to diffrent type ( string and number )

function addShow(a, b) {
  dumpArray.push(`${a + b}`);
}
// Number type of loop process
console.time("Number execution time of turbofan JIT");
for (let i = 0; i < 100000; i++) {
  addShow(i, i + 1);
}
console.timeEnd("Number execution time of turbofan JIT");
console.log(`the result: ${dumpArray.length}`);
dumpArray = [];

// String type of loop process
console.time("String execution time of turbofan JIT");
for (let i = 0; i < 100000; i++) {
  addShow(`Hello ${i}`, `Hello ${i + 1}`);
}
console.timeEnd("String execution time of turbofan JIT");
console.log(`the result: ${dumpArray.length}`);
dumpArray = [];

// todo - end of task 3

// todo ------------------------------------------------------ V8 learn scope
