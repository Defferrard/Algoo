/// <reference types="vitest" />
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// TODO : Can we use ENV VARS for proxy ?

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/socket.io': 'http://localhost:8080/',
			'/api/v1': 'http://localhost:8080/'
		}
	}
});
