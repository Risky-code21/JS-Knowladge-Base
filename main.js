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

// --------------------------------------------------
