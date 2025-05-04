const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');

module.exports = [
    {
        input: 'src/index.ts',
        external: ['mermaid'],
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: 'tsconfig.json' }),
            terser()
        ],
        output: [
            { file: 'dist/my-mermaid-auto.esm.js', format: 'esm' },
            { file: 'dist/my-mermaid-auto.cjs.js', format: 'cjs', exports: 'named' },
            { file: 'dist/my-mermaid-auto.umd.js', format: 'umd', name: 'MyMermaidAuto', globals: { mermaid: 'mermaid' } }
        ]
    },
    {
        input: 'src/cli.ts',
        external: ['mermaid', 'commander', 'fs'],
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: 'tsconfig.json' })
        ],
        output: {
            file: 'dist/cli.js',
            format: 'cjs',
            banner: '#!/usr/bin/env node'
        }
    }
];
