// -------------------------------------------------- String block section experimental
// I Try to comapare some method to define a string in JS
// First method is using single quotes or single ticks
let singleQuate = "Hallo world from single quates variable!";

// Second one method is using double quates or double ticks
let doubleQuates = "Hallo world from double quates variable!";
// Between the first and second method there is no siginificant diffrence except the display look like and consistancy to use in out program

let backTick = `Hello world from back tick quates, and here are the past version of me, first use single quoates '${singleQuate}' and second one is use double quotes "${doubleQuates}"`;

// Try to display the result between three method i have defined
console.log(singleQuate);
console.log(doubleQuates);
console.log(backTick);

// Try to manipulate the string that i have made using some method that have defined by JS
// Transform all strings into lower alphabet
console.log(backTick.toLowerCase());

// Transform all strings into upper alphabet
console.log(backTick.toUpperCase());

// Try to split the string into array of string using split method
console.log(backTick.split(" ")); // split the string into array of string using space as separator

// Job desk 1 string
// Make variable about name, and the sparate into two variable first name and last name, and finlly concatenate both of them into one variable full name
let firstName = "Andika";
let lastName = "Putra";
// Add space to sparate firstname and lastname
let fullName = firstName + " " + lastName;

// Display the full name variable
console.log(fullName);

// Job desk 2 string
// Make simple schedule card and concat them with backtick method as past
let month = "March";
let day = "Sunday";
let time = "10.00 WITA";

// Concatenate the schedule card with back tick method
let scheduleCardDate = `Schedule for ${month} - ${day} - ${time}`;

// Display the schedule card date
console.log(scheduleCardDate);

// Job desk 3 string
// Summation on string with number using arithmetic operator
// Try to summatif number with original string
console.log("Helo" * 3); // -> result is NAN, because we can't do summation between original sting except number string, with number

// Try to summatif number with number, but one of theme is not original number, it's string
console.log("5" * 10); // -> 50, number
console.log("5" + 10); // -> 510, string
console.log("5" - 10); // -> -5, number
console.log("5" / 10); // -> 0.5, number
// Except + operator, we can do normal summation same as we do summation with number. Why + is excepting ? because we know + is use to concat string, whatever string is number that will be concat
// -------------------------------------------------- String block section experimental ended

// -------------------------------------------------- Number block section experimetal
// Total time to study
// set focus time as primary time in study then plus it with break time ( 15 minutes )
let focusTime = 45;
let fuillTimeStudy = focusTime + 15;
console.log(
  `i have focus time for ${focusTime} minutes and break time for 15 minutes, and total time i need to study is ${fuillTimeStudy} minutes`,
);

// Temprature convesion
// Temperature in float type then we will rounded up with ceil method and rounded down with floor method
let currentTemp = 24.33;
console.log(`Current temperature is ${currentTemp}°C`);
console.log(`Rounded up: ${Math.ceil(currentTemp)}°C`);
console.log(`Rounded down: ${Math.floor(currentTemp)}°C`);

// Unique output in number type
// It will produce NAN, because we can't do summation except with operator + in string, if string is not a number string
let NaNValue = "Hello" * 3;
console.log(NaNValue); // -> NAN

// It will produce Infinity type, because there'nt limit if we devide one with zero number
let infinityValue = 1 / 0;
console.log(infinityValue); // -> Infinity

// Job desk 1 number
// Rounded with nearest value
// It will be rounded the value into the nearest value, example if you have 33,33, it will look at the last digit of number, because the last digit is three, it will be rounded down in other side, if we have bigger nomer example 6, it will be rounded up
let temp1 = 33.33;
let temp2 = 44.44;
let temp3 = 55.55;
console.log(`Rounded temp1: ${Math.round(temp1)}°C`); // -> 33
console.log(`Rounded temp2: ${Math.round(temp2)}°C`); // -> 44
console.log(`Rounded temp3: ${Math.round(temp3)}°C`); // -> 56

// Job desk 2 number
// Timer splitter
// The purpose is to split the main time ( 130 minutes ) into ordinary timer format
let mainTime = 130;
let hour = Math.floor(mainTime / 60);
let minutes = mainTime % 60;
console.log(
  `Main time is ${mainTime} minutes, and it will be splitted into ${hour} hour and ${minutes} minutes`,
);

// Job desk 3 number
// Infinity type
let easterEgg = 10 / 0; // -> Infinity
console.log(`Result from 10 devided by 0 is: ${easterEgg}`);
// -------------------------------------------------- Number block section experimetal
