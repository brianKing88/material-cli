import * as path from 'node:path';
import { type Plugin, defineConfig } from 'vite';
import vue3 from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';

export const viteVue3Config = defineConfig({
  plugins: [
    vue3() as unknown as Plugin,
    Unocss(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'vue': path.resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm-browser.js'),
      'vue-demi': path.resolve(__dirname, '../node_modules/vue-demi/lib/v3/index.mjs'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../dist/v3'),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, '../src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'VueDemiTemplateComponent',
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', '@vue/composition-api', '@vue/composition-api/dist/vue-composition-api.mjs'],
      output: {
        globals: {
          'vue': 'Vue',
          '@vue/composition-api': 'VueCompositionAPI',
          '@vue/composition-api/dist/vue-composition-api.mjs': 'VueCompositionAPI',
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['vue-demi', 'vue', 'vue2', 'vue3'],
  },
});

export default viteVue3Config;
