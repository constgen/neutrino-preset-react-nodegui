module.exports = function () {
	return function (neutrino) {
		neutrino.config
			.module
				.rule('node')
					.test(/\.node$/i)
					.use('native-addon')
						.loader(require.resolve('native-addon-loader'))
						.options({
							name: '[name]-[hash].[ext]'
						})
						.end()
					.end()
				.end()
	}
}