# Material CLI

Material CLI 是一个用于构建 Vue 组件库的命令行工具，支持同时构建 Vue 2.x 和 Vue 3.x 版本的组件。

## 特性

- 支持 Vue 2.x 和 Vue 3.x 双版本构建
- 基于 vite 的快速构建
- TypeScript 支持
- 自动生成类型声明文件
- 支持 CSS/LESS/SASS 样式处理
- 支持组件按需加载
- 提供灵活的开发环境，支持组件独立开发和 playground 模式

## 安装

```bash
# 全局安装
npm install -g material-cli
# 或
pnpm add -g material-cli
```

## 使用方法

### 1. 初始化项目

```bash
# 创建新项目
material init my-component-lib

# 或在现有目录中初始化
cd my-component-lib
material init
```

这将创建一个基础的组件库项目结构：

```
my-component-lib/
├── packages/          # 组件目录
├── example/          # 示例目录
├── scripts/          # 构建脚本
├── package.json
├── tsconfig.json
└── material.config.ts # 构建配置文件
```

### 2. 添加新组件

```bash
# 在 packages 目录下创建新组件
material add button

# 指定组件目录
material add button --path packages/basic
```

这将创建组件基础文件结构：

```
packages/button/
├── src/
│   ├── index.ts        # 组件入口
│   └── button.vue      # 组件实现
├── style/
│   └── index.scss      # 组件样式
├── __tests__/          # 测试目录
├── package.json        # 组件配置
└── README.md          # 组件文档
```

### 3. 开发模式

```bash
# 启动开发服务器（交互式选择组件）
material dev

# 指定组件开发
material dev button

# 指定 Vue 版本
material dev --vue-version 2
material dev --vue-version 2.7
material dev --vue-version 3

# 使用上次开发的组件
material dev --last

# 开发所有组件
material dev --all

# 选择开发模式
material dev --mode playground  # 默认
material dev --mode docs        # 文档站点模式

# 监听模式
material dev --watch
```

开发服务器提供以下功能：

- **交互式组件选择**：如果不指定组件，会提供交互式界面选择要开发的组件
- **历史记录**：记住最近开发的组件，可以使用 `--last` 快速恢复上次的开发环境
- **多 Vue 版本支持**：可以指定 Vue 2、Vue 2.7 或 Vue 3 版本进行开发
- **Playground 模式**：自动创建一个独立的开发环境，链接到组件源码
- **组件独立开发**：每个组件可以有自己的开发环境（demo 目录）
- **自动创建开发环境**：如果组件没有开发环境，会自动创建一个基础的开发环境
- **热更新**：支持组件代码和样式的热重载
- **TypeScript 支持**：完整的 TypeScript 类型支持

### 4. 构建项目

```bash
# 构建整个组件库
material build

# 构建单个组件
material build button

# 指定构建选项
material build --formats esm,cjs,umd --dts
```

构建输出：

```
dist/
├── v2/              # Vue 2.x 版本
│   ├── button/
│   │   ├── index.js     # CommonJS
│   │   ├── index.mjs    # ES Module
│   │   └── style.css    # 样式文件
│   └── ...
├── v3/              # Vue 3.x 版本
│   ├── button/
│   │   ├── index.js
│   │   ├── index.mjs
│   │   └── style.css
│   └── ...
└── types/           # 类型声明文件
    └── button/
        └── index.d.ts
```

## 配置选项

### material.config.ts

```typescript
import { defineConfig } from 'material-cli'

export default defineConfig({
  // 组件库名称
  name: 'my-components',
  
  // 构建配置
  build: {
    // 目标环境
    target: ['es2015'],
    // 输出格式
    formats: ['esm', 'cjs', 'umd'],
    // 是否生成 CSS 文件
    css: true,
    // 是否生成类型声明文件
    dts: true,
    // 是否生成 sourcemap
    sourcemap: true
  },
  
  // 开发服务器配置
  dev: {
    port: 3000,
    open: true
  }
})
```

## 开发工作流

### 组件开发流程

1. **创建组件**：使用 `material add` 命令创建新组件
2. **开发组件**：使用 `material dev` 命令启动开发环境
   - 可以在组件的 `demo` 目录中开发和测试组件
   - 或使用 playground 模式进行多组件联合开发
3. **构建组件**：使用 `material build` 命令构建组件
4. **测试组件**：编写和运行测试用例
5. **发布组件**：更新版本号并发布到 npm

### Playground 开发

Playground 模式提供了一个完整的 Vue 应用环境，用于开发和测试组件：

- 自动链接到本地组件源码
- 支持热更新
- 可以同时测试多个组件的交互
- 为不同 Vue 版本提供独立的 playground 环境

## 最佳实践

1. 使用 TypeScript 编写组件
2. 为每个组件编写测试用例
3. 添加完整的组件文档
4. 使用语义化版本号
5. 遵循组件目录结构规范
6. 利用 playground 模式测试组件间交互
7. 使用 `--last` 选项快速恢复开发环境

## 常见问题

1. **构建失败**

   - 检查依赖版本兼容性
   - 确保配置文件格式正确
   - 查看详细错误日志
2. **类型声明问题**

   - 确保 TypeScript 配置正确
   - 检查类型导出是否完整
3. **样式问题**

   - 检查预处理器配置
   - 确保样式文件正确导入
4. **开发环境问题**
   - 检查 Vue 版本兼容性
   - 确保组件正确链接到 playground
   - 尝试删除 node_modules 并重新安装依赖

## 许可证

MIT
