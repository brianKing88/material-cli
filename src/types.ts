import type { UserConfig as ViteConfig } from 'vite'

export interface BuildOptions {
  watch?: boolean
}

export interface MaterialConfig {
  id: string
  name: string
  build: {
    target?: string[]
    formats?: ('esm' | 'cjs' | 'umd')[]
    css?: boolean
    dts?: boolean
    viteConfig?: ViteConfig
  }
  docs?: {
    enable?: boolean
    options?: Record<string, any>
  }
  /** 组件标题 */
  title: string
  /** 组件分类 */
  category: string
  /** 组件状态 */
  status?: string
  /** 组件安装 */
  install?: {
    css?: boolean
    scss?: boolean
  }
  /** 组件名称 */
  componentName: string
  /** 组件描述 */
  description?: string
  /** 组件文档链接 */
  docUrl?: string
  /** 组件快照 */
  screenshot?: string
  /** 组件的小图标 */
  icon?: string
  /** 组件组，顶部tab */
  group?: string
  /** 同一 category 下的排序 */
  priority?: number
  /** 组件关键词，用于搜索联想 */
  keywords?: string[]
  /** 源码组件版本号 */
  version?: string
  /** 源码组件库名 */
  package?: string
  /** 用户拖动，会有一个初始的schema片段，避免完全没有内容，可以理解为一个demo */
  snippets?: any
  /** 组件属性配置 */
  props?: Array<{
    /** 属性名称 */
    name: string
    /** 属性描述 */
    description?: string
    /** 设置器的标签 */
    label?: string
    /** 默认值 */
    defaultValue?: any
    /** 属性是否必填 */
    required?: boolean
  }>
  /** 组件事件配置 */
  events?: Array<{
    /** 事件名称 */
    name: string
    /** 事件值 */
    value: any
  }>
} 

export interface ComponentConfig extends Omit<MaterialConfig, 'build'> {
}