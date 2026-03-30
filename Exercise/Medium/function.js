"use strict";

// todo -------------------------- Anonymus function + Higher order function

// todo ------------------- Kind of function in JavaScript
// native function
function sayHello(name) {
  console.log(`Hello my name is ${name} from native function`);
  console.log(`This my relative this object from me: ${this}\n\n`); // --> cameleon this reference and dynamic scope power;
}

// its output
sayHello("Risky andika");

// Anonymus function
const greeting = function (name) {
  console.log(`Hello my name is ${name} from anonymus function`);
  console.log(`This my relative this object from me: ${this}\n\n`); // --> cameleon this reference and dynamic scope power
};

// todo -------------------- diffrences between native function and anonymus function
// !! Eng version, The diffrent between native function and anonymus function is, native function have a name that we can call it with the name of the function, but for anonymus function we can't call it with the name of the function because it doesn't have a name, but we can call it with the variable that we assign to the function. And for this reference, both of them have the same this reference that is cameleon this reference and dynamic scope power, so they will always refer to the object that is calling the function, and if there is no object that is calling the function, they will refer to the global object. a little extra about their calling frequence, native scope have bigger calling frequence then anonymus function, because the native function act as his name "function" modularity concept, but in the other side anonymus function usually use for one time execution, so they have smaller calling frequence than native function.
// !! Indo version, Perbedaan antara native function dan anonymus function adalah, native function memiliki nama yang dapat kita panggil dengan nama fungsi tersebut, tetapi untuk anonymus function kita tidak dapat memanggilnya dengan nama fungsi karena tidak memiliki nama, tetapi kita dapat memanggilnya dengan variabel yang kita tetapkan ke fungsi. Dan untuk referensi this, keduanya memiliki referensi this yang sama yaitu referensi this cameleon dan kekuatan scope dinamis, jadi mereka akan selalu merujuk ke objek yang memanggil fungsi, dan jika tidak ada objek yang memanggil fungsi, mereka akan merujuk ke objek global. Sedikit tambahan tentang frekuensi pemanggilan mereka, native scope memiliki frekuensi pemanggilan yang lebih besar daripada anonymus function, karena native function bertindak sebagai konsep modularitas "function", tetapi di sisi lain anonymus function biasanya digunakan untuk eksekusi satu kali, jadi mereka memiliki frekuensi pemanggilan yang lebih kecil daripada native function.

// its output
greeting("Risky andika");

// arrow function
const farewell = (name) => {
  console.log(`Hi my name is ${name}, and Goodbye from arrow function`);
  console.log(`This my relative this object from me: ${this}\n\n`); // --> permanent this reference and lexical scope power
};
// todo -------------------- diffrences between the three function (native function, anonymus function and arrow function)
// !! Eng version, The diffrent between native function, anonymus function and arrow function is, native function and anonymus function have the same this reference that is cameleon this reference and dynamic scope power, so they will always refer to the object that is calling the function, and if there is no object that is calling the function, they will refer to the global object. But for arrow function have permanent this reference and lexical scope power, so they will always refer to the object that is in the scope where the function is defined. And for their calling frequence, native scope have bigger calling frequence than anonymus function, because the native function act as his name "function" modularity concept, but in the other side anonymus function usually use for one time execution, so they have smaller calling frequence than native function. And for arrow function usually use for one time execution or for short and simple function, so they have smaller calling frequence than native function and anonymus function.
// !! Indo version, Perbedaan antara native function, anonymus function dan arrow function adalah, native function dan anonymus function memiliki referensi this yang sama yaitu referensi this cameleon dan kekuatan scope dinamis, jadi mereka akan selalu merujuk ke objek yang memanggil fungsi, dan jika tidak ada objek yang memanggil fungsi, mereka akan merujuk ke objek global. Tetapi untuk arrow function memiliki referensi this permanen dan kekuatan scope leksikal, jadi mereka akan selalu merujuk ke objek yang berada dalam scope tempat fungsi didefinisikan. Dan untuk frekuensi pemanggilan mereka, native scope memiliki frekuensi pemanggilan yang lebih besar daripada anonymus function, karena native function bertindak sebagai konsep modularitas "function", tetapi di sisi lain anonymus function biasanya digunakan untuk eksekusi satu kali, jadi mereka memiliki frekuensi pemanggilan yang lebih kecil daripada native function. Dan untuk arrow function biasanya digunakan untuk eksekusi satu kali atau untuk fungsi pendek dan sederhana, jadi mereka memiliki frekuensi pemanggilan yang lebih kecil daripada native function dan anonymus function.

// its output
farewell("Risky andika");
