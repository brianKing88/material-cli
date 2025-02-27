import { ref, Ref } from 'vue-demi'

/**
 * A hook that provides toggle functionality
 * 
 * @param initialValue - The initial state value
 * @returns An array containing the current state and functions to manipulate it
 * 
 * @example
 * ```ts
 * const [value, toggle, setValue] = useToggle(false)
 * ```
 */
export function useToggle(initialValue = false): [Ref<boolean>, () => void, (value: boolean) => void] {
  const state = ref(initialValue)

  function toggle() {
    state.value = !state.value
  }

  function setValue(value: boolean) {
    state.value = value
  }

  return [state, toggle, setValue]
} 