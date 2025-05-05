#!/usr/bin/env node
'use strict';

var commander = require('commander');
var promises = require('fs/promises');
var child_process = require('child_process');
var util = require('util');
var path = require('path');
var os = require('os');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var os__namespace = /*#__PURE__*/_interopNamespaceDefault(os);

const execPromise = util.promisify(child_process.exec);
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
/**
 * Renders a Mermaid diagram using the @mermaid-js/mermaid-cli package
 */
async function renderWithMermaidCLI(inputContent, outputPath = null) {
    try {
        // Create a temporary file for the input if we're not writing to a file
        const tmpDir = os__namespace.tmpdir();
        const timestamp = Date.now();
        const tempInputPath = path__namespace.join(tmpDir, `mermaid-input-${timestamp}.mmd`);
        const tempOutputPath = outputPath || path__namespace.join(tmpDir, `mermaid-output-${timestamp}.svg`);
        // Write diagram content to the temp file
        await promises.writeFile(tempInputPath, inputContent, 'utf8');
        // Construct the mermaid-cli command
        // We use the local installation in node_modules
        const mmdcPath = path__namespace.resolve(__dirname, '..', '..', '..', 'node_modules', '.bin', 'mmdc');
        console.log(`Using mmdc at: ${mmdcPath}`);
        // Run the mmdc command
        const command = `"${mmdcPath}" -i "${tempInputPath}" -o "${tempOutputPath}"`;
        console.log(`Executing: ${command}`);
        await execPromise(command);
        // Read the output SVG if needed
        if (!outputPath) {
            const svgContent = await promises.readFile(tempOutputPath, 'utf8');
            return svgContent;
        }
        return 'Diagram rendered successfully';
    }
    catch (error) {
        console.error('Error rendering with mermaid-cli:', error);
        throw error;
    }
}
async function main(args = process.argv, stdin = process.stdin, stdout = process.stdout, testMode = false) {
    try {
        let inputData;
        // Get input from file or stdin
        if (args.length > 2) {
            inputData = await promises.readFile(args[2], 'utf8');
        }
        else {
            inputData = await readStdin(stdin);
        }
        // Get svg from mermaid diagram using mermaid-cli directly
        let result;
        if (args.length > 3) {
            result = await renderWithMermaidCLI(inputData, args[3]);
            console.log(result);
        }
        else {
            result = await renderWithMermaidCLI(inputData);
            stdout.write(result);
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
    // Commander-based CLI parsing
    const program = new commander.Command();
    program.name('mermaidui').description('Render Mermaid diagrams to SVG');
    program.option('--input <file>', 'Input file path (reads stdin if absent)');
    program.option('--output <file>', 'Output file path (writes to stdout if absent)');
    program.option('-t, --test-mode', 'Enable test mode');
    program.on('--help', () => {
        console.log('');
        console.log('Examples:');
        console.log('  $ mermaidui --input input.mmd --output output.svg');
        console.log('  $ mermaidui -t < input.mmd > output.svg');
    });
    program.parse(process.argv);
    const options = program.opts();
    const args = ['node', 'cli'];
    if (program.opts().input)
        args.push(program.opts().input);
    if (program.opts().output)
        args.push(program.opts().output);
    main(args, process.stdin, process.stdout, options.testMode)
        .then(code => {
        if (code !== 0)
            process.exit(code);
    })
        .catch(err => {
        console.error(err);
        process.exit(1);
    });
}

exports.main = main;
exports.readStdin = readStdin;
//# sourceMappingURL=cli.js.map
