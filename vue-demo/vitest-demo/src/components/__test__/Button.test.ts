import { mount } from '@vue/test-utils'
import { expect } from 'vitest'
import Button from '../Button.vue'

it('test mount', async () => {
  const wrapper = mount(Button)
  expect(wrapper.text()).toContain('0')
  await wrapper.trigger('click')
  await wrapper.trigger('click')
  expect(wrapper.text()).toContain('2')
})
