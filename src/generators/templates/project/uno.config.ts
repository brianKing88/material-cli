import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
    presetIcons()
  ],
  // 使用新的配置选项
  shortcuts: {},
  rules: [
    // 可以在这里添加自定义规则
  ],
  theme: {
    colors: {
      // 可以在这里添加自定义颜色
    }
  }
}) 