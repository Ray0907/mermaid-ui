import { Command } from 'commander';
import { renderOne } from '../../core/src/index';
import { readFile, writeFile } from 'fs/promises';

export async function readStdin(stream: NodeJS.ReadableStream = process.stdin): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = '';
        stream.setEncoding('utf-8');
        stream.on('data', chunk => { data += chunk; });
        stream.on('end', () => { resolve(data); });
        stream.on('error', err => { reject(err); });
    });
}

export async function main(
    argv: string[] = process.argv,
    stdin: NodeJS.ReadableStream = process.stdin,
    stdout: { write(chunk: string): boolean } = process.stdout
): Promise<void> {
    const program = new Command();
    program
        .name('mermaidui')
        .description('CLI to render MermaidUI diagrams to SVG')
        .option('-i, --input <file>', 'Input file path; if omitted, read from stdin')
        .option('-o, --output <file>', 'Output file path; if omitted, write to stdout')
        .option('-c, --config <json>', 'Mermaid.initialize config as JSON string')
        .parse(argv);

    const options = program.opts<{ input?: string; output?: string; config?: string }>();
    let code: string;

    if (options.input) {
        code = await readFile(options.input, 'utf-8');
    } else {
        code = await readStdin(stdin);
    }

    const mermaidConfig = options.config ? JSON.parse(options.config) : undefined;
    try {
        const svg = await renderOne(code, undefined, mermaidConfig as Record<string, any>);
        if (options.output) {
            await writeFile(options.output, svg, 'utf-8');
        } else {
            stdout.write(svg);
        }
    } catch (err: unknown) {
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
