import { UserConfig as ViteConfig, Plugin, mergeConfig, LogLevel } from 'vite'
import type { OutputOptions } from 'rollup'
import dts from 'vite-plugin-dts'
// import { viteSingleFile } from "vite-plugin-singlefile"
// import VitePluginStyleInject from 'vite-plugin-style-inject';
// import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { resolve } from 'path'
import chalk from 'chalk'

// 获取项目根目录的绝对路径
const PROJECT_ROOT = resolve(__dirname, '../..')

// console.log(chalk.gray('\nDebug - 配置文件位置:'), {
//   __dirname,
//   PROJECT_ROOT,
//   cwd: process.cwd()
// });

interface CreateViteConfigOptions {
  root: string
  mode: 'development' | 'production'
  vueVersion: 2 | 3
  outDir?: string
  target?: string[]
  formats?: ('esm' | 'cjs' | 'umd')[]
  css?: boolean
  sourcemap?: boolean
  dts?: boolean
  viteConfig?: ViteConfig
}

// 添加辅助类型
type GlobalsOption = { [key: string]: string }
type RollupOutput = OutputOptions & { globals?: GlobalsOption }

// 创建 Vue 插件配置的辅助函数
function createVuePluginOptions(vueVersion: 2 | 3) {
  const baseOptions = {
    // 只匹配以 .vue 结尾的路径
    include: [/\.vue$/],
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => tag.startsWith('v-'),
        whitespace: 'preserve',
        comments: true
      }
    },
    script: {
      defineModel: true,
      propsDestructure: true,
      babelParserPlugins: ['jsx', 'typescript']
    },
    style: {
      trim: true
    },
    customElement: true
  };

  if (vueVersion === 2) {
    return {
      jsx: true,
      include: [/\.vue$/]
    };
  }
  console.log('baseOptions', baseOptions);
  return baseOptions;
}




export async function createViteConfig(options: CreateViteConfigOptions): Promise<ViteConfig> {
  const {
    root,
    mode,
    vueVersion,
    target = ['es2015'],
    formats = ['es', 'cjs', 'umd'],
    css = true, // 是否生成 CSS 文件
    sourcemap = true, // 是否生成 sourcemap 文件
    dts: generateDts = true, // 是否生成类型声明文件
    outDir = 'dist', // 输出目录
    viteConfig = {} // 自定义 Vite 配置
  } = options;

  console.log(chalk.gray('\nDebug - Build options:'), {
    root,
    mode,
    vueVersion,
    outDir,
    PROJECT_ROOT,
    tsConfigPath: resolve(PROJECT_ROOT, 'tsconfig.json')
  });

  let vuePlugin: Plugin;
  if (vueVersion === 2) {
    // 使用 vite-plugin-vue2 进行 Vue2 的 SFC 编译
    const { createVuePlugin } = require('vite-plugin-vue2');
    console.log('vue2 .....');
    vuePlugin = createVuePlugin(createVuePluginOptions(2));
  } else {
    // 使用 @vitejs/plugin-vue 进行 Vue3 的 SFC 编译
    const vue = require('@vitejs/plugin-vue');
    console.log('vue3 .....', "require('@vitejs/plugin-vue')");
    vuePlugin = vue.default(createVuePluginOptions(3));
  }
  console.log('css', css);

  // // Add debug environment variable
  // process.env.DEBUG = 'vite:*';

  const baseConfig: ViteConfig = {
    root,
    mode,
    resolve: {
      mainFields: ['module', 'jsnext:main', 'jsnext'],
      alias: {
        '@': resolve(root, 'src'),
        'vue': vueVersion === 2 ? 'vue2' : 'vue',
        'vue-demi': resolve(PROJECT_ROOT, `node_modules/vue-demi/lib/v${vueVersion}/index.mjs`)
      },
      dedupe: ['vue', 'vue-demi']
    },
    optimizeDeps: {
      exclude: ['vue-demi'],
      include: ['vue']
    },
    build: {
      target,
      outDir,
      lib: {
        entry: resolve(root, 'src/index.ts'),
        formats: formats as any[],
        name: 'Material',
        fileName: (format) => {
          switch (format) {
            case 'es':
              return 'index.mjs'
            case 'cjs':
              return 'index.js'
            case 'umd':
              return 'index.umd.js'
            default:
              return 'index.js'
          }
        }
      },
      rollupOptions: {
        external: ['vue', 'vue-demi'],
        output: {
          globals: {
            vue: 'Vue',
            'vue-demi': 'VueDemi'
          }
        }
      },
      cssCodeSplit: false,
      sourcemap: sourcemap,
      minify: false
    },
    css: {
      postcss: {
        plugins: []
      }
    },
    plugins: [
      vuePlugin,
      // vueVersion === 3 ? viteSingleFile() : null,
      // vueVersion !== 2 ? VitePluginStyleInject() : null,
      // vueVersion === 3 ? cssInjectedByJsPlugin({
      //   injectCode: (cssText: string) => `
      //     (function() {
      //       if (typeof document !== 'undefined') {
      //         var elementStyle = document.createElement('style');
      //         elementStyle.appendChild(document.createTextNode(${cssText}));
      //         document.head.appendChild(elementStyle);
      //       }
      //     })();
      //   `
      // }) : null,
      generateDts && dts({
        include: ['src/**/*.ts', 'src/**/*.vue'],
        exclude: ['src/**/__tests__/**', '**/*.vue?*'],
        outputDir: `${outDir}/types`,
        beforeWriteFile: (filePath, content) => {
          console.log('Debug - DTS Plugin:', {
            filePath,
            contentLength: content.length,
            tsConfigPath: resolve(PROJECT_ROOT, 'tsconfig.json'),
            currentDir: process.cwd(),
            root
          });
          
          // 提取文件名，忽略路径
          const fileName = filePath.split('/').pop();
          // 构建新的文件路径，确保类型声明文件直接放在types目录下
          const newFilePath = `${outDir}/types/${fileName}`;
          
          return {
            filePath: newFilePath,
            content
          };
        },
        tsConfigFilePath: resolve(PROJECT_ROOT, 'tsconfig.json'),
        logLevel: 'info' as LogLevel
      })
    ].filter(Boolean)
  };

  // 智能合并配置
  const mergedConfig = mergeConfig(baseConfig, { ...viteConfig });
  console.log('mergedConfig', mergedConfig);
  return mergedConfig;
}
