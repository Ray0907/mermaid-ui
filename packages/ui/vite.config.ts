import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    resolve: {
        alias: {
            'mermaidui-core': resolve(__dirname, '../core/dist/core.esm.js')
        }
    },
    server: {
        port: 5173
    }
});
