import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import <%= ComponentName %> from '../src/<%= ComponentName %>.vue'

describe('<%= ComponentName %>', () => {
  it('renders properly', () => {
    const wrapper = mount(<%= ComponentName %>, {
      props: {
        // Add your test props here
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct default props', () => {
    const wrapper = mount(<%= ComponentName %>)
    expect(wrapper.props('disabled')).toBe(false)
  })

  it('handles click events', async () => {
    const wrapper = mount(<%= ComponentName %>)
    await wrapper.find('button').trigger('click')
    // Add assertions based on your component's behavior
  })

  // Add more tests for your component's functionality
}) 