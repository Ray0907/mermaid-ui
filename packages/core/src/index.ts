import mermaid from 'mermaid';
import { renderOne } from './renderer';
import { InitOptions, RenderOptions } from './types';
import { observeDOM } from './observer';

/**
 * Render all Mermaid code blocks matching selector.
 */
export async function renderAll(
    selector: string,
    options?: RenderOptions
): Promise<void> {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    for (const el of Array.from(elements)) {
        const code = el.textContent || '';
        const svg = await renderOne(code, undefined, options?.mermaidConfig);
        el.innerHTML = svg;
    }
}

/**
 * Initialize Mermaid auto-renderer.
 */
export function initMermaidUI(options: InitOptions): void {
    if (options.mermaidConfig) {
        mermaid.initialize(options.mermaidConfig);
    }
    renderAll(options.selector, { mermaidConfig: options.mermaidConfig });
    if (options.observer) {
        observeDOM(options.selector, options.mermaidConfig);
    }
}
