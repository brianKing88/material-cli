# Material CLI

Material CLI 是一个用于构建 Vue 组件库的命令行工具，支持同时构建 Vue 2.x 和 Vue 3.x 版本的组件。

## 特性

- 支持 Vue 2.x 和 Vue 3.x 双版本构建
- 基于 vite 的快速构建
- TypeScript 支持
- 自动生成类型声明文件
- 支持 CSS/SCSS 样式处理
- 支持组件按需加载
- 支持组件库文档生成

## 安装

```bash
pnpm add material-cli -D
```

## 使用方法

### 1. 组件目录结构

组件库应遵循以下目录结构：

```
packages/
  ├── ComponentA/
  │   ├── src/
  │   │   ├── index.ts        # 组件入口文件
  │   │   └── component.vue   # 组件实现
  │   ├── package.json        # 组件配置文件
  │   └── material.config.ts  # 组件构建配置
  └── ComponentB/
      └── ...
```

### 2. 组件配置

在组件目录下创建 `material.config.ts`：

```typescript
import { defineConfig } from 'material-cli'

export default defineConfig({
  name: 'component-name',
  build: {
    target: ['es2015'],
    formats: ['esm', 'cjs'],
    css: true,
    dts: true
  }
})
```

### 3. 构建命令

```bash
# 构建单个组件
material build ComponentA

# 构建所有组件
material build

# 开发模式
material dev ComponentA
```

## 构建输出

每个组件会生成以下文件结构：

```
dist/
  ├── v2/              # Vue 2.x 版本
  │   ├── index.js     # CommonJS 格式
  │   ├── index.mjs    # ES Module 格式
  │   └── style.css    # 样式文件
  ├── v3/              # Vue 3.x 版本
  │   ├── index.js
  │   ├── index.mjs
  │   └── style.css
  └── types/           # TypeScript 类型声明
      └── index.d.ts
```

## 配置选项

### material.config.ts

```typescript
interface MaterialConfig {
  // 组件名称
  name: string;
  
  // 构建配置
  build: {
    // 目标环境
    target: string[];
    // 输出格式
    formats: ('esm' | 'cjs' | 'umd')[];
    // 是否生成 CSS 文件
    css: boolean;
    // 是否生成类型声明文件
    dts: boolean;
    // 自定义 vite 配置
    viteConfig?: ViteConfig;
  };
  
  // 文档配置
  docs?: {
    // 是否生成文档
    enable: boolean;
    // 文档配置选项
    options?: object;
  };
}
```

## 开发指南

### 1. 创建新组件

```bash
material create my-component
```

这将创建一个基础的组件模板。

### 2. 开发模式

```bash
material dev my-component
```

启动开发服务器，支持热更新。

### 3. 构建组件

```bash
material build my-component
```

### 4. 生成文档

```bash
material docs my-component
```

## 最佳实践

1. 使用 TypeScript 编写组件
2. 遵循组件目录结构规范
3. 编写完整的组件文档
4. 添加单元测试
5. 使用 CSS 预处理器（如 SCSS）管理样式

## 常见问题

1. **构建失败**
   - 检查依赖版本兼容性
   - 确保配置文件格式正确
   - 查看详细错误日志

2. **类型声明问题**
   - 确保 TypeScript 配置正确
   - 检查类型导出是否完整

3. **样式问题**
   - 检查 CSS 预处理器配置
   - 确保样式文件正确导入

## 贡献指南

欢迎提交 Issue 和 Pull Request。在提交之前，请：

1. 确保代码通过测试
2. 遵循代码风格规范
3. 更新相关文档
4. 添加必要的测试用例

## 许可证

MIT 