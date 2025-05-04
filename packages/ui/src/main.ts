import { initMermaidUI } from 'mermaidui-core'

const textarea = document.getElementById('mermaid-input') as HTMLTextAreaElement
const preview = document.getElementById('mermaid-preview') as HTMLElement
const fileInput = document.getElementById('file-input') as HTMLInputElement

// Render on textarea input
textarea.addEventListener('input', () => {
    preview.textContent = textarea.value
    initMermaidUI({ selector: '#mermaid-preview', observer: false })
})

// Handle file selection
if (fileInput) {
    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            const text = reader.result as string
            textarea.value = text
            preview.textContent = text
            initMermaidUI({ selector: '#mermaid-preview', observer: false })
        }
        reader.readAsText(file)
    })
}

// initial render
preview.textContent = textarea.value
initMermaidUI({ selector: '#mermaid-preview', observer: false })
