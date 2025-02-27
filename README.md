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
material add MyComponent

# 添加多个组件
material add Component1 Component2 Component3
```

这将创建一个包含以下完整结构的组件：

```
packages/MyComponent/
├── src/
│   ├── MyComponent.vue    # 组件主文件
│   ├── index.ts           # 组件入口
│   ├── types.ts           # TypeScript 类型定义
│   └── index.less         # 组件样式文件
├── demo/
│   └── basic.vue          # 基础示例
├── __tests__/             # 测试目录
│   └── MyComponent.test.ts # 测试文件
├── package.json           # 组件配置
├── material.config.ts     # 组件构建配置
├── README.md              # 组件文档
└── CHANGELOG.md           # 更新日志
```

#### 组件文件说明

- **MyComponent.vue**: 组件主体实现，包含逻辑和模板
  - 组件使用 Vue Composition API 开发，支持 Vue 2 和 Vue 3
  - 包含标准化的 props 定义和事件处理
  - 支持自定义类名、尺寸和禁用状态等标准属性

- **index.less**: 组件样式文件
  - 使用 Less 预处理器编写
  - 支持不同尺寸、状态和主题变量
  - 样式与组件逻辑分离，方便维护和定制

- **types.ts**: 类型定义文件
  - 包含完整的组件 Props 接口定义
  - 提供详细的属性注释和默认值说明
  - 定义组件实例类型，便于类型推导

- **demo/basic.vue**: 基础示例
  - 展示组件各种配置方式和用法
  - 包含详细的使用说明注释
  - 演示不同尺寸、状态和自定义样式

创建的组件支持以下特性：

- **TypeScript 支持**: 完整的类型定义和类型检查
- **CSS/Less/Sass 支持**: 预处理器样式文件
- **双版本构建**: 同时支持 Vue 2 和 Vue 3
- **按需加载**: 支持按需导入，减小打包体积
- **单元测试**: 预配置的测试环境和测试示例
- **标准化结构**: 符合最佳实践的目录结构
- **文档示例**: 附带使用示例和文档

#### 组件属性标准化

新创建的组件默认支持以下标准属性：

- **size**: 控制组件大小（'small' | 'medium' | 'large'）
- **disabled**: 禁用状态
- **customClass**: 自定义额外类名，便于样式定制
- **onClick**: 点击事件处理函数（针对可交互组件）

#### 使用自定义模板

如果需要使用自定义模板创建组件，可以设置 `templates` 目录：

```bash
# 使用自定义模板
material add MyComponent --template my-template
```

### 3. 开发模式

```bash
# 启动开发服务器（交互式选择组件）
material dev

# 指定组件开发（两种等效方式）
material dev button
material dev --component button

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

# 同步开发（多 Vue 版本）
material dev --sync
material dev button --sync
material dev --sync --vue-versions 2,3
```

开发服务器提供以下功能：

- **交互式组件选择**：如果不指定组件，会提供交互式界面选择要开发的组件
- **历史记录**：记住最近开发的组件，可以使用 `--last` 快速恢复上次的开发环境
- **多 Vue 版本支持**：可以指定 Vue 2、Vue 2.7 或 Vue 3 版本进行开发
- **同步开发**：使用 `--sync` 选项可同时启动多个 Vue 版本的开发服务器，便于比对不同版本中组件的表现
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

## 组件模板开发

Material CLI 提供了标准化的组件模板，可以通过 `material add` 命令创建新组件。如果你需要自定义组件模板或扩展现有模板，可以按照以下步骤操作：

### 组件模板目录结构

标准组件模板位于 Material CLI 源码的 `src/generators/templates/component` 目录下，包含以下结构：

```
templates/component/
├── src/
│   ├── component.vue    # 组件模板文件
│   ├── index.ts         # 入口模板
│   ├── types.ts         # 类型定义模板
│   └── index.less       # 样式模板
├── demo/                # 示例目录
├── __tests__/           # 测试目录
├── package.json         # 包配置
└── ...
```

### 自定义组件模板

1. **克隆标准模板**：
   - 复制 `src/generators/templates/component` 目录到你的项目中
   - 或从 Material CLI 源码库克隆模板文件

2. **修改模板文件**：
   - 模板文件使用 [EJS](https://ejs.co/) 语法
   - 模板变量如 `<%= componentName %>` 会在生成时被替换
   - 可用的模板变量包括：
     - `componentName`: 组件名称（输入的原始名称）
     - `ComponentName`: 首字母大写的组件名称
     - `kebabCaseName`: kebab-case 形式的组件名称
     - `packageName`: 包名（从项目配置中获取）

3. **注册自定义模板**：
   - 在项目根目录创建 `.material/templates` 目录
   - 将修改后的模板放入对应目录中

4. **使用自定义模板**：
   ```bash
   material add NewComponent --template custom-template
   ```

### 模板变量和占位符

在模板文件中，可以使用以下语法：

- `<%= componentName %>` - 直接输出变量值
- `<% if (condition) { %>` - 条件语句
- `<% for (var i=0; i<items.length; i++) { %>` - 循环语句

### 扩展现有模板

如果你只想对现有模板做小的修改，可以只替换特定文件：

1. 创建 `.material/templates/component/src/component.vue` 文件
2. Material CLI 会优先使用你的自定义文件，其他文件则使用默认模板

这样可以在保留大部分默认模板的同时，只自定义特定部分。

## 最佳实践

1. **通用组件开发规范**
   - 使用 TypeScript 编写组件
   - 为每个组件编写测试用例
   - 添加完整的组件文档
   - 使用语义化版本号
   
2. **组件结构规范**
   - 样式文件使用外部 Less 文件（index.less）
   - 组件逻辑与样式分离
   - 类型定义集中在 types.ts 文件中
   - demo 文件展示组件的各种用法
   
3. **组件属性设计**
   - 提供标准的 size、disabled 等通用属性
   - 自定义类名应使用 customClass 属性
   - 点击事件处理通过 onClick 属性或事件触发
   - 提供详细的属性注释和默认值
   
4. **开发流程优化**
   - 使用 playground 模式测试组件间交互
   - 使用 `--last` 选项快速恢复开发环境
   - 修改组件模板后先在本地测试
   - 使用 `material add` 创建标准化组件
   - 使用 `--sync` 选项同时测试组件在多个 Vue 版本中的表现
   - 组件开发中使用外部样式文件提高可维护性

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
   - 使用外部 index.less 文件而不是内联样式
4. **开发环境问题**
   - 检查 Vue 版本兼容性
   - 确保组件正确链接到 playground
   - 尝试删除 node_modules 并重新安装依赖
5. **组件模板问题**
   - 确保组件名称符合 PascalCase 命名规范
   - 检查 types.ts 中的类型定义与组件 props 一致
   - 确认 index.less 文件已正确引入到组件中
   - 如果修改了组件模板，记得重新构建 material-cli

## 许可证

MIT
