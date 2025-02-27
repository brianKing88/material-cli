import { build as viteBuild } from 'vite'
import path from 'path'
import fs from 'fs-extra'
import { glob } from 'glob'
import { createViteConfig } from '../config/vite.config'
import type { BuildOptions, MaterialConfig, ComponentConfig } from '../types'
import chalk from 'chalk'
import { createJiti } from "jiti";
import { execSync } from 'child_process'
import { Command } from 'commander'
import ora from 'ora'
import { getPackagesDir } from '../utils/paths'

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
    // 缓存所有组件的配置
    const componentMaterialConfigs = [];

    // 遍历所有组件目录
    for (const configPath of componentDirs) {
      const componentDir = path.dirname(configPath)
      const componentName = path.basename(componentDir)
      console.log(chalk.blue(`\n📦 Building component: ${componentName}`))
      console.log(chalk.gray(`Component directory: ${componentDir}`))

      try {
        const config = jiti(configPath).default as MaterialConfig

        // 在组件的dist/目录下生成material.config.json文件
        // -- 去除关于build的配置
        const config_ = { ...config, build: undefined };
        // -- 缓存所有组件的配置
        componentMaterialConfigs.push(config_);
        // Build for Vue 2
        console.log(chalk.cyan('\n🔨 Building for Vue 2...'))
        const vue2Config = await createViteConfig({
          root: componentDir,
          ...config.build,
          vueVersion: 2,
          outDir: 'dist/v2',
          mode: 'production'
        })
        // 
        await viteBuild(vue2Config)
        console.log(chalk.green(`✅ Vue 2 build ${componentName} completed`))

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
        console.log(chalk.green(`✅ Vue 3 build ${componentName} completed`))

        // 生成入口文件
        console.log(chalk.cyan('\n📝 生成入口文件...'))
        await generateEntryFiles(componentDir)
        console.log(chalk.green('✅ 入口文件生成完成'))

        // 生成material.config.json文件
        await fs.writeFile(path.join(componentDir, 'dist/material.config.json'), JSON.stringify(config_, null, 2))
        console.log(chalk.green(`✅ material.config.json file generated for ${componentName}`))

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
    console.log(chalk.green('\n🎉 All components built successfully!'));
    // 构建全量包
    await buildFullPackage(cwd, componentMaterialConfigs);
  } catch (error: unknown) {
    console.error(chalk.red('\n❌ Build failed with error:'), error);
    console.error(chalk.red('Error stack:'), (error as Error).stack);
    process.exit(1);
  }
}

