/// <reference types="vitest" />
// Configure Vitest (https://vitest.dev/config/)

import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				'ts-rest': resolve(__dirname, 'src/ts-rest/index.ts'),
			},
		},
	},
	plugins: [dts()],
	test: {
		// ...
	},
})
