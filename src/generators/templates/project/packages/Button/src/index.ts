import Button from './Button.vue';
import { withInstall } from '../../../src/utils';

export const VButton = withInstall(Button);
export default VButton;
export * from './types'

// Type declaration
declare module 'vue' {
  export interface GlobalComponents {
    VButton: typeof VButton
  }
} 