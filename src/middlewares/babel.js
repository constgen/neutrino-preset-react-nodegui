let compileLoader = require('@neutrinojs/compile-loader')
let babelMerge = require('babel-merge')
let deepmerge = require('deepmerge')
let { shouldPrintComment } = require('babel-plugin-smart-webpack-import')

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		let devMode = process.env.NODE_ENV === 'development'
		let prodMode = process.env.NODE_ENV === 'production'
		let defaultSettings = {
			babel: {},
			polyfills: false,
			targets: { node: process.versions.node }
		}
		let settings = deepmerge(defaultSettings, customSettings)
		const DEFAULT_COREJS = 3
		let coreJsVersion = neutrino.getDependencyVersion('core-js')
		let corejs = coreJsVersion ? coreJsVersion.major : DEFAULT_COREJS

		neutrino.use(
			compileLoader({
				test: /\.(j|t)sx?$/,
				include: [neutrino.options.source, neutrino.options.tests],
				babel: babelMerge(
					{
						plugins: [
							require.resolve('@babel/plugin-syntax-dynamic-import'),
							[require.resolve('@babel/plugin-proposal-decorators'), {
								decoratorsBeforeExport: true
							}],
							require.resolve('@babel/plugin-proposal-class-properties'),
							[require.resolve('babel-plugin-jsx-pragmatic'), {
								module: 'react',
								export: 'createElement',
								import: 'createElement'
							}],
							[require.resolve('babel-plugin-transform-jsx-url'), {
								root: neutrino.options.source,
								attrs: ['img:src', 'link:href', 'Image:src', 'video:src', 'Video:src', 'audio:src', 'Audio:src']
							}],
							require.resolve('babel-plugin-smart-webpack-import'),
							prodMode && [require.resolve('babel-plugin-transform-react-remove-prop-types'), {
								removeImport: true,
								classNameMatchers: ['Component', 'PureComponent']
							}]
						].filter(Boolean),
						presets: [
							[
								require.resolve('@babel/preset-env'),
								{
									debug: neutrino.options.debug,
									targets: settings.targets,
									spec: false,
									modules: false,
									useBuiltIns: settings.polyfills ? 'usage' : false,
									...(settings.polyfills && { corejs })
								}
							],
							[require.resolve('@babel/preset-typescript'), {
								allowNamespaces: true
							}],
							[require.resolve('@babel/preset-react'), {
								development: devMode,
								pragma: 'createElement',
								useSpread: true,
								useBuiltIns: false
							}]
						].filter(Boolean),
						cacheDirectory: true,
						cacheCompression: false,
						shouldPrintComment
					},
					settings.babel
				)
			})
		)
	}
}