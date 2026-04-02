// Js doc annotation, that use to tell VS Code, all of the code below this anotation is a tailwind configuration code
/** @type {import('tailwindcss').Config} */

// Exports final template module to tailwind intelisense and tailwind CDN that we have in our html file
module.exports = {
  // Track the file that might be need tailwind css style
  content: ["./**/*.{html,js}"],
  // Theme use to override taiwlind's classes with our custom style
  theme: {
    // Extend use to make our custom new class without overriding tailwind's classes
    extend: {},
  },
  // If we need other styling tools that tailwind don't have, you can registrate them inside the plugins
  plugins: [],
};
