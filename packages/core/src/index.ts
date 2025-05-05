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
    if (typeof document === 'undefined') {
        console.warn('renderAll can only be used in a browser environment');
        return;
    }
    
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
    if (typeof document === 'undefined') {
        console.warn('initMermaidUI can only be used in a browser environment');
        return;
    }
    
    renderAll(options.selector, { mermaidConfig: options.mermaidConfig });
    if (options.observer) {
        observeDOM(options.selector, options.mermaidConfig);
    }
}

export { renderOne } from './renderer';