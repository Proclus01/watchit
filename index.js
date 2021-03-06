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
//      Run in terminal using 'watchit test.js' to track the test.js file
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

import chalk from 'chalk'; // to color our CLI text
import * as chokidar from 'chokidar';
import * as fs from 'fs'; // We will be using this one a lot
import debounce from 'lodash.debounce';
import { spawn } from 'child_process';
import program from 'caporal';
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

            // ***************************
            // Important: Run debounce and watcher
            // ***************************

            let proc; // Process variable to track our child processes
            
            // Debounce is a wrapper that will stop a function from being called too often
            // by returning a new version of the function that cannot be called too often
            const start = debounce(() => {
                // If a child process already exists, then terminate it
                if (proc) {
                    proc.kill();
                }

                // Broadcast process start
                console.log(chalk.blue('>>>> Starting process...'));

                // Spawn a child process to track filechanges
                proc = spawn('node', [name], { stdio: 'inherit' });

            }, 200); // debounce 200 milliseconds
        
            // Initialize Watcher
            //      Watch from current directory
            //      Attach 3 event listeners and handlers
            //  vv
            chokidar
                .watch('.')
                .on('add', () => start('add')) // listen for add, log occurrence
                .on('change', () => start('change')) // listen for change, log occurrence
                .on('unlink', () => start('unlink')); // listen for unlink, log occurrence
        } // end of async {filename}
    ); // end of action

// Run the caporal configuration program
program.parse(process.argv); 