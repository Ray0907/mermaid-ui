declare module 'mermaidui-core' {
    export function renderOne(
        code: string,
        id?: string,
        config?: Record<string, any>
    ): Promise<string>;
}
