import { resolve } from 'node:path';
import { UserConfig, defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import Unocss from 'unocss/vite';

export const viteVue2Config = defineConfig({
  plugins: [
    vue2(),
    Unocss(),
  ],
  server: {
    port: 2700,
  },
  resolve: {
    alias: {
      'vue': resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),
      'vue-demi': resolve(__dirname, '../node_modules/vue-demi/lib/v2.7/index.mjs'),
    },
  },
  build: {
    outDir: resolve(__dirname, `../dist/v2.7`),
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, '../src/index.ts'),
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

export default viteVue2Config;
