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
// its output
greeting("Risky andika");

// todo -------------------- diffrences between native function and anonymus function
// !! Eng version, The diffrent between native function and anonymus function is, native function have a name that we can call it with the name of the function, but for anonymus function we can't call it with the name of the function because it doesn't have a name, but we can call it with the variable that we assign to the function. And for this reference, both of them have the same this reference that is cameleon this reference and dynamic scope power, so they will always refer to the object that is calling the function, and if there is no object that is calling the function, they will refer to the global object. a little extra about their calling frequence, native scope have bigger calling frequence then anonymus function, because the native function act as his name "function" modularity concept, but in the other side anonymus function usually use for one time execution, so they have smaller calling frequence than native function.
// !! Indo version, Perbedaan antara native function dan anonymus function adalah, native function memiliki nama yang dapat kita panggil dengan nama fungsi tersebut, tetapi untuk anonymus function kita tidak dapat memanggilnya dengan nama fungsi karena tidak memiliki nama, tetapi kita dapat memanggilnya dengan variabel yang kita tetapkan ke fungsi. Dan untuk referensi this, keduanya memiliki referensi this yang sama yaitu referensi this cameleon dan kekuatan scope dinamis, jadi mereka akan selalu merujuk ke objek yang memanggil fungsi, dan jika tidak ada objek yang memanggil fungsi, mereka akan merujuk ke objek global. Sedikit tambahan tentang frekuensi pemanggilan mereka, native scope memiliki frekuensi pemanggilan yang lebih besar daripada anonymus function, karena native function bertindak sebagai konsep modularitas "function", tetapi di sisi lain anonymus function biasanya digunakan untuk eksekusi satu kali, jadi mereka memiliki frekuensi pemanggilan yang lebih kecil daripada native function.

// arrow function
const farewell = (name) => {
  console.log(`Hi my name is ${name}, and Goodbye from arrow function`);
  console.log(`This my relative this object from me: ${this}\n\n`); // --> permanent this reference and lexical scope power
};
// its output
farewell("Risky andika");

// todo -------------------- diffrences between the three function (native function, anonymus function and arrow function)
// !! Eng version, The diffrent between native function, anonymus function and arrow function is, native function and anonymus function have the same this reference that is cameleon this reference and dynamic scope power, so they will always refer to the object that is calling the function, and if there is no object that is calling the function, they will refer to the global object. But for arrow function have permanent this reference and lexical scope power, so they will always refer to the object that is in the scope where the function is defined. And for their calling frequence, native scope have bigger calling frequence than anonymus function, because the native function act as his name "function" modularity concept, but in the other side anonymus function usually use for one time execution, so they have smaller calling frequence than native function. And for arrow function usually use for one time execution or for short and simple function, so they have smaller calling frequence than native function and anonymus function.
// !! Indo version, Perbedaan antara native function, anonymus function dan arrow function adalah, native function dan anonymus function memiliki referensi this yang sama yaitu referensi this cameleon dan kekuatan scope dinamis, jadi mereka akan selalu merujuk ke objek yang memanggil fungsi, dan jika tidak ada objek yang memanggil fungsi, mereka akan merujuk ke objek global. Tetapi untuk arrow function memiliki referensi this permanen dan kekuatan scope leksikal, jadi mereka akan selalu merujuk ke objek yang berada dalam scope tempat fungsi didefinisikan. Dan untuk frekuensi pemanggilan mereka, native scope memiliki frekuensi pemanggilan yang lebih besar daripada anonymus function, karena native function bertindak sebagai konsep modularitas "function", tetapi di sisi lain anonymus function biasanya digunakan untuk eksekusi satu kali, jadi mereka memiliki frekuensi pemanggilan yang lebih kecil daripada native function. Dan untuk arrow function biasanya digunakan untuk eksekusi satu kali atau untuk fungsi pendek dan sederhana, jadi mereka memiliki frekuensi pemanggilan yang lebih kecil daripada native function dan anonymus function.

// todo ------------------- HOF (Higher Order Function

//!! Eng version, Higer order function is the function where they can recevie function as their parameter, even more than one function. Usually the function that call as parameter in HOF will be called callback and they will give their pointer, where the pointer has all function's actions that will be executed in HOF block scope.
// !! Indo version, Higer order function adalah fungsi dimana mereka dapat menerima fungsi sebagai parameter mereka, bahkan lebih dari satu fungsi. Biasanya fungsi yang dipanggil sebagai parameter dalam HOF akan disebut callback dan mereka akan memberikan pointer mereka yang disimpan di stack, dimana pointer yang merujuk ke heap memory memiliki semua aksi fungsi yang akan dieksekusi dalam scope blok HOF.

// The class that will we use as source data maker for HOF
class Student {
  constructor(name, age, grade, favoriteSubject) {
    this.name = name;
    this.age = age;
    this.grade = grade;
    this.favoriteSubject = favoriteSubject;
  }
}

