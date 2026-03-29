"use strict";

// Default class definiation
// This concept is actually an object literal concept, but js made this for syntatic sugar for the proggramer spesificly programmer with OOP background.
// todo --------------------------------------------- Basic class definition
class Schedule {
  #workTime;
  #meTime;

  constructor(name, time, busyTime, specialTime) {
    this.name = name;
    this.totalTime = time;
    this.#workTime = busyTime;
    this.#meTime = specialTime;
  }

  // Arrow function binding this
  // !! Eng version, The strength of arrow function is the permanent this or lexical scope binding to its parent, this is so suitable if we need the method but the method always called in other function as callback function that need a pointer. The weakness of arrow function is, when we call it as callback, that always make a new function of arrow function we called before, that will make a massive copy of arrow function if we have a lot section that use arrow function
  // !! Indo version, Kelebihan dari arrow function adalah this yang permanen atau pengikatan scope leksikal ke parentnya, ini sangat cocok jika kita membutuhkan method tetapi method tersebut selalu dipanggil di fungsi lain sebagai callback function yang membutuhkan pointer. Kelemahan dari arrow function adalah dia tidak memiliki konsep this sendiri, jadi dia akan selalu merefrensi this dari parentnya, jadi jika kita membuat method dengan arrow function didalam class maka this nya akan merefrensi class itu sendiri atau instance yang menggunakan class, secara permanen. Namun kelemahan dari arrow function adalah ketika kita memanggilnya sebagai callback, yang selalu membuat fungsi baru dari arrow function yang kita panggil sebelumnya, itu akan membuat salinan besar dari arrow function jika kita memiliki banyak section yang menggunakan arrow function tanpd terkendali.
  showtime = () => {
    console.log(
      `Time reminder from schedule ${this.name} is ${this.totalTime}`,
    );
  };

  showWorkTime() {
    console.log(
      `The golden time for schedule ${this.name} is ${this.#workTime}`,
    );
  }

  get showSpecialTime() {
    return `The special time for schedule ${this.name} is ${this.#meTime}`;
  }

  set changeSpecialTime(newTime) {
    this.#meTime = newTime;
    console.log("Me time changed");
  }
}

// !! Eng version, checking element that build the class, and a the same time prove that class is just a syntatic sugar for object literal, and the method that we create inside the class is just a function that we assign to the property of the class.
// !! Ind version, Memeriksa elemen yang membangun kelas, dan pada saat yang sama membuktikan bahwa kelas tersebut hanyalah sintaksis tambahan untuk literal objek, dan metode yang kita buat di dalam kelas hanyalah sebuah fungsi yang kita tetapkan ke properti kelas tersebut.
// ------> Prove console, that prove the class is just a object
console.log(Schedule);
// ------> __proto__ will refrence to the GOD Object
console.log(Schedule.__proto__); // First parent refrenced -> Function Object
console.log(Schedule.__proto__.__proto__); // Last parent refrenced or biggest parent -> God Object

// Create instance of class
const schoolSchedule1 = new Schedule("School schedule", 540);
console.log(schoolSchedule1.name); // -> schedule's name -> School schedule
console.log(schoolSchedule1.totalTime); // -> schedule's total time -> 540 minutes
//console.log(schoolSchedule1.showtime()); // -> schedule's show time -> undefined
// use return in the showtime function to esnure that function have a return value inside
schoolSchedule1.showtime();

// This acident
// !! Eng version, This's happend because this concept inside the instance that refrence class doesn't have a good binding, and always relative to the function that their called. The function is setimeout, and as it happens setimeout doesn't have a default value for this concep, so it will fallback a undefined value for this situation.
// !! Indo version, Ini terjadi karena konsep this didalam instance yang dibuat dari refrensi class tidak memiliki binding atau pengikatan refrensi yang kuat pada class yang di refrensi, jadi dia menggunakan konsep this awal yang akan selalu merefrensi hal yang paling dekat, yang dalam hal ini adalah settimeout. Namun karena kebetulan settimeout tidak memiliki nilai default bawaan untuk this maka settimout menggembalikan nilai undefined untuk this valuenya.
setTimeout(schoolSchedule1.showtime, 100);

// resolve
// ---- Closure
// Use closure to bind the this concept to the class that we want to refrence, in this case is schoolSchedule1
setTimeout(() => schoolSchedule1.showtime(), 100);

// ---- Binding
// Use bind method to bind the this concept to the class that we want to refrence, in this case is schoolSchedule1
setTimeout(schoolSchedule1.showtime.bind(schoolSchedule1), 100);

// The last case is use arrow function to build a method class. Why? because arrow function still maintin its scope permanently, so the class refrence or parent refrence is stay the same, in this case is Schedule class or their instances. Implementation above ☝️😁

// todo --------------------------------------------- encapsulation
// New instance, asumtion as a perfect schedule that we have made.
const perfectSchedule = new Schedule("Perfect schedule", 480, 120, 120);
// Show the private value from the private properti called workTime in the class
perfectSchedule.showWorkTime(); // -> The work time for schedule Perfect schedule is 120

// Try to change the private value from the private properti with normal rule we always use to changed the method in an object.
perfectSchedule.workTime = 900;

// The private value never change, because the private properti is only can be access and change inside the class, so we need two special function, that called GETTER and SETTER function that will act as server that changes our private method in the class refrence
console.log(perfectSchedule);

// -------- Getter a special time
console.log(perfectSchedule.showSpecialTime);

// -------- Setter a special time
perfectSchedule.changeSpecialTime = 50;
console.log(perfectSchedule.showSpecialTime);
