import mermaid from 'mermaid';

/**
 * Render a single Mermaid code string to SVG
 */
export async function renderOne(
  code: string,
  id?: string,
  config?: Record<string, any>
): Promise<string> {
  if (config) {
    mermaid.initialize(config);
  }
  const renderId = id ?? `mermaid-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2)}`;
  try {
    const { svg } = await mermaid.render(renderId, code);
    return svg;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return `<pre style="color:red">${message}</pre>`;
  }
}
