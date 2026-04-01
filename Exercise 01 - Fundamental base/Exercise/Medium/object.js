"use strict";

// todo ------------------------------------------------------ Material section

// todo ------- fast concept
// ?? dictionary
// !! Eng version,type data of the object, dictionary always definite as type data where type data use key to save their value on the heap memory
// !! Indo version, type data dari object, dictionary sendiri selalu didefinsikan sebagai type daya yang dimana type datanya itu sendiri menggunakan key sebagai alat untuk memetakan setiap value yang mereka miliki secara spesifik

// ?? hash table
// !! Eng version, how the memory save the data, hash table itself is a method for storing each type of data that has a dictionary type
// !! Indo version, hash table itu sendiri merupakan metode untuk menyimpan setiap type data yang memiliki type dictionary

// object create methode
// object prototyping
// GOD object __proto__
// Uji coba konsep dan rumus yang ada pada konsep hash table dan dictionary
// Path belajar

// Object exm for lesson
let objectExm = {
  // Object properties
  // !! Eng version, Object properties can be defined with any type value, and diffrent with class properti that must be in static type
  // !! Indo version, Object propertie bisa didefinisikan dengan type apapun secara spesifik sepert variable pada umumnya di js, dan berbeda dengan class properti yang mewajibkan untuk mendefinsikan properti dalam type yang statis
  name: "risky",
  status: "active",
  work_time: 100,
};

// todo ------------------------------------------- Introducing object section begin

console.log("----------------------------------- Object introducing");
// Before modified
// Checking execution time
// !! Eng version, console time doesn't represent how long the v8 engine take to execution object in memory, but console time represent how long the web browser render the object is already done before in screen console browser.
// !! Indo version, console time tidak merepresentasikan berapa lama waktu yang diperlukan v8 engine untuk eksekusi object didalam memory, namun console time merepresentasikan berapa lama waktu yang diperlukan web browser untuk eksekusi hal yang ingin kita tampilkan didalam console web browser tersebut.
console.time("Speed object to show on console screen");
console.log(objectExm);
console.timeEnd("Speed object to show on console screen");

// After modified
// Modified object property
objectExm.status = "unactive";
console.log(objectExm);

// if we need to search of the object properties but with defined name in variable, and we have a key propery with underscore or unique char
let secretProperty = "work_time";
console.log(objectExm[secretProperty]); // !! -> Easeter egg, why the result is 100?
console.log("----------------------------------- Object introducing \n\n");

console.log(
  "----------------------------------- Execution speed testing hidden classes",
);
// Performance scope, to see how long v8 engine needs to take an object from the memory
// !! Use super massive variable value for iteration
let superIterationCounter = 100000;

// Structured object loop
console.time("Static object execution time from v8 engine");
for (let i = 0; i < superIterationCounter; i++) {
  // !! Eng version, Execution is fast, because the structure seldom change, because of that v8 engine will make hidden class and input the execution into the turbofan and ready to compile to be a machine language, that will run super fast dan cleary
  // !! Ind version, Executionnya cepat, karena strukturnya jarang berubah dan karena itu v9 engine otomatis memiliki sistem hidden class yang sama yang akan dimasukan kedalam turbofan milik jit untuk dikompilasi menjadi bahasa mesin yang berjalan super cepat dan mulus
  let looperObj = { x: 1, y: 2 };
  looperObj.x += i + 1;
}
console.timeEnd("Static object execution time from v8 engine");

// Unstructured object loop
console.time("Dynamic object execution time from v8 engine");
for (let i = 0; i < superIterationCounter; i++) {
  // !! Eng version, Execution is slow then execution with static structure, because the structure often change , because of that v8 engine will make hidden class but in every hidden class was created that will be deleted, because the structure change directly after the hidden class was created, this process will be input in to igination that make the process run slowly then process before.
  // !! Indo version, Ekseukusinya lambat daripada ekseuksi dengan struktur statis sebelumnya, karena struktur dari objectnya sendiri sering berubah, karena hal itu v8 engine akan membuat hidden class tetapi di setiap pembuatan hidden class, hidden class yang dibuat akan dihapus karena ada perubahan struktur dari object yang mengganggu hidden class sebelumnya, proses ini akan masuk kedalam iginatation blok dalam jit, yang dimana proses biasanya akan berjalan lebih lambar karena masuk kedalam proses interpretasi dalam interpreter dan buakn kompilasi
  let looperObj = { x: 1, y: 2 };
  // After the object created, the hidden class created too
  delete looperObj.x;
  // Hidden class created before will be deleted and v8 will make a new hidden class
  looperObj.x += i;
  looperObj.y += i;
  looperObj.secret += 1;
}
console.timeEnd("Dynamic object execution time from v8 engine");
console.log(
  "----------------------------------- Execution speed testing hidden classes\n\n",
);

