let banner = require('@neutrinojs/banner')

module.exports = function ({ prod = false, dev = true } = {}) {
	return function (neutrino) {
		let devMode = (process.env.NODE_ENV === 'development')
		let productionSourcemaps = prod ? 'source-map' : 'none'
		let developmentSourcemaps = dev ? 'source-map' : 'none'

		neutrino.config
			.devtool(productionSourcemaps)
			.when(devMode, function (config) {
				neutrino.use(banner({ pluginId: 'sourcemaps' }))
				config
					.devtool(developmentSourcemaps)
					.output
						.devtoolModuleFilenameTemplate('[absolute-resource-path]')
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
						.end()
			})
	}
}