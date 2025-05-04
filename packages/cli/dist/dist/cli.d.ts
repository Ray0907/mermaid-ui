export declare function readStdin(stdin: NodeJS.ReadableStream): Promise<string>;
export declare function main(args: string[], stdin: NodeJS.ReadableStream, stdout: {
    write: (chunk: string) => boolean;
}, testMode?: boolean): Promise<number>;
//# sourceMappingURL=cli.d.ts.map