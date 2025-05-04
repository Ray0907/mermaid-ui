export interface InitOptions {
    /** CSS selector for Mermaid code containers */
    selector: string;
    /** Whether to observe DOM mutations and auto-render */
    observer?: boolean;
    /** Mermaid.initialize config object */
    mermaidConfig?: Record<string, any>;
}

export interface RenderOptions {
    /** Mermaid.initialize config for single render */
    mermaidConfig?: Record<string, any>;
}
