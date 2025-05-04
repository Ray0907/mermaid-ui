import { describe, it, expect, vi, beforeEach } from 'vitest';
import mermaid from 'mermaid';
import { renderOne } from './renderer';

vi.mock('mermaid', () => ({
  __esModule: true,
  default: {
    render: vi.fn(),
    initialize: vi.fn(),
  },
}));

describe('renderOne', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders svg when mermaid.render resolves', async () => {
        (mermaid.render as any).mockResolvedValue({ svg: '<svg>ok</svg>' });
        const svg = await renderOne('graph LR; A-->B;', 'testId', { theme: 'forest' });
        expect(mermaid.initialize).toHaveBeenCalledWith({ theme: 'forest' });
        expect(mermaid.render).toHaveBeenCalledWith('testId', 'graph LR; A-->B;');
        expect(svg).toBe('<svg>ok</svg>');
    });

    it('returns error markup when mermaid.render throws', async () => {
        (mermaid.render as any).mockRejectedValue(new Error('mock error'));
        const svg = await renderOne('bad code');
        expect(svg).toContain('mock error');
        expect(svg.startsWith('<pre')).toBe(true);
    });
});
