module.exports = function () {
	return function (neutrino) {
		neutrino.config
			.module
				.rule('stylesheet')
					.test(/\.css$/i)
					.use('raw')
						.loader(require.resolve('raw-loader'))
						.end()
					.use('extract')
						.loader(require.resolve('extract-loader'))
						.end()
					.use('css')
						.loader(require.resolve('css-loader'))
						.options({
							import   : true,
							modules  : false,
							sourceMap: false
						})
						.end()
					.end()
				.end()
	}
}