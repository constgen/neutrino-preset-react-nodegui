module.exports = function () {
	return function (neutrino) {
		let devMode = (process.env.NODE_ENV === 'development')

		neutrino.config
			.when(devMode, function (config) {
				config
					.watch(true)
					.plugin('hot')
						.use(require.resolve('webpack/lib/HotModuleReplacementPlugin'))
						.end()
			})
	}
}