// Make instance of student class
const student1 = new Student("Risky andika", 20, "A", "Mathematics");
const student2 = new Student("Rizky andika", 21, "B", "Physics");
const student3 = new Student("Riski andika", 22, "C", "Chemistry");

// Group all into one array, this array which we will use as source data for HOF
const students = [student1, student2, student3];

// Higer order function;
// Filter
console.log("--------------------------- Filter HOF");
const filteredStudents = students.filter((student) => {
  return student.age >= 21;
});
console.table(filteredStudents);
console.log("\n\n");

// Map
console.log("--------------------------- Map HOF");
const updatedStudentsData = students.map((student) => {
  return { ...student, grade: (student.grade = "B") };
});
console.table(updatedStudentsData);
console.log("\n\n");

// Reduce
console.log("--------------------------- Reduce HOF");
const totalGrade = students.reduce((acc, student) => {
  return acc + student.age;
}, 0);
console.log(`Student average age: ${totalGrade / 3}`);
console.log("\n\n");

// ForEach
console.log("--------------------------- ForEach HOF");
students.forEach((student) => console.table(student));
console.log("\n\n");

// Chaining HOF
// !! Eng version, We can all of the HOF in one line or usually called as chaining HOF, but we have to make sure that the output of the first HOF is the input of the second HOF, and so on. And for this example we will filter the students that have age more than or equal to 21, then we will update their grade to "D", and then we will print their data in table format.
// !! Indo version, Kita bisa semua HOF dalam satu baris atau biasanya disebut sebagai chaining HOF, tetapi kita harus memastikan bahwa output dari HOF pertama adalah input dari HOF kedua, dan seterusnya. Dan untuk contoh ini kita akan memfilter siswa yang memiliki usia lebih dari atau sama dengan 21, kemudian kita akan memperbarui nilai mereka menjadi "D", dan kemudian kita akan mencetak data mereka dalam format tabel.
console.log("--------------------------- Chaining HOF");
students
  .filter((student) => {
    return student.age >= 21;
  })
  .map((filteredStudent) => {
    return { ...filteredStudent, grade: (filteredStudent.grade = "D") };
  })
  .forEach((filterStudent) => {
    console.table(filterStudent);
  });

// todo ------------------- First exercies of this material 1️⃣
// !! The case obliged me to filter array instance and get data where the teacher's name is Mr Smith. I use the previous refrence class from class exercise file because the case still leading there.
class ScheduleUpdate {
  // Private property status
  #status;

  // Constructor main class schedule update
  constructor(title, duration) {
    this.title = title;
    this.duration = duration;
    this.#status = "Hasn't start yet";
  }

  // Mutator property setter for change status from this class
  set changeStatus(newStatus) {
    this.#status = newStatus;
  }

  // Acessor propery getter for get the current status from this class
  get currentStatus() {
    return this.#status;
  }

  markAsDone() {
    this.changeStatus = "Done";
    console.log(`Schedule ${this.title} mark as done.`);
  }
}

// Class that extends scheduleUpdate or main class
class ExamSechedule extends ScheduleUpdate {
  constructor(title, duration, teacher, totalQuestions) {
    super(title, duration);
    this.teacher = teacher;
    this.totalQuestions = totalQuestions;
  }
}

const physicsExamSchedule = new ExamSechedule(
  "Physics exam schedule",
  120,
  "Mr. John",
  50,
);

const mathExamSchedule = new ExamSechedule(
  "Math exam schedule",
  90,
  "Mrs. Jane",
  40,
);

const biolgicalExamSchedule = new ExamSechedule(
  "Biological exam schedule",
  90,
  "Mrs. Smith",
  40,
);

// Grouped with one medium array
const examScheduleList = [
  physicsExamSchedule,
  mathExamSchedule,
  biolgicalExamSchedule,
];

// Filtered array
let filteredExamByTeacher = examScheduleList.filter((examSchedule) => {
  return examSchedule.teacher === "Mrs. Smith";
});
console.table(filteredExamByTeacher);
console.log("\n\n");

// Mark to delete from memory with garbage collector
// examScheduleList.length = 0;
// filteredExamByTeacher = null;

// todo ------------------- Second exercies of this material 2️⃣
// !! The case obliged me to create two new array. First array contains all title from the previous array of object we used before, and then the second one contains all reducer calculation from total question from the same array to.

// First case, we use let,because we need to change the refrence from the variable, so that array data that useless and float on the heap will deleted by the garbage collector.
let scheduleNameList = examScheduleList.map((examSchedule) => {
  return examSchedule.title;
});
console.table(scheduleNameList);
console.log("\n\n");

// Reintialitation and mark for garbage collector to delete.
scheduleNameList = null;

// Second first case. we use let for the sama resson.
let totalQUestions = examScheduleList.reduce((acc, examSchedule) => {
  return acc + examSchedule.totalQuestions;
}, 0);

console.log(`Total questions from all schedule existing: ${totalQUestions}`);
console.log("\n\n");

// Reintialitation and mark for garbage collector to delete.
totalQUestions = null;
