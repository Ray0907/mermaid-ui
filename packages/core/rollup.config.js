const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');

module.exports = {
    input: 'src/index.ts',
    external: ['mermaid'],
    plugins: [
        resolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' }),
        terser()
    ],
    output: [
        { file: 'dist/core.esm.js', format: 'esm' },
        { file: 'dist/core.cjs.js', format: 'cjs', exports: 'named' },
        { file: 'dist/core.umd.js', format: 'umd', name: 'MyMermaidCore', globals: { mermaid: 'mermaid' } }
    ]
};
