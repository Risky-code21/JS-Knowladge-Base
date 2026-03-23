"use strict";

// todo ------------------------------------------------------ Material section

// !! note
// 1. Pengelolaan jenis memory pada heap
// 2. Bagaimana V8 engine otomatis memasukan beberapa memori tambahan untuk menampung data pada push methode dan menghindari alokasi berulang kali
// 3. Tips untuk tidak melakukan perubahaan pada array kalau perubahaan dilakukan pada tengah tengah ataupun awal array
// 4. Perulangan yang akan terjadi di V8 jika kita tidak mendengarkan tips pada no ke - 3

// Base array
let sensor = [30, 32, 100, 500, 500, 500];
console.log(sensor);

let dumpSensor;

// Mutating methode array
// !! Eng version. This method is use if we need to change our array, without make a new array. Why ? because modify the array will always towards to the same pointer, so we only change the same array not another array or copied element from the array we are changging. The method is memory friendly because we change the sama array, except we use some methode like : unshift, slice, splice, shift that make change in earlier of array or in the middlew of the array.
// !! Indo version. Metode ini sendiri digunakan  unntuk merubah array yang kita miliki tanpa perlu membuat array baru. Kenapa ? karena kita memodifikasi array yang sama karena setiap metode disini akan meunju ke pointer yang sama untuk merubah array nya. Ralat dari penjelasan sebelumnya, ternyata metode ini sendiri ternyata lebih ramah memori terutama untuk metode push, pop yang memungkinkan untuk menghapus atau menambah elemen pada akhir array. Pengecualian besar untuk metode yang melakukan perubahan di awal ataupun di tengah tengah array, seperti shift, unshift, splice dan sisanya.

// 1. Push
// Added last elment in the end of the array
// Menambah elemen terakhir pada array
console.time("Execution mutating method ---- Push");
sensor.push(200);
console.timeEnd("Execution mutating method ---- Push");

// 2. Pop
// Removed last elment in the end of the array
// Menghapus elemen terakhir pada array
console.time("Execution mutating method ---- Pop");
sensor.pop();
console.timeEnd("Execution mutating method ---- Pop");

// !! Be carefull, read the warning above before use this methode
// 3. Unshift
// Added first elment in the earlier of the array
// Menambah elemen pertama pada array
console.time("Execution mutating method ---- Unshift");
sensor.unshift(200);
console.timeEnd("Execution mutating method ---- Unshift");

// 4. Shift
// Removed first elment in the earlier of the array
// Menghapus elemen pertama pada array
console.time("Execution mutating method ---- Shift");
sensor.shift();
console.timeEnd("Execution mutating method ---- Shift");

// 5. Splice added version
// Added, start indeks 2 and after that will delete 0 element, the element is 1000
// Menambahkan elemen di tengah array, memulai seleksi pada indeks 2, dan menghapus 0 element setelah indeks 2, kemudian menambahkan angka 1000
sensor.splice(2, 0, 1000);
console.log(sensor);

// 5. Splice removed version
// Removed version, start indeks 2 and after that will delete 1 element after index 2
// Menghapus elemen di tengah array, memulai seleksi pada indeks 2, dan menghapus 1 element setelah indeks 2
sensor.splice(2, 1);
console.log(sensor);

// 5. Splice modified version
// Removed version, start indeks 2 and after that will delete 1 element after index 2 and added 1 element 9999
// Menghapus elemen di tengah array, memulai seleksi pada indeks 2, dan menghapus 1 element setelah indeks 2, kemudian menambahkan 1 elemen baru yaitu  9999 di posisi tersebut
sensor.splice(2, 1, 9999);
console.log(sensor);

// Non mutating methode array
// !! Eng version. Diffrent from mutating methode, Non mutating methode make change to array but it will make a new array that include the changes we have changed before. this method is not memory frienly, because if we use this method we always make the copied of the old array and can make trash in the memory.
// !! Indo version. Berbeda dengan mutating methode sebelumnya, non mutating methode sendiri tidak mengubah array asli, melainkan melakukan perubahan pada array, array yang telah dirubah elemen nya ini akan menjadi array baru di memori berdasarkan array lama namun telah dirubah. Metode ini tidak ramah memori, karena jika kita sembarangan menggunakannya tanpa mempertimbangkan refrensi variable global maka akan ada tumpukan sampah didalam memory kita, karena selagai suatu array terkait dengan refrensinya maka array tersebut akan terus hidup meski ada duplikatnya

// 1. Map
// Loop all array elements and change them one by one with the rule we definite in the block scope of the looping
// Melakukan looping pada semua elemen array, lalu merubah mereka semua satu persatu menjadi elemen baru, dan akan dikelompokan dalam array baru dengan pannjang yang sama.
dumpSensor = sensor.map(function (s) {
  return s * 2;
});
console.log(dumpSensor);
// !! Reintialitation to empty value
dumpSensor = [];

// 2. Fillter
// Loop all array elements and check them one by one, if the element accepted the rule it will be tak in the new array, but in diffrent length because we only select the element that accepted the rule
// Melakukan looping pada semua elemen dan melakukan ceking pada setiap elemen untuk memastikan elemen memiliki kesesuaian dengan syarat yang ada, dan element yang memenuhi syarat saja yang akan dipetakan kedalam array baru sehingga panjang array baru dan lama tidak akan sesuai
dumpSensor = sensor.filter(function (s) {
  return s == 500;
});
console.log(dumpSensor);
// !! Reintialitation to empty value
dumpSensor = [];