// 拆分成以下几个方法
async function buildFullPackage(cwd: string, componentConfigs: ComponentConfig[]) {
  console.log(chalk.blue('\n📦 Building full package...'));

  try {
    // 1. 准备全量包的构建目录
    await prepareFullPackageDir(cwd);

    // 2. 生成入口文件
    await generateFullPackageEntry(cwd, componentConfigs);

    // 3. 生成 package.json
    await generateFullPackageJson(cwd, componentConfigs);

    // 4. 构建全量包
    await buildFullPackageBundle(cwd, componentConfigs);

    // 5. 生成material.index.json文件
    await generateMaterialIndexJson(cwd, componentConfigs);

    console.log(chalk.green('✅ Full package built successfully!'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to build full package:'), error);
    throw error;
  }
}

async function prepareFullPackageDir(cwd: string) {
  // 在根目录下创建dist目录
  const fullPackageDir = path.join(cwd, 'dist');
  await fs.ensureDir(fullPackageDir);
  return fullPackageDir;
}

async function generateFullPackageEntry(cwd: string, componentConfigs: ComponentConfig[]) {
  const fullPackageDir = path.join(cwd, '');
  // const rootPackageJson = await fs.readJson(path.join(cwd, 'package.json'));
  
  // 1. 生成主入口文件 (index.ts)
  const mainEntryContent = `
import type { App } from 'vue-demi'

// 导出所有组件
export * from './components'
// 导出全量包
export { default } from './bundle'
// 导出工具函数
export * from './utils'
`;

  // 2. 生成组件导出文件 (components.ts)
  const componentsContent = `
// 按需导出各个组件
${componentConfigs.map(config => 
  `export { default as ${config.name} } from './components/${config.name.toLowerCase()}'`
).join('\n')}
`;

  // 3. 生成全量包文件 (bundle.ts)
  const bundleContent = `
import type { App } from 'vue-demi'
${componentConfigs.map(config => 
  `import ${config.name} from './components/${config.name.toLowerCase()}'`
).join('\n')}

// 组件列表
const components = [
  ${componentConfigs.map(config => config.name).join(',\n  ')}
]

// 全量安装函数
export function install(app: App) {
  components.forEach(component => {
    app.use(component)
  })
}

export default {
  install,
  ${componentConfigs.map(config => config.name).join(',\n  ')}
}
`;

  // 4. 生成类型定义文件 (index.d.ts)
  const typesContent = `
import type { App } from 'vue-demi'

export function install(app: App): void

${componentConfigs.map(config => 
  `export { ${config.name}, ${config.name}Props } from './components/${config.name.toLowerCase()}'`
).join('\n')}

declare const _default: {
  install: typeof install;
  ${componentConfigs.map(config => 
    `${config.name}: typeof ${config.name};`
  ).join('\n  ')}
}
export default _default
`;

  // 创建目录结构
  await fs.ensureDir(path.join(fullPackageDir, 'src'));
  await fs.ensureDir(path.join(fullPackageDir, 'src/components'));
  await fs.ensureDir(path.join(fullPackageDir, 'src/utils'));

  // 写入文件
  await fs.writeFile(path.join(fullPackageDir, 'src/index.ts'), mainEntryContent);
  await fs.writeFile(path.join(fullPackageDir, 'src/components.ts'), componentsContent);
  await fs.writeFile(path.join(fullPackageDir, 'src/bundle.ts'), bundleContent);
  await fs.writeFile(path.join(fullPackageDir, 'src/index.d.ts'), typesContent);
}

async function generateFullPackageJson(cwd: string, componentConfigs: ComponentConfig[]) {
  const fullPackageDir = path.join(cwd, 'dist');
  const rootPackageJson = await fs.readJson(path.join(cwd, 'package.json'));

  const fullPackageJson = {
    name: rootPackageJson.name,
    version: rootPackageJson.version,
    description: rootPackageJson.description,
    main: 'dist/index.js',
    module: 'dist/index.mjs',
    types: 'dist/index.d.ts',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.mjs',
        require: './dist/index.js'
      },
      './bundle': {
        types: './dist/bundle.d.ts',
        import: './dist/bundle.mjs',
        require: './dist/bundle.js'
      },
      './components': {
        types: './dist/components.d.ts',
        import: './dist/components.mjs',
        require: './dist/components.js'
      },
      // 为每个组件添加子路径导出
      ...Object.fromEntries(
        componentConfigs.map(config => [
          `./components/${config.name.toLowerCase()}`,
          {
            types: `./dist/components/${config.name.toLowerCase()}/index.d.ts`,
            import: `./dist/components/${config.name.toLowerCase()}/index.mjs`,
            require: `./dist/components/${config.name.toLowerCase()}/index.js`,
            style: `./dist/components/${config.name.toLowerCase()}/style/index.css`
          }
        ])
      )
    },
    files: [
      'dist',
      'README.md'
    ],
    sideEffects: [
      "**/*.css",
      "**/*.scss",
      "./dist/bundle.js",
      "./dist/bundle.mjs"
    ],
    peerDependencies: {
      'vue': '^2.6.0 || ^3.0.0',
      'vue-demi': '^0.14.0'
    },
    publishConfig: {
      access: 'public'
    }
  };

  await fs.writeFile(
    path.join(fullPackageDir, 'package.json'),
    JSON.stringify(fullPackageJson, null, 2)
  );
}

async function buildFullPackageBundle(cwd: string, componentConfigs: ComponentConfig[]) {
  const fullPackageDir = path.join(cwd, 'dist');
  const rootPackageJson = await fs.readJson(path.join(cwd, 'package.json'));
  
  // 1. 复制各个组件的打包产物
  for (const config of componentConfigs) {
    const componentName = config.name.toLowerCase();
    const srcDir = path.join(cwd, `packages/${componentName}/dist`);
    const destDir = path.join(fullPackageDir, `components/${componentName}`);
    
    // 复制组件的构建产物
    await fs.copy(srcDir, destDir, {
      filter: (src) => {
        // 排除不需要的文件
        return !src.includes('material.config.json') && 
               !src.includes('v2') && 
               !src.includes('v3');
      }
    });
  }

  // 2. 生成入口文件
  // index.js (CommonJS)
  const indexJs = `
'use strict';
const { isVue2 } = require('vue-demi');

const components = {};
${componentConfigs.map(config => `
components.${config.name} = require('./components/${config.name.toLowerCase()}').default;`).join('')}

module.exports = {
  install(app) {
    Object.values(components).forEach(component => {
      app.use(component);
    });
  },
  ...components
};
`;

  // index.mjs (ESM)
  const indexMjs = `
import { isVue2 } from 'vue-demi';
${componentConfigs.map(config => 
  `import ${config.name} from './components/${config.name.toLowerCase()}';`
).join('\n')}

export {
  ${componentConfigs.map(config => config.name).join(',\n  ')}
};

export function install(app) {
  [${componentConfigs.map(config => config.name).join(', ')}].forEach(component => {
    app.use(component);
  });
}

export default {
  install,
  ${componentConfigs.map(config => config.name).join(',\n  ')}
};
`;

  // index.d.ts
  const indexDts = `
import type { App } from 'vue-demi';

export function install(app: App): void;

${componentConfigs.map(config => 
  `export { default as ${config.name} } from './components/${config.name.toLowerCase()}';`
).join('\n')}

declare const _default: {
  install: typeof install;
  ${componentConfigs.map(config => 
    `${config.name}: typeof ${config.name};`
  ).join('\n  ')}
};

export default _default;
`;

  // 写入入口文件
  await fs.writeFile(path.join(fullPackageDir, 'index.js'), indexJs);
  await fs.writeFile(path.join(fullPackageDir, 'index.mjs'), indexMjs);
  await fs.writeFile(path.join(fullPackageDir, 'index.d.ts'), indexDts);

  /* 暂时注释掉 UMD 模块构建... */

  // 3. 生成样式入口文件
  const styleEntryContent = componentConfigs
    .map(config => `import './components/${config.name.toLowerCase()}/style/index.css';`)
    .join('\n');
  
  await fs.writeFile(
    path.join(fullPackageDir, 'style.js'),
    styleEntryContent
  );
}

