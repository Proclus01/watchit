#!/usr/bin/env node

//jshint esversion:11

// ****************************************************************
//
//      APP DESCR:
//
//      watchit is a nodemon clone (without server) that watches 
//      for changes in your app and then reports these changes to you
//      through an active process in a CLI.
//      
//      Run in terminal using 'watchit'
//
// ****************************************************************

// Begin:

//
//      We have three dependencies we need to complete our app:
//
//      1. 'chokidar' to detect any file changes
//      2. 'caporal' for our CLI tools
//      3. 'child_process' to execute JS code inside our program
//

const chokidar = require('chokidar');
const fs = require('fs');
const debounce = require('lodash.debounce');
// child process to be added later
const program = require('caporal'); 
// ^ 'program' nomenclature used because it's an object that represents the program we're building

// ****************************************************************
//
//      A Note on Caporal:
//      When we require caporal, we will need to chain on a couple of 
//      different methods that will configure the command line tool we're making
//
// ****************************************************************

// Initialize caporal and configure CLI
//      A. square brackets indicate arg is optional
//      B. angle brackets indicate arg is necessary
//      C. When the user runs the 'help' screen in CLI,
//      then this function will configure the display of instructions.
program
    .version('0.0.1') // set a flag to tell the user the version
    .argument('[filename]', 'Name of a file to execute') // specify the arguments a command will take
    .action( // runs a function that accepts args, options, etc
        async ({ filename }) => {
            // If we don't get a filename, default to 'index.js'
            const name = filename || 'index.js';

            // Check whether or not the file exists
            try {
                await fs.promises.access(name);
            } catch (err) {
                throw new Error(`Could not find the file ${name}`);
            }

            // Run debounce and watcher
            watchAndListen();
    }); 

// Run the caporal configuration program
program.parse(process.argv);

const watchAndListen = function() {
    // Debounce is a wrapper that will stop a function from being called too often
    // by returning a new version of the function that cannot be called too often
    const start = debounce((input) => {
        console.log(`${input} detected`);
    }, 100); // debounce 100 milliseconds

    // Initialize Watcher
    //      Watch from current directory
    //      Attach 3 event listeners and handlers
    //  vv
    chokidar
        .watch('.')
        .on('add', () => start('add')) // listen for add, log occurrence
        .on('change', () => start('change')) // listen for change, log occurrence
        .on('unlink', () => start('unlink')); // listen for unlink, log occurrence
};

