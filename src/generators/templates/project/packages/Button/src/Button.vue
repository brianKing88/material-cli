<template>
  <button
    class="v-button"
    :class="[
      type ? `v-button--${type}` : '',
      size ? `v-button--${size}` : '',
      {
        'is-round': round,
        'is-disabled': disabled,
      },
      customClass
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import type { ButtonProps } from './types'
import './index.less'

export default defineComponent({
  name: 'VButton',
  props: {
    type: {
      type: String,
      default: undefined
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large', 'mini'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
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
  emits: ['click'],
  setup(props: ButtonProps, { emit }) {
    const handleClick = (event: MouseEvent) => {
      if (props.disabled) return;
      props.onClick?.(event);
      emit('click', event);
    }

    return {
      handleClick
    }
  }
})
</script>

<!-- 组件特有的样式可以在这里添加，基础样式在index.less中 -->
<style lang="less" scoped></style>
