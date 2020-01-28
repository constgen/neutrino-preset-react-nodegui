let banner = require('@neutrinojs/banner'); 

module.exports = function () {
	return function (neutrino) {
		let devMode = (process.env.NODE_ENV === 'development');
		
		neutrino.config
			// .devtool('source-map')
			.when(devMode, function (config) {
				neutrino.use(banner({ pluginId: 'sourcemaps' }));
				config
					//  .devtool('inline-sourcemap')
					.devtool('source-map')
					.output
						.devtoolModuleFilenameTemplate('[absolute-resource-path]')
						.end()
					.plugin('hot')
						.use(require.resolve('webpack/lib/HotModuleReplacementPlugin'))
						.end()
					.module
						.rule('source-map')
							.test(/\.js$/i)
							.pre()
							.include
								.add(/node_modules/)
								.end()
							.use('smart-source-map')
								.loader(require.resolve('smart-source-map-loader'))
								.end()
							.end()
						.rule('compile')
							.use('babel')
								.tap(function (options) {
									options.plugins.push(
										require.resolve('@babel/plugin-transform-react-jsx-source')
									);
		
									return options;
								})
								.end()
							.end()
						.end()
			})
	}
}