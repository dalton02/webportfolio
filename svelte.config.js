import adapter from '@sveltejs/adapter-static';
import { resolve } from 'path';

const dev =  process.argv.includes('dev')
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.env.BASE_PATH ?? ""
		},
		alias: {
			$components: resolve('src/components'),
			$lib: resolve('src/lib'),
			$static: resolve('static'),
		},
	},
};

export default config;
