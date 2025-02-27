import { createServer } from 'vite'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { createViteConfig } from '../config/vite.config'
import { createJiti } from 'jiti'
import { execSync } from 'child_process'
import readline from 'readline'

interface DevOptions {
  component?: string
  vueVersion?: '2' | '2.7' | '3'
  watch?: boolean
  mode?: 'playground' | 'docs'
  all?: boolean
  last?: boolean
  sync?: boolean
  vueVersions?: ('2' | '2.7' | '3')[]
}

interface PlaygroundConfig {
  template: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

// 不同 Vue 版本的 playground 配置
const PLAYGROUND_CONFIGS: Record<string, PlaygroundConfig> = {
  '2': {
    template: 'vue2-playground',
    dependencies: {
      'vue': '~2.6.14',
      'vue-demi': '^0.14.0',
      '@vue/composition-api': '^1.7.2'
    },
    devDependencies: {
      'vite': '^4.5.0',
      'vite-plugin-vue2': '^2.0.3',
      'vue-template-compiler': '~2.6.14',
      'unocss': '^0.58.0',
      'vite-plugin-dts': '^3.6.4'
    }
  },
  '2.7': {
    template: 'vue2.7-playground',
    dependencies: {
      'vue': '^2.7.16',
      'vue-demi': '^0.14.0'
    },
    devDependencies: {
      'vite': '^4.5.0',
      '@vitejs/plugin-vue2': '^2.3.1',
      'unocss': '^0.58.0',
      'vite-plugin-dts': '^3.6.4'
    }
  },
  '3': {
    template: 'vue3-playground',
    dependencies: {
      'vue': '^3.5.0',
      'vue-demi': '^0.14.0'
    },
    devDependencies: {
      'vite': '^4.5.0',
      '@vitejs/plugin-vue': '^4.5.0',
      'unocss': '^0.58.0',
      'vite-plugin-dts': '^3.6.4'
    }
  }
}

// 开发历史记录文件路径
const DEV_HISTORY_FILE = path.join(process.cwd(), '.material-dev-history.json')

// 开发历史记录接口
interface DevHistory {
  lastComponent?: string
  recentComponents: string[]
}

class DevServer {
  private cwd: string
  private options: DevOptions
  private playgroundDir: string
  private docsDir: string
  private templateDir: string
  private devHistory: DevHistory
  private syncServers: Map<string, any> = new Map() // Store servers for each Vue version

  constructor(options: DevOptions) {
    this.cwd = process.cwd()
    this.options = options
    this.playgroundDir = path.join(this.cwd, `vue${options.vueVersion}-playground`)
    this.docsDir = path.join(this.cwd, 'docs')
    this.templateDir = path.join(__dirname, '../generators/templates/project')
    this.devHistory = this.loadDevHistory()
  }

  /**
   * 加载开发历史记录
   */
  private loadDevHistory(): DevHistory {
    try {
      if (fs.existsSync(DEV_HISTORY_FILE)) {
        return fs.readJsonSync(DEV_HISTORY_FILE)
      }
    } catch (error) {
      console.warn(chalk.yellow('无法读取开发历史记录，将创建新的记录'))
    }
    return { recentComponents: [] }
  }

  /**
   * 保存开发历史记录
   */
  private saveDevHistory(component: string): void {
    try {
      // 更新最近使用的组件
      this.devHistory.lastComponent = component
      
      // 更新最近组件列表
      const recentComponents = this.devHistory.recentComponents.filter(c => c !== component)
      recentComponents.unshift(component)
      
      // 只保留最近的5个组件
      this.devHistory.recentComponents = recentComponents.slice(0, 5)
      
      fs.writeJsonSync(DEV_HISTORY_FILE, this.devHistory, { spaces: 2 })
    } catch (error) {
      console.warn(chalk.yellow('无法保存开发历史记录'))
    }
  }

