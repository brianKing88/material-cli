import { build as viteBuild } from 'vite'
import path from 'path'
import fs from 'fs-extra'
import { glob } from 'glob'
import { createViteConfig } from '../config/vite.config'
import type { BuildOptions, MaterialConfig } from '../types'
import chalk from 'chalk'
import { createJiti } from "jiti";

export async function build(options: BuildOptions) {
  console.log(chalk.blue('🔍 Searching for component configurations...'));
  try {
    // 使用 jiti 来处理 TypeScript 文件
    const jiti = createJiti(process.cwd(), {
      interopDefault: true, // 
      requireCache: false,
      extensions: ['.ts', '.js', '.json']
    });

    // 找到所有包含 material.config.ts 的组件目录
    const cwd = process.cwd()
    console.log(chalk.gray('Debug - Current working directory:', cwd));
    const componentDirs = await glob('packages/**/material.config.ts', {
      cwd,
      absolute: true,
      ignore: ['**/node_modules/**', '**/dist/**']
    })

    console.log(chalk.green(`Found ${componentDirs.length} component(s) to build`));

    // 遍历所有组件目录
    for (const configPath of componentDirs) {
      const componentDir = path.dirname(configPath)
      const componentName = path.basename(componentDir)
      console.log(chalk.blue(`\n📦 Building component: ${componentName}`))
      console.log(chalk.gray(`Component directory: ${componentDir}`))

      try {
        const config = jiti(configPath).default as MaterialConfig

        // Build for Vue 2
        console.log(chalk.cyan('\n🔨 Building for Vue 2...'))
        const vue2Config = await createViteConfig({
          root: componentDir,
          ...config.build,
          vueVersion: 2,
          outDir: 'dist/v2',
          mode: 'production'
        })
        await viteBuild(vue2Config)
        console.log(chalk.green('✅ Vue 2 build completed'))

        // Build for Vue 3
        console.log(chalk.cyan('\n🔨 Building for Vue 3...'))
        console.log(chalk.gray('Debug - Creating Vite config with options:'), {
          root: componentDir,
          mode: 'production',
          vueVersion: 3,
          outDir: 'dist/v3'
        });

        const vue3Config = await createViteConfig({
          root: componentDir,
          ...config.build,
          vueVersion: 3,
          outDir: 'dist/v3',
          mode: 'production'
        })
        await viteBuild(vue3Config)
        console.log(chalk.green('✅ Vue 3 build completed'))

        // 生成入口文件
        console.log(chalk.cyan('\n📝 生成入口文件...'))
        await generateEntryFiles(componentDir)
        console.log(chalk.green('✅ 入口文件生成完成'))

        if (options.watch) {
          console.log(chalk.yellow('👀 启用监听模式'))
          // TODO: 使用 chokidar 实现监听模式
        }

        console.log(chalk.green(`\n✨ Component ${componentName} built successfully!`))
      } catch (error) {
        console.error(chalk.red(`\n❌ Failed to build component ${componentName}:`), error);
        throw error;
      }
    }
    console.log(chalk.green('\n🎉 All components built successfully!'));

    // 检查构建输出
    for (const configPath of componentDirs) {
      const componentDir = path.dirname(configPath)
      const componentName = path.basename(componentDir)
      const files = [
        path.join(componentDir, 'dist/v2/index.js'),
        path.join(componentDir, 'dist/v3/index.js'),
        path.join(componentDir, 'index.js'),
        path.join(componentDir, 'index.mjs')
      ]

      console.log(chalk.blue(`\n📋 Checking build output for ${componentName}:`));
      for (const file of files) {
        if (await fs.pathExists(file)) {
          const stats = await fs.stat(file)
          console.log(chalk.green(`✅ ${path.basename(file)} (${stats.size} bytes)`));
        } else {
          console.log(chalk.red(`❌ ${path.basename(file)} not found`));
        }
      }
    }
  } catch (error: unknown) {
    console.error(chalk.red('\n❌ Build failed with error:'), error);
    console.error(chalk.red('Error stack:'), (error as Error).stack);
    process.exit(1);
  }
}

async function generateEntryFiles(componentDir: string) {
  const indexJs = `
'use strict'
const isVue2 = require('vue-demi').isVue2
module.exports = isVue2 ? require('./v2/index.js') : require('./v3/index.js')
`

  const indexMjs = `
import { isVue2 } from 'vue-demi';
console.log('index.mjs (ESM)', isVue2);

let mod;
if (isVue2) {
  mod = await import('./v2/index.mjs');
  await import('./v2/style.css');
} else {
  mod = await import('./v3/index.mjs');
}
export default mod.default;
`

  await fs.writeFile(path.join(componentDir, 'dist/index.js'), indexJs)
  await fs.writeFile(path.join(componentDir, 'dist/index.mjs'), indexMjs)

  // Copy types
  await fs.copy(
    path.join(componentDir, 'dist/v3/types'),
    path.join(componentDir, 'dist/types')
  )
} 