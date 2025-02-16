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
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  name: 'VButton',
  props: {
    type: {
      type: String,
      default: undefined
    },
    size: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (event) => {
      console.log('handleClick');
      console.log('log');
      if (!props.disabled) {
        emit('click', event)
      }
    }

    return {
      handleClick
    }
  }
})
</script>

<!-- <style src="./Button.scss"></style> 这种写法 gulp + rollup 打包会报错，vite 打包不会，所以采用以下都兼容的写法：-->
<style lang="less">
.v-button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  color: #606266;
  text-align: center;
  white-space: nowrap;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  transition: .1s;
  cursor: pointer;
  user-select: none;
  -webkit-appearance: none;

  &:hover,
  &:focus {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }

  &:active {
    color: #3a8ee6;
    border-color: #3a8ee6;
    outline: none;
  }

  &.is-round {
    border-radius: 20px;
  }

  &.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;

    &:hover,
    &:focus,
    &:active {
      color: #c0c4cc;
      background-color: #fff;
      border-color: #ebeef5;
    }
  }

  // 类型样式
  &--primary {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;

    &:hover,
    &:focus {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }

    &:active {
      background: #3a8ee6;
      border-color: #3a8ee6;
      color: #fff;
    }
  }

  // 尺寸
  &--medium {
    height: 36px;
    padding: 10px 20px;
    font-size: 14px;
  }

  &--small {
    height: 28px;
    padding: 6px 12px;
    font-size: 12px;
  }

  &--mini {
    height: 24px;
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>
