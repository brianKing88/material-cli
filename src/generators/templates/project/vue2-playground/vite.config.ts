import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { createVuePlugin as vue2 } from 'vite-plugin-vue2';
import Unocss from 'unocss/vite';
import type { OutputChunk, Plugin } from 'rollup';

function fixCjsCompositionApi(): Plugin {
  return {
    name: 'vite-plugin-zyb-login:fix-cjs-composition-api',
    apply: 'build',
    enforce: 'post',
    generateBundle(options, bundle) {
      if (options.format === 'cjs') {
        Object.keys(bundle).forEach((key) => {
          if (key === 'index.cjs.js' && bundle[key].type === 'chunk') {
            (bundle[key] as OutputChunk).code = (bundle[key] as OutputChunk).code.replaceAll('@vue/composition-api/dist/vue-composition-api.mjs', '@vue/composition-api');
          }
        });
      }
    },
  };
}

export const viteVue2Config = defineConfig({
  plugins: [
    vue2(),
    Unocss(),
    fixCjsCompositionApi()
  ],
  server: {
    port: 2000,
  },
  resolve: {
    alias: {
      'vue': resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),
      'vue-demi': resolve(__dirname, '../node_modules/vue-demi/lib/v2/index.mjs'),
    },
    dedupe: ['vue', '@vue/composition-api'],
  },
  build: {
    outDir: resolve(__dirname, `../dist/v2`),
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
