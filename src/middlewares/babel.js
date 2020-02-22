let compileLoader = require('@neutrinojs/compile-loader')
let babelMerge = require('babel-merge')
let deepmerge = require('deepmerge')
let { shouldPrintComment } = require('babel-plugin-smart-webpack-import')

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		let defaultSettings = {
			babel: {},
			targets: { node: process.versions.node }
		}
		let settings = deepmerge(defaultSettings, customSettings)
		let coreJsVersion = neutrino.getDependencyVersion('core-js')

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
							[require.resolve('babel-plugin-transform-jsx-url'), {
								root: neutrino.options.source,
								attrs: ['img:src', 'link:href', 'Image:src', 'video:src', 'Video:src', 'audio:src', 'Audio:src']
							}],
							require.resolve('babel-plugin-smart-webpack-import')
						],
						presets: [
							[
								require.resolve('@babel/preset-env'),
								{
									debug: neutrino.options.debug,
									targets: settings.targets,
									useBuiltIns: coreJsVersion ? 'usage' : false,
									...(coreJsVersion && { corejs: coreJsVersion.major })
								}
							],
							require.resolve('@babel/preset-typescript'),
							require.resolve('@babel/preset-react')
						],
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