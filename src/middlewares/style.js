module.exports = function () {
	return function (neutrino) {
		neutrino.config
			.module
				.rule('style')
					.test(/\.css$/i)
					.use('to-string')
						.loader(require.resolve('css-to-string-loader'))
						.end()
					.use('css')
						.loader(require.resolve('css-loader'))
						.options({
							import: true,
							modules: false,
							sourceMap: false
						})
						.end()
					.end()
				.end()
	}
}