import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
  ],
  // 使用新的配置选项
  shortcuts: {},
  rules: [],
  theme: {
    colors: {}
  }
}) 