import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const isAnalyze = env.VITE_ENVIRONMENT === 'analyze';

	return {
		plugins: [
			react(),
			...(isAnalyze
				? [
						visualizer({
							open: true
						})
				  ]
				: [])
		],
		resolve: {
			alias: {
				src: path.resolve('./src')
			}
		},
		optimizeDeps: {
			esbuildOptions: {
				target: 'esnext',
				// Node.js global to browser globalThis
				define: {
					global: 'globalThis'
				},
				plugins: [
					NodeGlobalsPolyfillPlugin({
						buffer: true
					})
				]
			}
		},
		build: {
			target: ['esnext'],
			rollupOptions: {
				output: {
					manualChunks: {
						recoil: ['recoil'],
						'@mui/material': ['@mui/material'],
						'@mysten/sui.js': ['@mysten/sui.js/transactions', '@mysten/sui.js/client'],
						'@wangeditor/editor': ['@wangeditor/editor'],
						swiper: ['swiper'],
						'date-fns': ['date-fns'],
						'engine.io-client': ['engine.io-client'],
						axios: ['axios']
					}
				}
			}
		}
	};
});
