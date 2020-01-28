module.exports = function () {
	return function (neutrino) {
		let devMode = (process.env.NODE_ENV === 'development');

		neutrino.config
			.module
				.rule('images')
					.test(/\.(png|jpe?g|gif|svg|bmp)$/i)
					.use('file')
						.loader(require.resolve('file-loader'))
						.options(devMode ? {
							name: '[path][name].[ext]'
						} : {
							outputPath: 'images',
							name: '[contenthash].[ext]'
						})
						.end()
					.end()
				.end()
	}
}