  /**
   * 获取所有可用组件
   */
  private async getAvailableComponents(): Promise<string[]> {
    const packagesDir = path.join(this.cwd, 'packages')
    
    if (!fs.existsSync(packagesDir)) {
      console.warn(chalk.yellow('未找到 packages 目录，请确保您在组件库项目根目录下运行此命令'))
      return []
    }
    
    const dirs = await fs.readdir(packagesDir)
    
    // 过滤掉非目录和以 . 开头的目录
    const components = []
    for (const dir of dirs) {
      const fullPath = path.join(packagesDir, dir)
      const stat = await fs.stat(fullPath)
      if (stat.isDirectory() && !dir.startsWith('.') && dir !== 'utils' && dir !== 'styles') {
        components.push(dir)
      }
    }
    
    return components
  }

  /**
   * 交互式选择组件
   */
  private async selectComponent(): Promise<string | undefined> {
    const components = await this.getAvailableComponents()
    
    if (components.length === 0) {
      console.log(chalk.yellow('未找到可用组件。请先创建组件或检查项目结构。'))
      return undefined
    }
    
    // 按照最近使用排序组件
    const sortedComponents = [...components].sort((a, b) => {
      const aIndex = this.devHistory.recentComponents.indexOf(a)
      const bIndex = this.devHistory.recentComponents.indexOf(b)
      
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
    
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      console.log(chalk.blue('\n🚀 请选择要开发的组件：'))
      
      // 显示组件列表，标记最近使用的组件
      sortedComponents.forEach((component, index) => {
        const isRecent = this.devHistory.recentComponents.includes(component)
        const marker = component === this.devHistory.lastComponent ? '(最近开发)' : isRecent ? '(最近使用)' : ''
        console.log(`  ${index + 1}. ${component} ${chalk.gray(marker)}`)
      })
      
      console.log(chalk.gray('\n输入数字选择组件，或直接输入组件名称：'))
      
      rl.question('> ', (answer) => {
        rl.close()
        
        // 检查是否输入了数字
        const num = parseInt(answer, 10)
        if (!isNaN(num) && num > 0 && num <= sortedComponents.length) {
          resolve(sortedComponents[num - 1])
          return
        }
        
        // 检查是否直接输入了组件名
        if (components.includes(answer)) {
          resolve(answer)
          return
        }
        
        // 尝试模糊匹配
        const matchedComponent = components.find(c => 
          c.toLowerCase().includes(answer.toLowerCase())
        )
        
        if (matchedComponent) {
          console.log(chalk.blue(`已选择组件: ${matchedComponent}`))
          resolve(matchedComponent)
          return
        }
        
        console.log(chalk.yellow('无效的选择，请重新运行命令'))
        resolve(undefined)
      })
    })
  }

