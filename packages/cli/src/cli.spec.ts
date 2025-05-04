import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PassThrough } from 'stream'
import { promises as fs } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { readStdin, main } from './cli'

describe('readStdin()', () => {
    it('reads chunks from stdin until end', async () => {
        const pt = new PassThrough()
        // Use custom stream instead of process.stdin
        const promise = readStdin(pt)
        pt.write('hello ')
        pt.write('world')
        pt.end()
        const result = await promise
        expect(result).toBe('hello world')
    })
})

describe('main()', () => {
    const tmp = tmpdir()
    const inFile = join(tmp, 'test.mmd')
    const outFile = join(tmp, 'test.svg')

    beforeEach(async () => {
        await fs.writeFile(inFile, 'graph TD; A-->B;', 'utf-8')
    })
    afterEach(async () => {
        await fs.rm(inFile, { force: true })
        await fs.rm(outFile, { force: true })
    })

    it('writes SVG to output file when -i and -o provided', async () => {
        const argv = ['node', 'mermaid-ui', '-i', inFile, '-o', outFile]
        await main(argv)
        // File should be created and not empty
        const stats = await fs.stat(outFile)
        expect(stats.size).toBeGreaterThan(0)
    })

    it('writes SVG to stdout when no -o', async () => {
        const argv = ['node', 'mermaid-ui', '-i', inFile]
        const writes: string[] = []
        const origWrite = process.stdout.write
        ;(process.stdout.write as any) = (chunk: any) => {
            writes.push(chunk.toString())
            return true
        }
        await main(argv)
        // Output should be non-empty
        expect(writes.join('').length).toBeGreaterThan(0)
        process.stdout.write = origWrite
    })

    it('reads from stdin and writes to stdout when no -i and no -o', async () => {
        const argv = ['node', 'mermaid-ui']
        const pt = new PassThrough()
        const writes: string[] = []
        const origWrite = process.stdout.write
        ;(process.stdout.write as any) = (chunk: any) => {
            writes.push(chunk.toString())
            return true
        }
        pt.write('graph TD; X-->Y;')
        pt.end()
        await main(argv, pt)
        // Output should be non-empty
        expect(writes.join('').length).toBeGreaterThan(0)
        process.stdout.write = origWrite
    })
})
