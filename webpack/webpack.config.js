const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

// './src/index.js'
module.exports = {
	mod: 'development',
	entry: path.resolve(__dirname, 'src', 'index.js'),
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'index.html')
		}),
	]
}