async function generateMaterialIndexJson(cwd: string, componentConfigs: any[]) {
  const packageJson = await fs.readJson(path.join(cwd, 'package.json'))
  // 在根目录下/dist/目录下生成material.json文件
  const repoInfo = {
    code: packageJson?.material?.code,
    name: packageJson?.material?.name,
    npmName: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    image: packageJson.material?.image,
    gitUrl: packageJson.material?.gitUrl
  }
  const indexConfig = {
    repoInfo,
    components: componentConfigs
  }
  // 
  await fs.writeFile(path.join(cwd, 'dist/material.json'), JSON.stringify(indexConfig, null, 2))
}


async function generateEntryFiles(componentDir: string) {
  const indexJs = `
'use strict'
const isVue2 = require('vue-demi').isVue2
module.exports = isVue2 ? require('./v2/index.js') : require('./v3/index.js')
`

  const indexMjs = `
import { isVue2 } from 'vue-demi';

// 动态导入函数，避免使用顶级 await
function loadModule() {
  if (isVue2) {
    return import('./v2/index.mjs').then(mod => {
      import('./v2/style.css');
      return mod.default;
    });
  } else {
    return import('./v3/index.mjs').then(mod => mod.default);
  }
}

// 导出一个包装后的组件
const component = {
  install: (...args) => {
    loadModule().then(mod => {
      if (mod && mod.install) {
        mod.install(...args);
      }
    });
  }
};

export default component;
`

  await fs.writeFile(path.join(componentDir, 'dist/index.js'), indexJs)
  await fs.writeFile(path.join(componentDir, 'dist/index.mjs'), indexMjs)

  // 创建types目录
  await fs.ensureDir(path.join(componentDir, 'dist/types'))
  
  // 查找所有生成的.d.ts文件
  const v3TypeFiles = await glob('dist/v3/**/*.d.ts', {
    cwd: componentDir,
    absolute: false
  })
  
  // 如果找到了类型文件，复制到dist/types目录
  if (v3TypeFiles.length > 0) {
    for (const typeFile of v3TypeFiles) {
      const fileName = path.basename(typeFile)
      const sourceFile = path.join(componentDir, typeFile)
      const targetFile = path.join(componentDir, 'dist/types', fileName)
      
      try {
        await fs.copy(sourceFile, targetFile)
        console.log(chalk.green(`✅ Copied type file: ${fileName}`))
      } catch (error) {
        console.warn(chalk.yellow(`⚠️ Failed to copy type file ${fileName}: ${error}`))
      }
    }
  } else {
    console.warn(chalk.yellow(`⚠️ No type declaration files found in dist/v3`))
    
    // 尝试在其他位置查找类型文件
    const allTypeFiles = await glob('dist/**/*.d.ts', {
      cwd: componentDir,
      absolute: false,
      ignore: ['dist/types/**']
    })
    
    if (allTypeFiles.length > 0) {
      console.log(chalk.blue(`📝 Found ${allTypeFiles.length} type files in other locations`))
      for (const typeFile of allTypeFiles) {
        const fileName = path.basename(typeFile)
        const sourceFile = path.join(componentDir, typeFile)
        const targetFile = path.join(componentDir, 'dist/types', fileName)
        
        try {
          await fs.copy(sourceFile, targetFile)
          console.log(chalk.green(`✅ Copied type file from alternate location: ${fileName}`))
        } catch (error) {
          console.warn(chalk.yellow(`⚠️ Failed to copy type file ${fileName}: ${error}`))
        }
      }
    } else {
      // 如果没有找到任何类型文件，创建一个基本的index.d.ts
      const basicDts = `
import { DefineComponent } from 'vue-demi'

declare const component: DefineComponent<{}, {}, any>
export default component
`
      await fs.writeFile(path.join(componentDir, 'dist/types/index.d.ts'), basicDts)
      console.log(chalk.blue(`📝 Created basic index.d.ts file`))
    }
  }
}

export function registerBuildCommand(program: Command) {
  program
    .command('build')
    .description('Build all components for Vue 2 and Vue 3')
    .option('--watch', 'Watch mode')
    .action(async (options) => {
      try {
        await build(options);
      } catch (error: any) {
        console.error(chalk.red(`Error building components: ${error.message}`));
        process.exit(1);
      }
    });
} 