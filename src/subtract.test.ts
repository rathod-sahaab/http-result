import { test, expect } from 'vitest'
import { subtract } from './subtract'

test('sums two numbers', () => {
	expect(subtract(4, 7)).toBe(-3)
})
