import { describe, it, expect, vi } from 'vitest'
import { main, readStdin } from './cli'

// Mock dependencies
vi.mock('fs/promises', () => ({
    readFile: vi.fn().mockResolvedValue('graph TD\nA-->B'),
    writeFile: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('commander', () => {
    const mockProgram = {
        name: vi.fn().mockReturnThis(),
        description: vi.fn().mockReturnThis(),
        option: vi.fn().mockReturnThis(),
        parse: vi.fn().mockReturnThis(),
        opts: vi.fn().mockReturnValue({})
    };
    return { Command: vi.fn(() => mockProgram) };
});

vi.mock('mermaidui-core', () => ({
    renderOne: vi.fn().mockResolvedValue('<svg>mocked svg</svg>')
}));


// Create mock streams for testing
class MockReadableStream {
    private listeners: Record<string, Function[]> = { data: [], end: [], error: [] };
    
    setEncoding() { return this; }
    
    on(event: string, callback: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return this;
    }
    
    emit(event: string, data?: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
        return this;
    }
}

class MockWritableStream {
    content = '';

    // Simple synchronous write method
    write(chunk: string | Buffer): boolean {
        console.log(`[TEST DEBUG] MockWritableStream.write called. Chunk type: ${typeof chunk}, Value: ${chunk}`);
        
        if (chunk !== undefined && chunk !== null) {
            this.content += chunk.toString();
        } else {
            console.error('[TEST DEBUG] Write called with undefined or null chunk!');
        }
        
        return true; // Standard Node.js stream returns true for success
    }
}

describe('CLI with mocks', () => {
    it('should read from stdin when no input file is specified', async () => {
        // Add debug logging for the mock to verify it's working
        const renderOne = vi.spyOn(await import('mermaidui-core'), 'renderOne')
            .mockImplementation(async (...args) => {
                console.log(`[TEST DEBUG] renderOne called with args:`, ...args);
                return '<svg>mocked svg</svg>';
            });
        
        const mockStdin = new MockReadableStream();
        const mockStdout = new MockWritableStream();

        console.log('[TEST DEBUG] Starting test');
        
        // Start main
        const mainPromise = main(
            ['node', 'cli'],
            mockStdin as unknown as NodeJS.ReadableStream,
            mockStdout as any,
            true // Use test mode
        );

        console.log('[TEST DEBUG] Emitting stdin data');
        
        // Emit data to stdin and end the stream
        mockStdin.emit('data', 'graph TD\nA-->B');
        mockStdin.emit('end');

        console.log('[TEST DEBUG] Awaiting main promise');
        
        // Await the main function
        const exitCode = await mainPromise;

        console.log(`[TEST DEBUG] Main complete with exit code: ${exitCode}`);
        console.log(`[TEST DEBUG] mockStdout.content: "${mockStdout.content}"`);
        console.log(`[TEST DEBUG] renderOne called: ${renderOne.mock.calls.length} times`);
        
        // Check that main exited successfully
        expect(exitCode).toBe(0);
        
        // Check that renderOne was called
        expect(renderOne).toHaveBeenCalled();
        
        // Check that we got SVG content
        expect(mockStdout.content).toBe('<svg>mocked svg</svg>');
    });


    it('should handle errors with test mode', async () => {
        // Setup mock to throw error
        const renderOne = await import('mermaidui-core').then(m => m.renderOne);
        vi.mocked(renderOne).mockRejectedValueOnce(new Error('Mermaid parsing error'));
        
        const mockStdin = new MockReadableStream();
        const mockStdout = new MockWritableStream();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        const promise = main(
            ['node', 'cli'], 
            mockStdin as unknown as NodeJS.ReadableStream, 
            mockStdout as any,
            true // Use test mode
        );
        
        mockStdin.emit('data', 'invalid diagram');
        mockStdin.emit('end');
        
        const exitCode = await promise;
        
        expect(exitCode).toBe(1);
        expect(consoleSpy).toHaveBeenCalled();
        
        consoleSpy.mockRestore();
    });
})