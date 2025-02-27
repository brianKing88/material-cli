<template>
  <div 
    class="<%= kebabCaseName %>" 
    :class="[
      `<%= kebabCaseName %>--${size}`, 
      { 'is-disabled': disabled },
      customClass
    ]"
    @click="handleClick"
  >
    <h1>Hello World</h1>
    <button @click="handleButtonClick">Click me</button>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import type { <%= ComponentName %>Props } from './types'
import './index.less'

export default defineComponent({
  name: '<%= ComponentName %>',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    customClass: {
      type: String,
      default: ''
    },
    onClick: {
      type: Function,
      default: null
    }
  } as const,
  setup(props: <%= ComponentName %>Props) {
    const handleClick = (event: MouseEvent) => {
      if (props.disabled) return;
      props.onClick?.(event);
    };
    
    const handleButtonClick = (event: MouseEvent) => {
      event.stopPropagation();
      console.log('Button clicked!');
    };
    
    return {
      handleClick,
      handleButtonClick
    }
  }
})
</script>

<!-- 组件特有的样式可以在这里添加，基础样式在index.less中 -->
<style lang="less" scoped></style> 