import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../src/Button.vue'

describe('Button', () => {
  it('renders properly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Button Text'
      }
    })
    expect(wrapper.text()).toBe('Button Text')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('applies type class', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary'
      }
    })
    expect(wrapper.classes()).toContain('v-button--primary')
  })

  it('disables button', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
}) 