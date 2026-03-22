import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
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
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
