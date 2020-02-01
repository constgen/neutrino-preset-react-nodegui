module.exports = function () {
	return function (neutrino) {
		let prodMode = (process.env.NODE_ENV === 'production');
		let outputhPath = prodMode ?  'images' : undefined
		let name = prodMode ?  '[name].[hash:8].[ext]' : '[path][name].[ext]'

		neutrino.config
			.module
				.rule('image')
					.test(/\.(png|jpe?g|gif|bmp)$/i)
					.use('file')
						.loader(require.resolve('file-loader'))
						.options({ outputhPath, name})
						.end()
					.end()
				.end()
	}
}