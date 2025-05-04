import { vi } from 'vitest';

// Mock process.exit
const originalExit = process.exit;
process.exit = vi.fn((code?: number) => {
  console.log(`Mock process.exit called with code: ${code}`);
  return undefined as never;
}) as never;

// Save the original implementation to restore if needed
(process.exit as any).originalExit = originalExit;