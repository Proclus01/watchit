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
const debounce = require('lodash.debounce');
const program = require('caporal'); 
// ^ 'program' nomenclature used because it's an object that represents the program we're building

// ****************************************************************
//
//      A Note on Caporal:
//      When we require caporal, we will need to chain on a couple of 
//      different methods that will configure the command line tool we're making
//
// ****************************************************************

// Debounce is a wrapper that will stop a function from being called too often
// by returning a new version of the function that cannot be called too often
const start = debounce(() => {
    console.log('Starting User Program');
}, 100); // debounce 100 milliseconds

// Initialize Watcher
//      Watch from current directory
//      Attach 3 event listeners and handlers
//  vv
chokidar
    .watch('.')
    .on('add', () => start()) // listen for add, log occurrence
    .on('change', () => console.log('file changed')) // listen for change, log occurrence
    .on('unlink', () => console.log('file unlinked')); // listen for unlink, log occurrence

