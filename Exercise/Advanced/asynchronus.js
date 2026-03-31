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

// !! Eng version, Even though the setTimeOut setted in 0 second to execution, it will be save in Queue first until console one and console three are finished running in call stack. Anythings that we call from queue and then we run that into callstack, called as Queue callback
// !! Indo version, mesikupun seperti yang terlihat bahwa kita mengatur waktu eksekusi dari setTimeOut itu akan dimulai dalam 0 detik, dia tetap tidak akan masuk seperti teman-teman consolenya kedalam callstack, semua hasil eksekusi function yang termasuk Asynchronus function akan masuk kedalam Queue terlebih dahulu, sampai semua selesai di eksekusi didalam callstack, barulah hasil console atau asynchornus function dapat terlihat di layar seperti console lainnya
// First exec
console.log("Console number 1");

// Last exec
setTimeout(function () {
  console.log("Console number 2, run time: 0 second");
  console.log("\n\\n");
}, 0);

// Second exec
console.log("Console number 2");