// Super experiment with windows object, to see how the memory in this case is heap, control our things that we need to save
// window.largeData = [];
// for (let i = 0; i < superIterationCounter; i++) {
//   window.largeData.push({ name: `user + ${i + 1}`, uniq: i + 10 });
// }
// console.log("Data ready to explore");

// todo ------------------------------------------- Introducing object section end

// todo ------------------------------------------- Methode to create an object section begin

// ----- Literal methode
// The example can see above all of the code ☝️
console.log("----------------- Literal object");
console.log(objectExm);
console.log("----------------- Literal object\n\n");

// ===== Function factory methode
console.log("----------------- Function factory object");
function studentFactory(studentName, presentNumber, favoriteSubject) {
  return {
    name: studentName,
    present_number: presentNumber,
    favorite_subject: favoriteSubject,
  };
}
const firstStudent = studentFactory("Risky andika", 20, "Alogrithm");
console.log(firstStudent);
console.log("----------------- Function factory object\n\n");

// ----- Constructor function methode
// !! Eng version, old version from class methode concept, and this methode is already seldom to used because this method has replaced by the class methode
console.log("----------------- Constructor function object");
function userFactory(nama) {
  this.nama = nama;
}
// Add static properties, the work flow is same as the class methode
userFactory.action = function () {
  console.log(`Hallo i'am ${this.nama}`);
};

// Add instance properties
userFactory.prototype.bye = function () {
  console.log(`Bye from me, ${this.nama}`);
};

const firstUser = new userFactory("Cak embargo");
console.log(firstUser);
console.log("----------------- Constructor function object\n\n");

// ----- Blueprint class methode
// !! Eng version, Recomendation methode for structured object and inheritance object
// !! Indo version, This methode have same work flow as object create, but object create use inhertical prototype approach, but class use class approach with never lost its object charcteristic because it is just a syntatic sugar to make js look like language that implements object oriented programming approach.
console.log("----------------- Class definition or Blueprint object");
class BalisticMisile {
  // !! Work flow same as constructor function but use class blueprint apporach to make the programmer familiar with this sturcture

  // How to add static properties inside
  static type = "T-sar bomba";

  constructor(name) {
    // -> function constructor()
    // this will autmaticly make an properties same as in the literal object
    this.name = name;
  }

  // But diffrent with literal function that have some defination with properties when we try to build a methode, in the class, object methode defined like a function, but without keyword function, because all block scope in the class is actualy a function.
  launch() {
    // -> function launch()
    console.log(`Launch ${this.name} misile`);
  }
}

// How to add static methode or properties outside of the class, in the class methode concept
BalisticMisile.sayonara = "hai";

// How to add the instance methods or properties outside of the class, in the class methode concept
BalisticMisile.prototype.connecttion = "Launch success";

let protoMisile = new BalisticMisile("Super misile 67");
console.log(protoMisile);
protoMisile.testing = "test from missile";
console.log(protoMisile);

// Same refrence as the class, the class that the object refrence is refrenced a god object or prototyple object which become a forrunner for the JS language
console.log(protoMisile.__proto__);
console.log("----------------- Class definition or Blueprint object\n\n");

// ---- Object create methode
// !! Eng version, use this method if we need to make a inhertical prototyple in object with old method. or you can use this method to build a new god object base on your idea because this method can give you a flexibelity to setup manualy your new object you make.
// !! Indo version, Gunakan metode ini jika kita membutuhkan pewarisan prototype model lama, atau bisa juga digunakan untuk membuat god object sesuai ide kita sendiri jika kita ingin membuat base object untuk refrensi object lainnya, dan pewarisan untuk object disini bisa kita  tentukan sendiri juga karena fleksibelitas yang telah dibuat dan ketika membuat object kita bisa melakukan setup manual sendiri karena pewarisan dibebaskan yang artinya kita tidak diharuskan mewarisi proto seperti object literal pada umumnya, ini berlaku jika kita memberikan parameter object refrensi sebelum membuat objectnya. Terkadang jika ingin setup sendiri dan mengarah ke lanjutan kita perlu melakukan beberapa operasi untuk menampilkan nilainya dan itu lumayan sulit, jadi sekarang metode ini lebih cocok ketika kita ingin membuat object dengan skala untuk framework atau object besar.
console.log("----------------- Object create methode object");
let superMachine = {
  name: "super machine",
  type: "Code 1",
};

