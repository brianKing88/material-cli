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
}) 