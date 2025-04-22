import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: '/CAFY_prototype/',
	optimizeDeps: {
		include: ['reactflow'],
	},
	server: {
		force: true,
	},
});
