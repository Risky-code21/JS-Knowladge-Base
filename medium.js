/// ------------------------------------------------------ V8 learn scope
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
const limitCount = 10000000;

// Method 1, it will run cleary by the JIT compilation
// Because the object will always in same structure until the end of loop
console.time("Execution time of structured object push method");
for (let i = 0; i < limitCount; i++) {
  // Predictable by JIT compilation, because it has same structure
  let structuredObject = { x: i, y: i + 1 };
}
console.timeEnd("Execution time of structured object push method");

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
}
console.timeEnd("Execution time of unstructured object push method");

// !!tips, V8 and JIT never care about the length of variable value, they always care about how they can make the object have clear storage to save
// !! Indo version, initinya V8 dan JIT tidak akan peduli apakah nilai variable kita panjang atau tidak, tapi mereka lebih peduli tentang seberapa konsisten kita mendefinsikan variable dalam type apa agar mereka bisa mengalokasikan memori yang benar untuk variable tersebut

/// ------------------------------------------------------ V8 learn scope
