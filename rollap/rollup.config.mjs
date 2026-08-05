import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import styles from 'rollup-plugin-styles'

export default {
	input: './index.js',
	output: {
		file: './dist/bundle.js',
		format: 'cjs',
	},
	plugins: [resolve(), babel({ babelHelpers: 'bundled' }), styles()],
}
