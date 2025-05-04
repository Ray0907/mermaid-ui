const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
    input: 'src/cli.ts',
    external: ['mermaidui-core', 'commander', 'fs', 'fs/promises'],
    plugins: [
        typescript({ tsconfig: './tsconfig.json' }),
        resolve({ extensions: ['.js', '.ts'] }),
        commonjs()
    ],
    output: {
        file: 'dist/cli.js',
        format: 'cjs',
        banner: '#!/usr/bin/env node'
    }
};
