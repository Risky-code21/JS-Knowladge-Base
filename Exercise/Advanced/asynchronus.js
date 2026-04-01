// todo ---------- Term in this material
// !! Synchronus
// This concept give us way to executed or program chronologically, or this concept require us to execution our program one by one, line by line until the end of proggram

// !! Asynchronus
// This concept allowed us to the some task in one action, if we have 3 task, and two of them need to run directly when the first function was executed, we can use this concept.

// !! Thread
// Way to execution the task from the program we builded. In Js, it only have one thread or usually called as single thread way. If analogizied JS only can do one thing in one time, one by one and the thing must be a light thing and not a heavy thing.

// !! Call stack
// Call stack the storage where js does all execution in the program. Call stack will priority synchronus things,because it need one thread way concept to execution, while the things that use asynchronus will exec first by the next concept that named Web API

// !! Web api
// Web API are all function that builted in from the browser we use, like: Google chrome, Microsoft Edege dan other kind of browser. Web API provide function that use asynchronus concept, and then all of asynchrnous will first exec in its scope because Web API its self can handle heavy job like: download file, get data from http request and other heavey job that need long time for executed.

// !! Queue
// From the Web API we jump into Queue. Queue is storage that Web API saves its execution result, more about Queue as I know, Queue contents will also exec in call stack but its only exec if call stack condition is empty. All contents queue called as Queue callback.

// !! Event loop
// When do we need to pass all of Queue callback into callstack execution? that's when the call stack condition is empty, and how can do we know that? JS has Event loop as a scanner to control and maintain both execution scope. Event loop will automaticly run if it sees call stack is empty and there are some task in Queue, and then it will pass Queue callback one by one, from Queue to Callstack.

// !! Execution context
// Execution context is all above, execution context is where us do all execution above in js, it called as execution context.

// todo ---------------- when js use call stack execution and when js use queue to pass the task in to the call stack.
// !! Eng version, Even though the setTimeOut setted in 0 second to execution, it will be save in Queue first until console one and console three are finished running in call stack. Anythings that we call from queue and then we run that into callstack, called as Queue callback
// !! Indo version, mesikupun seperti yang terlihat bahwa kita mengatur waktu eksekusi dari setTimeOut itu akan dimulai dalam 0 detik, dia tetap tidak akan masuk seperti teman-teman consolenya kedalam callstack, semua hasil eksekusi function yang termasuk Asynchronus function akan masuk kedalam Queue terlebih dahulu, sampai semua selesai di eksekusi didalam callstack, barulah hasil console atau asynchornus function dapat terlihat di layar seperti console lainnya
// First exec
console.log("Console number 1");

// Last exec
setTimeout(function () {
  console.log("Console number 2, run time: 0 second");
  console.log("\n\n");
}, 0);

// Second exec
console.log("Console number 2\n\n");

// todo ---------------- Callback hell case and the birth of promise in JS

// todo ------- Callback hell and closure hell example

