import adapter from '@sveltejs/adapter-static';

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter: adapter(),
		adapter: adapter({
			fallback: "404.html",
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/webportfolio' : '',
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
