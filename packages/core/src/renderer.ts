// Import JSDOM for creating a simulated DOM environment
const { JSDOM } = require('jsdom');

// Use a simpler approach for Node.js support
let mermaid;
let jsdom;

/**
 * Render a single Mermaid code string to SVG
 */
export async function renderOne(
  code: string,
  id?: string,
  config?: Record<string, any>
): Promise<string> {
  try {
    // Validate input
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid Mermaid code provided');
    }
    
    // Check if we're in a browser or Node.js environment
    const isNode = typeof window === 'undefined';
    
    // Setup DOM if needed (Node.js environment)
    if (isNode && !jsdom) {
      console.log('Setting up JSDOM environment...');
      // Create a basic HTML document
      jsdom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>', {
        pretendToBeVisual: true,
        url: 'https://localhost'
      });
      
      // Set global variables for libraries that expect a browser environment
      global.window = jsdom.window;
      global.document = jsdom.window.document;
      global.SVGElement = jsdom.window.SVGElement;
      
      // Add a root element for rendering
      global.container = jsdom.window.document.getElementById('container');
    }
    
    // Lazy-load mermaid if not already loaded
    if (!mermaid) {
      try {
        // Import mermaid
        const mermaidModule = require('mermaid');
        mermaid = mermaidModule.default || mermaidModule;
        
        if (!mermaid || typeof mermaid !== 'object') {
          throw new Error('Invalid mermaid module structure');
        }
        
        console.log(`Successfully loaded mermaid version: ${mermaid.version || 'unknown'}`);
      } catch (importError) {
        console.error('Failed to import mermaid:', importError);
        throw new Error(`Failed to load mermaid: ${importError.message}`);
      }
    }
    
    // Make sure mermaid has a render function
    if (!mermaid.render && !(mermaid.mermaidAPI && mermaid.mermaidAPI.render)) {
      throw new Error('Mermaid render function not available');
    }
    
    // Initialize mermaid with safe configuration
    try {
      if (typeof mermaid.initialize === 'function') {
        const safeConfig = {
          startOnLoad: false,
          securityLevel: 'loose',
          ...config
        };
        mermaid.initialize(safeConfig);
      }
    } catch (initError) {
      console.warn('Warning: Failed to initialize mermaid', initError);
      // Continue anyway - initialization might have already happened
    }
    
    // Generate a unique ID for rendering
    const renderId = id || `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    console.log(`Rendering diagram with ID: ${renderId}`);
    
    // Render the diagram
    let svg;
    try {
      // Try the main render method first
      if (typeof mermaid.render === 'function') {
        console.log('Using mermaid.render function');
        const result = await mermaid.render(renderId, code);
        svg = result.svg || result;
      } 
      // Fall back to mermaidAPI if available
      else if (mermaid.mermaidAPI && typeof mermaid.mermaidAPI.render === 'function') {
        console.log('Using mermaid.mermaidAPI.render function');
        const result = await mermaid.mermaidAPI.render(renderId, code);
        svg = result.svg || result;
      } 
      else {
        throw new Error('No suitable render function found in mermaid');
      }
    } catch (renderError) {
      console.error('Error rendering mermaid diagram:', renderError);
      throw renderError;
    }
    
    // Validate the SVG output
    if (!svg || typeof svg !== 'string' || !svg.includes('<svg')) {
      throw new Error(`Invalid SVG output received from mermaid`);
    }
    
    return svg;
  } catch (err: unknown) {
    console.error('Mermaid render error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return `<pre style="color:red">${message}</pre>`;
  }
}