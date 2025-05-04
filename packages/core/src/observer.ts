import { renderOne } from './renderer';

/**
 * Observe DOM mutations and auto-render new Mermaid code blocks matching selector.
 */
export function observeDOM(
    selector: string,
    mermaidConfig?: Record<string, any>
): void {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(async (node) => {
                    if (!(node instanceof HTMLElement)) return;

                    // If the added node itself matches selector
                    if (node.matches(selector)) {
                        const code = node.textContent || '';
                        const svg = await renderOne(code, undefined, mermaidConfig);
                        node.innerHTML = svg;
                    }

                    // If descendants match selector
                    node.querySelectorAll(selector).forEach(async (el) => {
                        const code = el.textContent || '';
                        const svg = await renderOne(code, undefined, mermaidConfig);
                        el.innerHTML = svg;
                    });
                });
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
