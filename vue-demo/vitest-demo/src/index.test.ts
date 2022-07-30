import { test, expect } from 'vitest'
import { sum } from './index'

test('should', () => {
  expect(true).toBe(true)
})

test('sum', () => {
  expect(sum(1, 2)).toBe(3)
})
