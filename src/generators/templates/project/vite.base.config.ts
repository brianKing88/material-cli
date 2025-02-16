/// <reference types="vitest" />
import * as path from 'node:path';
import { Plugin, defineConfig } from 'vite';
import { isVue2, isVue3 } from 'vue-demi';
import Unocss from 'unocss/vite';
import DtsPlugin from 'vite-plugin-dts';

console.log('base Vue version:', isVue2 ? 'v2' : 'v3');

const outputName = 'index';

export const getSharedPlugins = (vueVersion: 'v2' | 'v2.7' | 'v3'): Plugin[] => {
  const isV2 = vueVersion.startsWith('v2');
  return [
    Unocss(),
    DtsPlugin({
      root: '..',
      compilerOptions: {
        skipLibCheck: true,
      },
      include: ['src/**'],
      skipDiagnostics: isV2,
      noEmitOnError: isV2,
    }),
  ];
};

// https://vitejs.dev/config/
export const baseBuildConfig = defineConfig({
  build: {
    outDir: path.resolve(__dirname, `./dist/${isVue2 ? 'v2' : 'v3'}`),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'VueDemiTemplateComponent',
      fileName: format => `${outputName}.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', '@vue/composition-api', '@vue/composition-api/dist/vue-composition-api.mjs'],
      output: {
        globals: {
          'vue': 'Vue',
          '@vue/composition-api': 'VueCompositionAPI',
          '@vue/composition-api/dist/vue-composition-api.mjs': 'VueCompositionAPI',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return `${isVue2 ? 'v2' : 'v3'}/[name][extname]`;
          }
          return '[name][extname]';
        }
      },
    },
  },
  optimizeDeps: {
    exclude: ['vue-demi', 'vue', 'vue2', 'vue3'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['__test__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    alias: {
      '@tests/utils': path.resolve(__dirname, `./tests/utils`),
    },
    setupFiles: [path.resolve(__dirname, 'tests/setup.ts')],
    deps: {
      inline: ['vue2.7', 'vue2', 'vue-demi', '@vue/test-utils', '@vue/test-utils2'],
    },
    resolveSnapshotPath: (testPath, snapExtension) => {
      return path.join(
        path.join(
          path.dirname(testPath),
          isVue2 ? '__snapshots__' : '__snapshotsV3__',
        ),
        `${path.basename(testPath)}${snapExtension}`,
      );
    },
  },
});