  private async setupPlayground() {
    const { vueVersion = '3' } = this.options
    const config = PLAYGROUND_CONFIGS[vueVersion]

    if (!config) {
      throw new Error(`Unsupported Vue version: ${vueVersion}`)
    }

    // Create playground directory if it doesn't exist
    await fs.ensureDir(this.playgroundDir)

    // Copy template files
    const templatePath = path.join(this.templateDir, config.template)
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template directory not found: ${templatePath}`)
    }

    await fs.copy(templatePath, this.playgroundDir, { overwrite: true })

    // Update package.json with correct dependencies
    const pkgPath = path.join(this.playgroundDir, 'package.json')
    const pkg = await fs.readJson(pkgPath)
    
    // 确保dependencies和devDependencies对象存在
    if (!pkg.dependencies) {
      pkg.dependencies = {}
    }
    if (!pkg.devDependencies) {
      pkg.devDependencies = {}
    }
    
    // 合并配置中的依赖
    pkg.dependencies = { ...pkg.dependencies, ...config.dependencies }
    pkg.devDependencies = { ...pkg.devDependencies, ...config.devDependencies }
    
    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    // 删除 node_modules 目录，确保重新安装所有依赖
    const nodeModulesPath = path.join(this.playgroundDir, 'node_modules')
    if (fs.existsSync(nodeModulesPath)) {
      console.log(chalk.yellow('🗑️ 删除旧的 node_modules 目录...'))
      await fs.remove(nodeModulesPath)
    }

    // Install dependencies
    console.log(chalk.blue('📦 安装 playground 依赖中...'))
    await this.installDependencies(this.playgroundDir)
  }

  private async startComponentDev(component: string) {
    const componentDir = path.join(this.cwd, 'packages', component)
    if (!fs.existsSync(componentDir)) {
      throw new Error(`组件 "${component}" 在 packages 目录中不存在`)
    }

    // 检查组件是否有开发环境
    const demoDir = path.join(componentDir, 'demo')
    const exampleDir = path.join(componentDir, 'example')
    const devDir = path.join(componentDir, 'dev')
    
    let developmentDir = ''
    
    if (fs.existsSync(demoDir)) {
      developmentDir = demoDir
    } else if (fs.existsSync(exampleDir)) {
      developmentDir = exampleDir
    } else if (fs.existsSync(devDir)) {
      developmentDir = devDir
    }

    if (!developmentDir) {
      console.log(chalk.yellow('⚠️ 组件目录中未找到开发环境，正在创建...'))
      // 创建开发环境
      developmentDir = path.join(componentDir, 'demo')
      await fs.ensureDir(developmentDir)

      // 创建基本文件
      const { vueVersion = '3' } = this.options
      const isVue3 = vueVersion === '3'

      // 创建 package.json
      const pkg: {
        name: string;
        private: boolean;
        version: string;
        type: string;
        scripts: Record<string, string>;
        dependencies: Record<string, string>;
        devDependencies: Record<string, string>;
      } = {
        name: `${component}-demo`,
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          'vue': isVue3 ? '^3.5.0' : vueVersion === '2.7' ? '^2.7.16' : '~2.6.14',
          'vue-demi': '^0.14.0'
        },
        devDependencies: {
          'vite': '^4.5.0',
          [isVue3 ? '@vitejs/plugin-vue' : vueVersion === '2.7' ? '@vitejs/plugin-vue2' : 'vite-plugin-vue2']: isVue3 ? '^4.5.0' : '^2.3.1'
        }
      }

      if (vueVersion === '2') {
        pkg.dependencies['@vue/composition-api'] = '^1.7.2'
        pkg.devDependencies['vue-template-compiler'] = '~2.6.14'
      }

      await fs.writeJson(path.join(developmentDir, 'package.json'), pkg, { spaces: 2 })

      // 创建 vite.config.ts
      const viteConfig = `
import { defineConfig } from 'vite'
import path from 'path'
${isVue3 
  ? "import vue from '@vitejs/plugin-vue'" 
  : vueVersion === '2.7' 
    ? "import vue from '@vitejs/plugin-vue2'" 
    : "import { createVuePlugin as vue } from 'vite-plugin-vue2'"}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 链接到组件源码
      '${component}': path.resolve(__dirname, '../src')
    }
  }
})
      `.trim()

      await fs.writeFile(path.join(developmentDir, 'vite.config.ts'), viteConfig)

      // 创建 index.html
      const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${component} 组件开发</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
      `.trim()

      await fs.writeFile(path.join(developmentDir, 'index.html'), indexHtml)

      // 创建 src 目录
      const srcDir = path.join(developmentDir, 'src')
      await fs.ensureDir(srcDir)

      // 创建 main.ts
      const mainTs = isVue3 
        ? `
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
        `.trim()
        : vueVersion === '2.7'
        ? `
import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')
        `.trim()
        : `
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'

Vue.use(VueCompositionAPI)

new Vue({
  render: h => h(App)
}).$mount('#app')
        `.trim()

      await fs.writeFile(path.join(srcDir, 'main.ts'), mainTs)

      // 创建 App.vue
      const appVue = `
<template>
  <div class="app">
    <h1>${component} 组件开发</h1>
    <div class="demo-container">
      <!-- 组件使用示例 -->
      <${component.toLowerCase()}></${component.toLowerCase()}>
    </div>
  </div>
</template>

<script${isVue3 ? ' lang="ts"' : ''}>
${isVue3 
  ? `
import { defineComponent } from 'vue'
import ${component} from '../src/${component}.vue'

export default defineComponent({
  name: 'App',
  components: {
    ${component}
  }
})
  `.trim()
  : `
import ${component} from '../src/${component}.vue'

