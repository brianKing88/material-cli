<template>
  <div class="<%= kebabCaseName %>">
    <h1>Hello World</h1>
    <button @click="handleClick">Click me</button>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import type { <%= ComponentName %>Props } from './types'

export default defineComponent({
  name: '<%= ComponentName %>',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  } as const,
  setup(props: <%= ComponentName %>Props) {
    const handleClick = () => {
      console.log('handleClick')
    }
    return {
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
.<%= kebabCaseName %> {
  color: green;
  background-color: blue;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

</style> 