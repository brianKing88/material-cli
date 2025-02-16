// import { defineConfig } from 'material-cli'
export default {
  // 基础信息
  name: 'Button',
  title: '按钮',
  description: '按钮组件',
  category: '基础组件', // 组件标签
  status: 'stable', // 组件状态
  id: 'button', // 唯一id
  componentName: 'Button', // 组件名称
  docUrl: 'https://vue-demi.gitee.io/vue-demi/zh/components/Button.html', // 组件文档链接
  screenshot: 'https://vue-demi.gitee.io/vue-demi/zh/components/Button.html',
  icon: 'https://vue-demi.gitee.io/vue-demi/zh/components/Button.html',
  group: '基础组件',
  priority: 1,
  keywords: ['按钮', 'button'],
  version: '1.0.0',
  package: 'button',

  // 构建配置
  build: {
    // // 目标环境
    // target: ['es2015'],
    // // 输出格式
    formats: ['es', 'cjs', 'umd'],
    // // 生成 CSS 文件
    css: false,
    // 生成类型声明文件
    dts: true,
    // // 可选：自定义 vite 配置
    // viteConfig: {
    //   // 这里可以添加自定义的 vite 配置
    // }
  },
  // 安装配置
  install: {
    css: true,
    scss: true
  },
  // 文档配置（可选）
  docs: {
    enable: true,
    options: {
      // 文档相关的配置选项
    }
  }
}