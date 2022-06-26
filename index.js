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

// Initialize Watcher
//      Watch from current directory
//      Attach 3 event listeners and handlers
//  vv
chokidar.watch('.')
    .on('add', () => console.log('file added')) // listen for add, log occurrence
    .on('change', () => console.log('file changed')) // listen for change, log occurrence
    .on('unlink', () => console.log('file unlinked')); // listen for unlink, log occurrence