// 3. Reduce
// Loop all array elements and calculate them one by one, and return a value that be the result from the caluculation
// Melakukan looping pada semua elemen dan melakukan kalukasi untuk setiap elemen, jadi elemen 1 akan ditambah dengan elemen 2 hingga seterusnya sampai selesai, dan ada akumulator untuk titik mulai melakukan penjumlahaannya. Ini tidak mengembalikan array tapi mengembalikan value hasil kalkulasi
dumpSensor = sensor.reduce(function (acc, curr) {
  return acc + curr;
}, 0);
console.log(dumpSensor);
// !! Reintialitation to empty value
dumpSensor = [];

// 4. Slice
// Select the element from certain range, and group selected elemnt into new array
// Melakukan seleksi pada elemen array yang menjadi refrensi, lalu array yang diseleksi akan dipetakan menjadi array baru, seperti dibawah akan hanya mengambil elemen dimulai dari indeks 1 ( selemen indeks 1 disertai ) sampai indeks 3 ( elemen indeks 3 tidak disertai)
dumpSensor = sensor.slice(1, 3);
console.log(dumpSensor);
// !! Reintialitation to empty value
dumpSensor = [];

// todo ------------------------------------------------------ Material section

// todo ------------------------------------------------------ Question section

// todo ----------- sorting the array, and compartor used
let termalDegree = [100, 89, 10, 197, 100, 123];
let termalDegDumm = termalDegree.map((val) => val);

// Before sort
console.log(termalDegree);
console.log(termalDegDumm);

// After sort with builtin mutating methode
console.log("Before sort ------------------------- Builtin methode");
// !! Eng version, use comperator function, in this case i use arrow function to simplfy definate a small function without important return. Comperator function is use to compare with subtraction each element of the array ASCII, so we make sure that the sort we always accurate because the sort method in this case is not indirect use their element decimal value, but the sort use the ASCII value of the element
// !! Indo version, gunakan comperator function disini, saya menggunakan arrow function untuk memudahkan mendefinsikan function kecil tanpa return yang penting. Comperator function sendiri digunakan untuk memastikan nilai perbandingan kita sesuai dan akurat, dengan melakukan operasi pada setiap nilai yang ada di dalam array, karena sorting pada kasus ini tidak secara langsung mengurutkan berdasarkan nilai desimal, melainkan berdasarkan nilai ASCII angka
termalDegree.sort((a, b) => b - a);
console.log(termalDegree);

// After sort with personal loop but in this case all sort is only from biggest to smallest
console.log("Before sort ------------------------- Personal methode");
for (let j = 0; j < termalDegDumm.length; j++) {
  for (let i = 0; i < termalDegDumm.length - 1; i++) {
    let sortEach = termalDegDumm[i] - termalDegDumm[i + 1];
    if (sortEach > 0) {
      termalDegDumm.splice(i, 2, termalDegDumm[i], termalDegDumm[i + 1]);
    } else if (sortEach < 0) {
      termalDegDumm.splice(i, 2, termalDegDumm[i + 1], termalDegDumm[i]);
    } else if (sortEach == 0) {
      termalDegDumm.splice(i, 2, termalDegDumm[i], termalDegDumm[i + 1]);
    }
  }
}
console.log(termalDegDumm);

// todo ----------- Delete the main, but no the backup

let mainHistory = ["Login", "Klik Tombol", "Logout"];
let backUpHistory = mainHistory;

// Before delete the main history
console.log("Before delete ------------ main history");
console.log(mainHistory);
console.log(backUpHistory);

// After delete the main history
// Change the value of main history to empty array
// !! Eng version, Old array won't delete, because the backup array is stay to refrence on its pointer, and GC won't delete all var, array, object if they have a refrence. In this case, we only change the value of the label or variable, no value of the array
// !! Ind version, Array lama yang telah kita buat tidak akan terhapus, karena backup array masih memegang refrensi pointer yang sama yang ada pada HEAP, yang artinya selama pointer array masih ada yang punya array masih akan tetap hidup walau label atau variable pertama yang telah merefensikannya sudah tidak merefrensikannya sekarang
mainHistory = [];
console.log("After delete ------------ main history");
console.log(mainHistory);
console.log(backUpHistory);

// !! Gabungan Eng / Ind ---- Diffrent with methode below, this method will cut the array size even they have elements inside. Metode ini berbeda dengan diatas, ini adalah cara kita memotong kapisitas array refrensi secara langsung sehingga ikut memangkas elemen yang ada didalamnya, dan semua refrensi yang terikat kesini akan memiliki nilai yang tersisa sesuai pemangkasannya
mainHistory = backUpHistory;
mainHistory.length = 0;
console.log("Easter egg ------------ diffrent methode");
console.log(mainHistory);
console.log(backUpHistory);

// todo ----------- Reverse the array, and delete the last element

let exmpDegg = [100, 10, 1, 101, 80];

console.log("Before reverse and pop");
console.log(exmpDegg);

console.log("After reverse and pop");
// Use non mutating methode to make new array without change the old array, the change -> [80,101,1,10,100]
let reverseExmDeg = exmpDegg.toReversed();
// Pop last element and set new array to => [80,101,1,10]
reverseExmDeg.pop();
console.log(reverseExmDeg);
