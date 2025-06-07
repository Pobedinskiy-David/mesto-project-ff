const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const dotenv = require('dotenv');

module.exports = (env = {}, argv = {}) => {
	const isProd = argv.mode === 'production';
	const isDev = !isProd;

	const envFile = `.env.${isProd ? 'prod' : 'dev'}`;
	const envParsed = dotenv.config({ path: envFile }).parsed || {};
	const envKeys = Object.fromEntries(Object.entries(envParsed).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]));

	return {
		target: 'browserslist',
		mode: isProd ? 'production' : 'development',
		entry: { main: path.resolve(__dirname, 'src/index.js') },

		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
			assetModuleFilename: 'assets/[hash][ext][query]',
			publicPath: '/',
			clean: true,
		},

		devtool: isDev ? 'inline-source-map' : 'source-map',
		devServer: {
			static: {
				directory: path.resolve(__dirname, 'dist'),
				watch: true,
			},

			host: '0.0.0.0',
			port: 8080,
			compress: true,
			hot: true,
			historyApiFallback: true,
			allowedHosts: 'all',
		},

		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: { cacheDirectory: true },
					},
				},

				{
					test: /\.css$/i,
					use: [
						isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
								sourceMap: isDev,
							},
						},
						{
							loader: 'postcss-loader',
							options: { sourceMap: isDev },
						},
					],
				},

				{
					test: /\.(png|jpe?g|gif|svg|webp)$/i,
					type: 'asset',
					parser: {
						dataUrlCondition: { maxSize: 10 * 1024 },
					},
				},

				{
					test: /\.(woff2?|eot|ttf|otf)$/i,
					type: 'asset/resource',
					generator: { filename: 'fonts/[name].[contenthash:8][ext]' },
				},
			],
		},

		plugins: [
			new webpack.DefinePlugin(envKeys),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, 'src/index.html'),
				inject: 'body',
				minify: isProd && {
					collapseWhitespace: true,
					removeComments: true,
					removeRedundantAttributes: true,
				},
			}),
			new MiniCssExtractPlugin({
				filename: isProd ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
			}),
			new webpack.ProgressPlugin(),
		],

		optimization: {
			minimize: isProd,
			minimizer: [new TerserPlugin({ parallel: true }), new CssMinimizerPlugin()],
			runtimeChunk: 'single',
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			},
		},

		resolve: {
			extensions: ['.js', '.json'],
			alias: { '@': path.resolve(__dirname, 'src') },
		},

		cache: { type: 'filesystem' },
		stats: 'errors-warnings',
		performance: {
			hints: isProd ? 'warning' : false,
		},
	};
};
