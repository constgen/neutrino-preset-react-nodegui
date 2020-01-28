let devMode = (process.env.NODE_ENV === 'development');
let compileLoader = require('@neutrinojs/compile-loader');
let babelMerge = require('babel-merge');
let deepmerge = require('deepmerge');

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		let defaultSettings = {
			babel: {}, 
			targets: { node: process.versions.node }
		}
		let settings = deepmerge(defaultSettings, customSettings);
		let coreJsVersion = neutrino.getDependencyVersion('core-js');

		neutrino.use(
			compileLoader({
				test: /\.(j|t)sx?$/,
				include: [neutrino.options.source, neutrino.options.tests],
				babel: babelMerge(
					{
						plugins: [require.resolve('@babel/plugin-syntax-dynamic-import')],
						presets: [
							[
								require.resolve('@babel/preset-env'),
								{
									debug: neutrino.options.debug,
									targets: settings.targets,
									useBuiltIns: coreJsVersion ? 'usage' : false,
									...(coreJsVersion && { corejs: coreJsVersion.major }),
								}
							],
							require.resolve('@babel/preset-typescript'),
							require.resolve('@babel/preset-react')
						],
						cacheDirectory: true, 
						cacheCompression: false
					},
					settings.babel
				)
			})
		);
	}
}