// Refrence to superMachine object, that will have all superMachine properties and methode
let duplicateSuperMachine = Object.create(superMachine);
duplicateSuperMachine.action = function () {
  console.log("Duplicate status actived");
};
// will make a literal object with proto refrence
console.log("Object refrence");
// will show all properties and methode from the refranced object
console.log(duplicateSuperMachine.__proto__);
console.log("Literal object");
// will show all properties where the properties is current object properties not its refrence properties
console.log(duplicateSuperMachine);

// todo ------------------------------------------- Methode to create an object section begin end

// todo ------------------------------------------- Explore the god object or Object proto begin

// -------------------- Linking keyword in objec ___proto___
console.log("------------------------- Linking keyword with __proto__");
let dollBluePrint = {
  factoryName: "Rolex doll",
  ownerName: "Risky Andika",
};

let doll1 = Object.create(dollBluePrint);
doll1.name = "JS Roles doll super";
console.log(doll1);

// Try to see the linking by ___proto___ keyword
// !! First proto ---> dollBluePrint
console.log(doll1.__proto__);

// !! Second proto ---> God object or object prototype --> end of linking proto
console.log(doll1.__proto__.__proto__);

// !! third proto ---> null
console.log(doll1.__proto__.__proto__.__proto__);
console.log("------------------------- Linking keyword with __proto__\n\n");

// -------------------- God object properties that inheritance to other object

console.log("----------- Get the properties of the object itself");
console.log(Object.getOwnPropertyNames(Object.prototype));
console.log(Object.getOwnPropertyNames(doll1)); // -> easter egg, because without keyword prototype to accses the properties
console.log("----------- Get the properties of the object itself\n\n");

console.log("----------- Checking some properties are there in the object");
console.log(doll1.hasOwnProperty("name")); // -> true, real own of this object
console.log(doll1.hasOwnProperty("ownerName")); // -> false, cause ownername is refrence variable from object refrencend
console.log("----------- Checking some properties are there in the object\n\n");

// -------------------- Visual object properties between static and instance

// console.log("----------- Checking the instance or object refrence");
// console.log(doll1 instanceof dollBluePrint);
// console.log(doll1 instanceof Object);
// console.log("----------- Checking the instance or object refrence\n\n");

console.dir(dollBluePrint);

// -------------------- Proto refrence checking

const proto = Object.getPrototypeOf(doll1);
console.log(proto === dollBluePrint.prototype); // true

// todo ------------------------------------------- Explore the god object or Object proto end

// todo ------------------------------------------- How the formuia works begin

console.log("--------------------------- Formula work flow");
/// !! This is the formula where can we see the visualitation about heap to save all of object or dictionary implement type data
function v8ForumlaHeap(key, capacity) {
  let totalSum = 0;
  const p = 31;

  // !! Sigma symbol refrence process (Σ)
  for (let i = 0; i < key.length; i++) {
    // Find ascii code foe each char in array of key object
    let asciiChar = key.charCodeAt(i);

    // The ascii that we have fopnd before will calculate with p elemen that always represent unique number (31)
    let calculation = asciiChar * Math.pow(p, i);

    // Sava the sumation that will used in mpdulo operation after this sigma process
    totalSum += calculation;

    console.log(
      `Alphabet ${key[i]} -> Ascii: ${asciiChar} * Exponent: ${p}^${i} = ${calculation}`,
    );
  }

  // Modulo process, that will modulo all calculation ascii before with capcity of the memory. In this case, we use imitation value because we don't know spesificly about the maximum size of the memory
  let finalMemoIndex = totalSum % capacity;
  console.log(
    `Result, the object key will save in memory number -> ${finalMemoIndex}\n\n`,
  );

  // Final index where we save the memory in array heap or heap locker
  return finalMemoIndex;
}

// The testing's section
// Imitation capcity from memory
const HEAP_CAPACITY = 20;

// Imitation heap locker or array heap
// Array index that doesn't have any value will filled  with value [empty] as we can see in our code editor
const heapLocker = new Array(HEAP_CAPACITY).fill("[Empty]");

// We test the v8 forumla heap that will return spesific number to save the memory with the key although we knew that the array newver has a key inside because it is not use dictionary and hash table concept
let indexOfId = v8ForumlaHeap("kode", HEAP_CAPACITY);
let indexOfName = v8ForumlaHeap("username", HEAP_CAPACITY);
let indexOfValue = v8ForumlaHeap("value", HEAP_CAPACITY);

// Intialitation the value object from spesifc memory that we have created before
heapLocker[indexOfId] = 1;
heapLocker[indexOfName] = "Risky andika";
heapLocker[indexOfValue] = 10000;

// Show the final result
heapLocker.forEach((val, index) => {
  console.log(`Locker - ${index}: ${val}`);
});
console.log("--------------------------- Formula work flow\n\n");

// todo ------------------------------------------- How the formuia works begin
