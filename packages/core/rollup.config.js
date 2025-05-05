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
        typescript({ 
            tsconfig: './tsconfig.json',
            sourceMap: true,
            declaration: true,
            declarationDir: './dist',
            compilerOptions: {
                module: "ESNext",
                target: "ES2020",
                lib: ["ESNext", "DOM"],
                moduleResolution: "node"
            }
        }),
        terser()
    ],
    output: [
        { file: 'dist/core.esm.js', format: 'esm', sourcemap: true },
        { file: 'dist/core.cjs.js', format: 'cjs', exports: 'named', sourcemap: true },
        { file: 'dist/core.umd.js', format: 'umd', name: 'MermaidUICore', globals: { mermaid: 'mermaid' }, sourcemap: true }
    ]
};
