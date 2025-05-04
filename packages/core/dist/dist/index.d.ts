import { renderOne } from './renderer';
import { InitOptions, RenderOptions } from './types';
/**
 * Render all Mermaid code blocks matching selector.
 */
export declare function renderAll(selector: string, options?: RenderOptions): Promise<void>;
/**
 * Initialize Mermaid auto-renderer.
 */
export declare function initMermaidUI(options: InitOptions): void;
export { renderOne };
