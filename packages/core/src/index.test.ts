import { describe, it, expect, vi, beforeEach } from 'vitest';
import mermaid from 'mermaid';
import * as renderer from './renderer';
import { renderAll, initMermaidUI } from './index';
import * as observerModule from './observer';

vi.mock('mermaid', () => ({
    __esModule: true,
    default: {
        render: vi.fn(),
        initialize: vi.fn(),
    },
}))
vi.mock('./renderer', () => ({ __esModule: true, renderOne: vi.fn() }))
vi.mock('./observer', () => ({ __esModule: true, observeDOM: vi.fn() }))

beforeEach(() => {
    document.body.innerHTML = '';
    vi.resetAllMocks();
});

describe('renderAll', () => {
    it('renders all matching elements', async () => {
        const el1 = document.createElement('div'); el1.textContent = 'code1';
        const el2 = document.createElement('div'); el2.textContent = 'code2';
        document.body.append(el1, el2);
        (renderer.renderOne as any).mockResolvedValue('<svg>ok</svg>');

        await renderAll('div', { mermaidConfig: { theme: 'dark' } });

        expect(renderer.renderOne).toHaveBeenCalledTimes(2);
        expect(el1.innerHTML).toBe('<svg>ok</svg>');
        expect(el2.innerHTML).toBe('<svg>ok</svg>');
    });
});

describe('initMermaidUI', () => {
    it('initializes mermaid and sets up observer', async () => {
        (renderer.renderOne as any).mockResolvedValue('<svg>ini</svg>');
        // add a dummy element matching selector so renderAll calls renderOne
        const el = document.createElement('div');
        el.textContent = 'test';
        document.body.append(el);
        const spyObserve = vi.spyOn(observerModule, 'observeDOM');

        initMermaidUI({ selector: 'div', observer: true, mermaidConfig: { theme: 'forest' } });

        expect(mermaid.initialize).toHaveBeenCalledWith({ theme: 'forest' });
        expect(renderer.renderOne).toHaveBeenCalled();
        expect(spyObserve).toHaveBeenCalledWith('div', { theme: 'forest' });
    });
});
