import type { UserConfig as ViteConfig } from 'vite'

export interface BuildOptions {
  watch?: boolean
}

export interface MaterialConfig {
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
  title?: string
  category?: string
  status?: string
  install?: {
    css?: boolean
    scss?: boolean
  }
} 