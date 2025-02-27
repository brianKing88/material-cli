import type { App, Plugin } from 'vue-demi'

export type SFCWithInstall<T> = T & Plugin

export const withInstall = <T>(comp: T) => {
  const c = comp as SFCWithInstall<T>

  c.install = function(app: App) {
    const { name } = c as unknown as { name: string }
    app.component(name, c)
  }

  return c
} 