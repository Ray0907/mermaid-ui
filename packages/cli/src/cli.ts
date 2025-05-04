import { Command } from 'commander';
import { renderOne } from 'mermaidui-core';
import { readFile, writeFile } from 'fs/promises';

export async function readStdin(stdin: NodeJS.ReadableStream): Promise<string> {
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

// Define an interface for the stdout stream that supports async write
interface WritableStreamAsync {
    write(chunk: string): Promise<void>;
}

export async function main(
    args: string[],
    stdin: NodeJS.ReadableStream,
    stdout: { write: (chunk: string) => boolean },
    testMode = false
): Promise<number> {
    try {
        let inputData: string;
        
        // Get input from file or stdin
        if (args.length > 2) {
            inputData = await readFile(args[2], 'utf8');
        } else {
            inputData = await readStdin(stdin);
        }
        
        // Get svg from mermaid diagram
        const svg = await renderOne(inputData, { testMode }); // Pass testMode as part of config object
        
        // Write to file or stdout
        if (args.length > 3) {
            await writeFile(args[3], svg, 'utf8');
        } else {
            // Add this debug line
            console.log(`[MAIN DEBUG] svg result: ${svg ? 'defined' : 'undefined'}, type: ${typeof svg}`);
            
            // Make sure we only write if svg is defined
            if (svg !== undefined && svg !== null) {
                stdout.write(svg);
            } else {
                console.error('Error: Received undefined SVG from renderOne');
                return 1;
            }
        }
        
        return 0;
    } catch (error) {
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