setTimeout(function () {
  console.log("-------- Automaticlly watering plant from the garden begin 🫗");
  // Check the ground humidity
  let dryGround = true;
  console.log(
    "Oh no, the ground is dray, we need to turn on automaticly water plant machine 💦",
  );

  if (dryGround) {
    // Check the weather
    // !! Eng version, this is a closure, why? because setTimeOut is a function that can use the previous variable from outer function that have exected. The variable is: let dryGround
    // !! Indo version, ini adalah closure, kenapa? karena setTimeOut adalah function yang bisa menggunakan variable sebelumnya dari outer variable yang menjadi tempat di definsiikan yang telah dieksekusi. Variable yang bisa diambil di lingkup ini: let Ground
    setTimeout(function () {
      let isWillRain = false;
      console.log("Oh no, the rain won't be fall, we need that machine soon");

      if (!isWillRain) {
        // Turn on the machine
        // !! Eng version, this is a closure, why? because setTimeOut is a function that can use the previous variable from outer function that have exected. The variable is: let dryGround, let isWillRain
        // !! Indo version, ini adalah closure, kenapa? karena setTimeOut adalah function yang bisa menggunakan variable sebelumnya dari outer variable yang menjadi tempat di definsiikan yang telah dieksekusi. Variable yang bisa diambil di lingkup ini: let Ground, let isWillRain
        setTimeout(() => {
          console.log("Automaticly watering machine, status on 🤖🚨\n\n");

          // !! Eng version, Whatever we need 4,5 - other dozens of processes? we need more setTimeOut to check every process step by step, that will make hodoken triangle or familiar with callback hell and closure hell because we can have an access outer variable no matter what function block scope it is in.
          // !! Ind version, Namun jika kita memiliki atau membutuhkan banyak sekali eksekusi yang serupa yang membutuhkan setTimeOut panjang seperti ini, kita akan mengalami kesulitan unutk mengelolanya karena function satu ada didalam function satunya lagi dan saling bercabang hingga ke-n yang membuat tidak efisien dan bisa menimbulkan segitiga hadoken seperti jurus ryu di street figther atau biasa disebut sebagai callback hell juga, dan dapat menimbulkan closure hell juga karena satu scope dapat mengakses tiap variable pada scope lain yang ada diatasnya entah ada di scope mana dan di function mana kita.
        }, 1000);
      }
    }, 1000);
  }
}, 1000);

// todo ------- Callback hell and closure hell example replaced by promise

// Check the ground humidity
function checkTheGroundhumidity() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      let isDamp = false;

      if (isDamp == false) {
        resolve(
          "Oh no, the ground is dray, we need to turn on automaticly water plant machine 💦",
        );
      } else {
        reject(
          "We don't need that machine because the ground humiditiy is still good",
        );
      }
    }, 4000);
  });
}

// Check the weather
function checkTheWeather() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      let isRain = false;

      if (isRain == false) {
        resolve("Oh no, the rain won't be fall, we need that machine soon 😠");
      } else {
        reject("Just wait for the rain to fall 😎");
      }
    }, 6000);
  });
}

// Active the water
function activeTheMachine() {
  setTimeout(
    () => console.log("Automaticly watering machine, status on 🤖🚨\n\n"),
    2000,
  );
}

// The next version from the previous callBackHell
// Then keyword allowed us to create a linier structure that more cleary then Hadoken Triangel before
// !! Then use clear way closure, because the scope act as a limit to block acceses to other function exectuion
// !!Indo version, Then menggunakan jalur yang lebih bersih untuk closure, karena scope dari then itu sendiri akan membatasi pengambilan variable yang ada diatas setiap eksekusi function yang kita miliki, contohnya pada hadoken tri angel sebelumnya yang menggunakan closure yang buruk karena kita membiarkan setiap function yang ada satu tingkat di bawah bisa mengakses variable pada function yang ada diatasnya, biasanya karena didefinsiikan didalam satu scope function yang lebih besar. Then hadir untuk menyelesaikan masalah itu, dengan membatasi setiap eksekusi fungsi agar bisa melakukan closure hanya pada lingkup mereka dan lingkup function lain yang dipanggil diluarnya tidak ikut campur mengenainya, dab setiap function memiliki tugas mandiri yang lebih rapi dan maintable seperti beberapa function dari hadoken triangel yang telah dipecah dan kemudian dibuat secara terpisah 👆.
checkTheGroundhumidity()
  .then(function (message) {
    console.log(
      "-------- Automaticlly watering plant from the promise garden begin 🫗",
    );
    console.log(message);
    // Message from checkTheGroundhumidity wont't be access here
    return checkTheWeather();
  })
  // the closure is only happen in the then scope
  .then(function (message) {
    console.log(message);
    // Message from checkTheGroundhumidity and checkTheWeather wont't  be access here
    return activeTheMachine();
  })
  .catch(function (error) {
    console.error(error);
  });

console.log("Wait async to finish... ⌛");
