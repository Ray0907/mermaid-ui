#!/usr/bin/env node
'use strict';

var commander = require('commander');
var mermaiduiCore = require('mermaidui-core');
var promises = require('fs/promises');

async function readStdin(stream = process.stdin) {
    return new Promise((resolve, reject) => {
        let data = '';
        stream.setEncoding('utf-8');
        stream.on('data', chunk => { data += chunk; });
        stream.on('end', () => { resolve(data); });
        stream.on('error', err => { reject(err); });
    });
}
async function main(argv = process.argv, stdin = process.stdin, stdout = process.stdout) {
    const program = new commander.Command();
    program
        .name('mermaidui')
        .description('CLI to render MermaidUI diagrams to SVG')
        .option('-i, --input <file>', 'Input file path; if omitted, read from stdin')
        .option('-o, --output <file>', 'Output file path; if omitted, write to stdout')
        .option('-c, --config <json>', 'Mermaid.initialize config as JSON string')
        .parse(argv);
    const options = program.opts();
    let code;
    if (options.input) {
        code = await promises.readFile(options.input, 'utf-8');
    }
    else {
        code = await readStdin(stdin);
    }
    const mermaidConfig = options.config ? JSON.parse(options.config) : undefined;
    try {
        const svg = await mermaiduiCore.renderOne(code, undefined, mermaidConfig);
        if (options.output) {
            await promises.writeFile(options.output, svg, 'utf-8');
        }
        else {
            stdout.write(svg);
        }
    }
    catch (err) {
        console.error('Error rendering Mermaid:', err instanceof Error ? err.message : err);
        process.exit(1);
    }
}
// Only run main when invoked directly
if (require.main === module) {
    main().catch(err => {
        console.error(err);
        process.exit(1);
    });
}

exports.main = main;
exports.readStdin = readStdin;
