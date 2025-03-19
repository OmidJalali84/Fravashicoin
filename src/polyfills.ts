import { Buffer } from "buffer";

declare global {
  interface Window {
    global: any;
    Buffer: typeof Buffer;
    process: { env: Record<string, any> };
  }
}

// Set polyfills
window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

export {};
