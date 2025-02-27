import { computed, getCurrentInstance, ComputedRef } from 'vue-demi'

/**
 * A hook that creates a two-way binding with a parent component v-model
 * 
 * @param props - Component props object
 * @param propName - The prop name to bind with, default is 'modelValue'
 * @returns A computed ref that syncs with the parent v-model
 * 
 * @example
 * ```ts
 * // In a component with v-model or v-model:title
 * const title = useVModel(props, 'title')
 * ```
 */
export function useVModel<P extends object, K extends keyof P>(
  props: P,
  propName: K = 'modelValue' as unknown as K
): ComputedRef<P[K]> {
  const vm = getCurrentInstance()
  
  return computed({
    get() {
      return props[propName]
    },
    set(value) {
      const eventName = `update:${propName.toString()}`
      vm?.emit(eventName, value)
    }
  })
} 