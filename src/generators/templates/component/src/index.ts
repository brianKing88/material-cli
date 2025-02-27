import { withInstall } from '../../../src/utils'
import _<%= ComponentName %> from './<%= ComponentName %>.vue'

export const <%= ComponentName %> = withInstall(_<%= ComponentName %>)
export default <%= ComponentName %>

export * from './types'

// 声明文件
declare module 'vue' {
  export interface GlobalComponents {
    <%= ComponentName %>: typeof <%= ComponentName %>
  }
} 