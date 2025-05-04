#!/usr/bin/env node
'use strict';

var mermaiduiCore = require('mermaidui-core');
var promises = require('fs/promises');

async function readStdin(stdin) {
    return new Promise((resolve, reject) => {
        let data = '';
        stdin.setEncoding('utf8');
        stdin.on('data', (chunk) => {
            data += chunk;
        });
        stdin.on('end', () => {
            resolve(data);
        });
        stdin.on('error', (err) => {
            reject(err);
        });
    });
}
async function main(args, stdin, stdout, testMode = false) {
    try {
        let inputData;
        // Get input from file or stdin
        if (args.length > 2) {
            inputData = await promises.readFile(args[2], 'utf8');
        }
        else {
            inputData = await readStdin(stdin);
        }
        // Get svg from mermaid diagram
        const svg = await mermaiduiCore.renderOne(inputData, { testMode }); // Pass testMode as part of config object
        // Write to file or stdout
        if (args.length > 3) {
            await promises.writeFile(args[3], svg, 'utf8');
        }
        else {
            // Add this debug line
            console.log(`[MAIN DEBUG] svg result: ${svg ? 'defined' : 'undefined'}, type: ${typeof svg}`);
            // Make sure we only write if svg is defined
            if (svg !== undefined && svg !== null) {
                stdout.write(svg);
            }
            else {
                console.error('Error: Received undefined SVG from renderOne');
                return 1;
            }
        }
        return 0;
    }
    catch (error) {
        console.error(error);
        return 1;
    }
}
// Only run main when invoked directly
if (require.main === module) {
    main().then(exitCode => {
        if (exitCode !== 0) {
            process.exit(exitCode);
        }
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
}

exports.main = main;
exports.readStdin = readStdin;
//# sourceMappingURL=cli.js.map
