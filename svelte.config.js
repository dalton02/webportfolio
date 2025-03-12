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
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		},
		prerender:{
			handleHttpError:"warn",
			
		},
		alias: {
			$components: resolve('src/components'),
			$lib: resolve('src/lib'),
		},
	},
};

export default config;
