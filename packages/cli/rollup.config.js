const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
    input: 'src/cli.ts',
    external: ['mermaidui-core', 'commander', 'fs', 'fs/promises', 'process', 'path', '@types/node'],
    plugins: [
        resolve({ extensions: ['.js', '.ts'] }),
        commonjs(),
        typescript({ 
            tsconfig: './tsconfig.json',
            sourceMap: true
        })
    ],
    output: {
        file: 'dist/cli.js',
        format: 'cjs',
        banner: '#!/usr/bin/env node',
        sourcemap: true
    }
};
