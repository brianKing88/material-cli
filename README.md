# Material CLI

Material CLI 是一个用于构建 Vue 组件库的命令行工具，支持同时构建 Vue 2.x 和 Vue 3.x 版本的组件。

## 特性

- 支持 Vue 2.x 和 Vue 3.x 双版本构建
- 基于 vite 的快速构建
- TypeScript 支持
- 自动生成类型声明文件
- 支持 CSS/LESS/SASS 样式处理
- 支持组件按需加载

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
# 启动开发服务器
material dev

# 指定组件开发
material dev button

# 监听模式
material dev --watch
```

开发服务器支持：

- 热更新
- TypeScript 实时编译
- 样式热重载
- 组件预览

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

## 最佳实践

1. 使用 TypeScript 编写组件
2. 为每个组件编写测试用例
3. 添加完整的组件文档
4. 使用语义化版本号
5. 遵循组件目录结构规范

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

## 许可证

MIT
