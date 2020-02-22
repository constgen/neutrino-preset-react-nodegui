module.exports = function () {
	return function (neutrino) {
		let devMode = (process.env.NODE_ENV === 'development')

		neutrino.config
			.when(devMode, function (config) {
				config
					.plugin('ts-checker')
						.use(require.resolve('fork-ts-checker-webpack-plugin'))
						.end()
			})
	}
}