import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
    plugins: [react(), visualizer()],
  build: {
    rollupOptions: {
      input: {
        popup: 'public/popup.html',
        sidebar: 'public/sidebar.html',
        content: 'src/content_script.js',
        background: 'src/background.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'content') return 'content.js';
          if (chunk.name === 'background') return 'background.js';
          return 'assets/[name].js';
        },
      },
    },
  },
});

