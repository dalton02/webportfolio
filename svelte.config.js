import adapter from '@sveltejs/adapter-static';

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter: adapter(),
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: "404.html",
			precompress: false,
			strict: true

		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		},
		prerender: {
			entries: ['*']
		},
		alias: {
			$components: resolve('src/components'),
			$lib: resolve('src/lib'),
			$static: resolve('static'),
		},
	},
	preprocess: vitePreprocess({script:false}),
};

export default config;
