import { withInstall } from '@martirel-ui/utils'
import <%= ComponentName %> from './<%= ComponentName %>.vue'

export const <%= ComponentName %> = withInstall(<%= ComponentName %>)
export default <%= ComponentName %>

export * from './types'

// 声明文件
declare module 'vue' {
  export interface GlobalComponents {
    <%= ComponentName %>: typeof <%= ComponentName %>
  }
} 