export default {
  name: 'App',
  components: {
    ${component}
  }
}
  `.trim()}
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.demo-container {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
      `.trim()

      await fs.writeFile(path.join(srcDir, 'App.vue'), appVue)

      // 创建 tsconfig.json
      const tsconfig = `
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    ${isVue3 ? '"jsx": "preserve",' : ''}

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
      `.trim()

      await fs.writeFile(path.join(developmentDir, 'tsconfig.json'), tsconfig)

      // 创建 tsconfig.node.json
      const tsconfigNode = `
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
      `.trim()

      await fs.writeFile(path.join(developmentDir, 'tsconfig.node.json'), tsconfigNode)

      console.log(chalk.green('✅ 组件开发环境创建完成'))
    }

    // 安装依赖
    if (!fs.existsSync(path.join(developmentDir, 'node_modules'))) {
      console.log(chalk.blue('📦 安装组件开发环境依赖中...'))
      await this.installDependencies(developmentDir)
    }

    // 启动开发服务器
    const server = await this.createDevServer(developmentDir)
    await server.listen()
    server.printUrls()

    // 保存开发历史
    this.saveDevHistory(component)

    return server
  }

  private async linkComponent(component: string, targetPlayground?: string) {
    // Use the specified playground directory or the default one
    const playgroundDir = targetPlayground || this.playgroundDir;
    
    const packagesDir = path.join(this.cwd, 'packages')
    const componentLinks = []

    // If a component is specified, only link that one
    if (component) {
      const componentDir = path.join(packagesDir, component)
      if (!fs.existsSync(componentDir)) {
        throw new Error(`Component "${component}" not found in packages directory`)
      }

      const componentPkg = await this.getComponentPackageInfo(component)
      if (componentPkg) {
        componentLinks.push(componentPkg)
      }
    } else {
      // Link all components
      const components = await this.getAvailableComponents()
      for (const comp of components) {
        const componentPkg = await this.getComponentPackageInfo(comp)
        if (componentPkg) {
          componentLinks.push(componentPkg)
        }
      }
    }

    // Update playground's package.json
    const playgroundPkgPath = path.join(playgroundDir, 'package.json')
    const playgroundPkg = await fs.readJson(playgroundPkgPath)

    // Ensure dependencies object exists
    if (!playgroundPkg.dependencies) {
      playgroundPkg.dependencies = {}
    }

    // Add component dependencies
    for (const comp of componentLinks) {
      playgroundPkg.dependencies[comp.name] = `file:${path.relative(playgroundDir, comp.path)}`
    }

    await fs.writeJson(playgroundPkgPath, playgroundPkg, { spaces: 2 })

    // Reinstall dependencies to link components
    console.log(chalk.blue(`📦 链接组件到 ${path.basename(playgroundDir)}...`))
    await this.installDependencies(playgroundDir)

    // Print linked components info
    console.log(chalk.green('\n📦 已链接组件:'))
    for (const comp of componentLinks) {
      // 添加提示信息，显示引用方式
      const importMode = comp.sourcePath !== comp.importPath 
        ? chalk.yellow(' (直接引用源码)') 
        : ' (包名引用)'
      console.log(chalk.blue(`  - ${comp.name}${importMode}`))
    }

    // If a component is specified, update App.vue file
    if (component && componentLinks.length > 0) {
      await this.updatePlaygroundAppVue(component, componentLinks[0], playgroundDir)
    }
  }

  // Updated method to support custom playground directory
  private async updatePlaygroundAppVue(componentName: string, componentInfo: any, targetPlayground?: string) {
    // Use the specified playground directory or the default one
    const playgroundDir = targetPlayground || this.playgroundDir;

    const appVuePath = path.join(playgroundDir, 'App.vue')
    
    if (!fs.existsSync(appVuePath)) {
      console.warn(chalk.yellow(`警告: ${playgroundDir}/App.vue 文件不存在`))
      return
    }

    try {
      // 读取 App.vue 文件内容
      let appVueContent = await fs.readFile(appVuePath, 'utf-8')
      
      // 组件名首字母大写
      const ComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
      // 获取kebab-case形式的组件名称
      const kebabCaseName = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
      
      // 使用sourcePath (直接引用源文件) 或 importPath (包名引用)
      const importPathToUse = componentInfo.sourcePath || componentInfo.importPath
      
      // 检查是否已经导入了该组件
      const importRegex = new RegExp(`import\\s+.*?from\\s+['"](${componentInfo.importPath}|${componentInfo.sourcePath || ''})['"]`)
      const componentRegex = new RegExp(`components:\\s*{[^}]*${ComponentName}[^}]*}`)
      
      // 如果没有导入该组件，添加导入语句
      if (!importRegex.test(appVueContent)) {
        // 查找 script 标签的结束位置
        const scriptEndIndex = appVueContent.indexOf('</script>')
        if (scriptEndIndex !== -1) {
          // 在 import 语句后添加新的导入
          const importMatch = appVueContent.match(/import.*?;/g)
          if (importMatch && importMatch.length > 0) {
            const lastImport = importMatch[importMatch.length - 1]
            const lastImportIndex = appVueContent.lastIndexOf(lastImport) + lastImport.length
            
            // 添加新的导入语句，使用直接路径
            const newImport = `\nimport ${ComponentName} from '${importPathToUse}';`
            appVueContent = appVueContent.slice(0, lastImportIndex) + newImport + appVueContent.slice(lastImportIndex)
          }
        }
      }
      
      // 如果没有注册该组件，添加组件注册
      if (!componentRegex.test(appVueContent)) {
        // 查找 components 对象
        const componentsMatch = appVueContent.match(/components:\s*{([^}]*)}/s)
        if (componentsMatch) {
          // 在 components 对象中添加新组件
          const componentsContent = componentsMatch[1]
          const componentsEndIndex = appVueContent.indexOf(componentsMatch[0]) + componentsMatch[0].length
          
          // 替换 components 对象，使用kebab-case的组件名称
          const tagName = kebabCaseName.includes('-') ? kebabCaseName : `v-${kebabCaseName}`;
          
          // 清理现有内容，移除多余的逗号
          const cleanedContent = componentsContent.trim().replace(/,\s*$/, '');
          
          const newComponentsObj = `components: {${cleanedContent ? `${cleanedContent},` : ''}
    '${tagName}': ${ComponentName}
  }`
          
          appVueContent = appVueContent.replace(/components:\s*{([^}]*)}/s, newComponentsObj)
        } else {
          // 如果没有 components 对象，在 setup 前添加
          const setupMatch = appVueContent.match(/setup\s*\(\s*\)\s*{/s)
          if (setupMatch) {
            const setupIndex = appVueContent.indexOf(setupMatch[0])
            
            // 添加 components 对象
            const tagName = kebabCaseName.includes('-') ? kebabCaseName : `v-${kebabCaseName}`;
            const newComponents = `  components: {
    '${tagName}': ${ComponentName}
  },
  `
            
            appVueContent = appVueContent.slice(0, setupIndex) + newComponents + appVueContent.slice(setupIndex)
          }
        }
      }
      
      // 添加组件使用示例
      if (!appVueContent.includes(`<${kebabCaseName}`) && !appVueContent.includes(`<v-${kebabCaseName}`)) {
        // 查找 template 标签内容
        const templateMatch = appVueContent.match(/<template>([\s\S]*?)<\/template>/s)
        if (templateMatch) {
          const templateContent = templateMatch[1]
          const demoSectionMatch = templateContent.match(/<div class="demo-.*?">/s)
          
          if (demoSectionMatch) {
            // 在现有的 demo 区域添加组件示例
            const demoSection = demoSectionMatch[0]
            const demoSectionIndex = templateContent.indexOf(demoSection) + demoSection.length
            
            // 添加组件示例，使用与注册相同的标签名
            const tagName = kebabCaseName.includes('-') ? kebabCaseName : `v-${kebabCaseName}`;
            const componentExample = `\n      <${tagName}></${tagName}>`
            
            appVueContent = appVueContent.replace(templateContent, 
              templateContent.slice(0, demoSectionIndex) + componentExample + templateContent.slice(demoSectionIndex)
            )
          } else {
            // 如果没有 demo 区域，在 template 末尾添加
            const tagName = kebabCaseName.includes('-') ? kebabCaseName : `v-${kebabCaseName}`;
            const newDemoSection = `\n  <div class="demo-${componentName.toLowerCase()}">\n    <${tagName}></${tagName}>\n  </div>`
            
            appVueContent = appVueContent.replace(templateContent, templateContent + newDemoSection)
          }
        }
      }
      
      // 写回文件
      await fs.writeFile(appVuePath, appVueContent, 'utf-8')
      console.log(chalk.green(`✅ 已更新 ${playgroundDir}/App.vue 文件，引入 ${ComponentName} 组件`))
    } catch (error) {
      console.warn(chalk.yellow(`警告: 无法更新 ${playgroundDir}/App.vue 文件`), error)
    }
  }

  private async getComponentPackageInfo(component: string) {
    const componentDir = path.join(this.cwd, 'packages', component)
    const pkgPath = path.join(componentDir, 'package.json')
    const srcDir = path.join(componentDir, 'src')
    const componentFile = path.join(srcDir, `${component}.vue`)

    // 检查组件文件是否存在
    const isComponentFileExists = fs.existsSync(componentFile)

    if (!fs.existsSync(pkgPath)) {
      console.warn(chalk.yellow(`警告: 组件 "${component}" 没有 package.json 文件`))
      return null
    }

    try {
      const pkg = await fs.readJson(pkgPath)
      
      // 为开发阶段添加直接引用源文件的路径
      const sourcePath = isComponentFileExists 
        ? `../packages/${component}/src/${component}.vue`
        : pkg.name
        
      return {
        name: pkg.name,
        path: componentDir,
        importPath: pkg.name,
        sourcePath // 添加源文件路径
      }
    } catch (error) {
      console.warn(chalk.yellow(`警告: 无法读取组件 "${component}" 的 package.json 文件`))
      return null
    }
  }

  private async installDependencies(cwd: string) {
    try {
      // Try pnpm first
      execSync('pnpm --version', { stdio: 'ignore' })
      execSync('pnpm install', { cwd, stdio: 'inherit' })
    } catch {
      // Fallback to npm
      execSync('npm install', { cwd, stdio: 'inherit' })
    }
  }

  private async createDevServer(root: string) {
    const server = await createServer({
      root,
      configFile: path.join(root, 'vite.config.ts'),
      mode: 'development'
    })

    return server
  }

  public async start() {
    const { component, mode = 'playground', vueVersion = '3', watch, all, last, sync, vueVersions } = this.options

    try {
      let selectedComponent = component

      // 如果没有指定组件，但指定了使用上次的组件
      if (!selectedComponent && last && this.devHistory.lastComponent) {
        selectedComponent = this.devHistory.lastComponent
        console.log(chalk.blue(`📝 使用上次开发的组件: ${selectedComponent}`))
      }
      
      // 如果没有指定组件，也没有使用上次的组件，则进入交互式选择
      if (!selectedComponent && !all) {
        selectedComponent = await this.selectComponent()
        
        // 如果用户取消了选择，则退出
        if (!selectedComponent) {
          console.log(chalk.yellow('❌ 已取消组件选择'))
          return
        }
      }

      // Handle sync development
      if (sync) {
        await this.setupSyncDevelopment(selectedComponent)
        
        // Save development history if component specified
        if (selectedComponent) {
          this.saveDevHistory(selectedComponent)
        }
        
        // Print status
        console.log(chalk.green('\n✨ 同步开发服务器已启动!'))
        if (selectedComponent) {
          console.log(chalk.blue(`📝 正在开发组件: ${selectedComponent}`))
        } else if (all) {
          console.log(chalk.blue('📝 正在开发所有组件'))
        }
        console.log(chalk.blue(`🎯 Vue 版本: ${vueVersions ? vueVersions.join(', ') : '2, 3'}`))
        if (watch) {
          console.log(chalk.yellow('👀 监听模式已启用'))
        }
        
        return
      }

      if (mode === 'playground') {
        // 优先使用 playground 模式，即使指定了组件
        console.log(chalk.blue(`📦 启动 playground (Vue ${vueVersion})`))
        
        if (!fs.existsSync(this.playgroundDir) || !fs.existsSync(path.join(this.playgroundDir, 'node_modules'))) {
          console.log(chalk.yellow(`⚠️ 正在为 Vue ${vueVersion} 设置 playground...`))
          await this.setupPlayground()
          console.log(chalk.green('✨ Playground 设置完成!'))
        }

        // 链接组件
        if (selectedComponent && !all) {
          // 如果指定了组件，只链接该组件
          await this.linkComponent(selectedComponent)
        } else {
          // 否则链接所有组件
          await this.linkComponent('')
        }

        // 启动开发服务器
        const server = await this.createDevServer(this.playgroundDir)
        await server.listen()
        server.printUrls()

        // 如果指定了组件，保存开发历史
        if (selectedComponent) {
          this.saveDevHistory(selectedComponent)
        }
      } else {
        // TODO: 实现文档站点开发
        throw new Error('文档站点开发功能尚未实现')
      }

      // 打印状态
      console.log(chalk.green('\n✨ 开发服务器已启动!'))
      if (selectedComponent) {
        console.log(chalk.blue(`📝 正在开发组件: ${selectedComponent}`))
      } else if (all) {
        console.log(chalk.blue('📝 正在开发所有组件'))
      }
      console.log(chalk.blue(`🎯 Vue 版本: ${vueVersion}`))
      if (watch) {
        console.log(chalk.yellow('👀 监听模式已启用'))
      }

    } catch (error) {
      console.error(chalk.red('\n❌ 启动开发服务器失败:'), error)
      process.exit(1)
    }
  }

  // Handle synchronized development across multiple Vue versions
  private async setupSyncDevelopment(component?: string) {
    console.log(chalk.blue('🔄 设置多版本同步开发...'))
    
    // Determine which Vue versions to use
    const versions = this.options.vueVersions || ['2', '3']
    
    // Create a playground for each version
    for (const version of versions) {
      console.log(chalk.blue(`📦 为 Vue ${version} 创建同步预览环境...`))
      
      // Setup specific version playground
      const versionPlaygroundDir = path.join(this.cwd, '.dev', `playground-vue${version}`)
      
      // Ensure directory exists
      await fs.ensureDir(versionPlaygroundDir)
      
      // Copy template files
      const config = PLAYGROUND_CONFIGS[version]
      if (!config) {
        throw new Error(`Unsupported Vue version: ${version}`)
      }
      
      const templatePath = path.join(this.templateDir, config.template)
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template directory not found: ${templatePath}`)
      }
      
      await fs.copy(templatePath, versionPlaygroundDir, { overwrite: true })
      
      // Update package.json with correct dependencies
      const pkgPath = path.join(versionPlaygroundDir, 'package.json')
      const pkg = await fs.readJson(pkgPath)
      
      // Ensure dependencies and devDependencies objects exist
      if (!pkg.dependencies) {
        pkg.dependencies = {}
      }
      if (!pkg.devDependencies) {
        pkg.devDependencies = {}
      }
      
      // Merge dependencies from config
      pkg.dependencies = { ...pkg.dependencies, ...config.dependencies }
      pkg.devDependencies = { ...pkg.devDependencies, ...config.devDependencies }
      
      // Customize dev server port based on Vue version
      const portMap: Record<string, number> = {
        '2': 5173,
        '2.7': 5174,
        '3': 5175
      }
      
      // Add custom dev port
      pkg.scripts = pkg.scripts || {}
      pkg.scripts.dev = `vite --port ${portMap[version]}`
      
      await fs.writeJson(pkgPath, pkg, { spaces: 2 })
      
      // Install dependencies if needed
      const nodeModulesPath = path.join(versionPlaygroundDir, 'node_modules')
      if (!fs.existsSync(nodeModulesPath)) {
        console.log(chalk.yellow(`🗑️ 为 Vue ${version} 安装依赖...`))
        try {
          await this.installDependencies(versionPlaygroundDir)
        } catch (error) {
          console.error(chalk.red(`安装 Vue ${version} 依赖失败，尝试重新安装...`))
          // 强制重新安装
          await fs.remove(nodeModulesPath)
          await this.installDependencies(versionPlaygroundDir)
        }
      }
      
      // Link the component to this playground
      if (component) {
        await this.linkComponent(component, versionPlaygroundDir)
      } else {
        await this.linkComponent('', versionPlaygroundDir)
      }
      
      // Create sync index file
      await this.createSyncIndexFile(versionPlaygroundDir, version, versions, portMap)
    }
    
    // Start dev servers
    await this.startSyncServers(versions)
  }
  
  // Create the sync index file for navigation between versions
  private async createSyncIndexFile(playgroundDir: string, currentVersion: string, allVersions: string[], portMap: Record<string, number>) {
    const syncIndexPath = path.join(playgroundDir, 'public', 'sync-control.js')
    await fs.ensureDir(path.join(playgroundDir, 'public'))
    
    const syncScript = `
// Sync Control Panel
window.addEventListener('DOMContentLoaded', () => {
  // Create sync control panel
  const syncControl = document.createElement('div');
  syncControl.style.position = 'fixed';
  syncControl.style.top = '10px';
  syncControl.style.right = '10px';
  syncControl.style.padding = '10px';
  syncControl.style.background = '#f0f0f0';
  syncControl.style.border = '1px solid #ccc';
  syncControl.style.borderRadius = '4px';
  syncControl.style.zIndex = '9999';
  
  // Add version indicator
  const versionIndicator = document.createElement('div');
  versionIndicator.innerText = 'Vue ${currentVersion}';
  versionIndicator.style.fontWeight = 'bold';
  versionIndicator.style.marginBottom = '8px';
  syncControl.appendChild(versionIndicator);
  
  // Add links to other versions
  const linkContainer = document.createElement('div');
  linkContainer.style.display = 'flex';
  linkContainer.style.gap = '8px';
  
  ${allVersions.map(version => {
    if (version === currentVersion) return '';
    return `
    const link${version.replace('.', '_')} = document.createElement('a');
    link${version.replace('.', '_')}.innerText = 'Vue ${version}';
    link${version.replace('.', '_')}.href = 'http://localhost:${portMap[version]}';
    link${version.replace('.', '_')}.target = '_blank';
    link${version.replace('.', '_')}.style.textDecoration = 'none';
    link${version.replace('.', '_')}.style.color = '#0066cc';
    linkContainer.appendChild(link${version.replace('.', '_')});
    `;
  }).join('')}
  
  syncControl.appendChild(linkContainer);
  document.body.appendChild(syncControl);
  
  // Listen for route changes to sync
  window.addEventListener('popstate', () => {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('sync_path', currentPath);
  });
  
  // Check if there's a synced path
  const syncedPath = localStorage.getItem('sync_path');
  if (syncedPath && window.location.pathname !== syncedPath) {
    history.pushState({}, '', syncedPath);
  }
});
    `;
    
    await fs.writeFile(syncIndexPath, syncScript);
    
    // Modify the main index.html to include this script
    const indexPath = path.join(playgroundDir, 'index.html');
    let indexContent = await fs.readFile(indexPath, 'utf-8');
    
    // Add script only if not already present
    if (!indexContent.includes('sync-control.js')) {
      indexContent = indexContent.replace(
        '</head>',
        '  <script src="/sync-control.js"></script>\n  </head>'
      );
      await fs.writeFile(indexPath, indexContent);
    }
  }
  
  // Start development servers for each Vue version
  private async startSyncServers(versions: string[]) {
    // Create and start all servers concurrently
    await Promise.all(versions.map(async version => {
      const versionPlaygroundDir = path.join(this.cwd, '.dev', `playground-vue${version}`);
      console.log(chalk.blue(`🚀 启动 Vue ${version} 开发服务器...`));
      
      // Create server
      const server = await this.createDevServer(versionPlaygroundDir);
      this.syncServers.set(version, server);
      
      // Start server
      await server.listen();
      console.log(chalk.green(`✅ Vue ${version} 服务器已启动`));
      server.printUrls();
    }));
  }
}

export async function dev(options: DevOptions = {}) {
  const server = new DevServer(options)
  await server.start()
} 