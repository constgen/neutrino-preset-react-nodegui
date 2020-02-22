module.exports = function () {
	return function ({ config }) {
		let svgUrlLoader = require.resolve('svg-url-loader')
		let prodMode = (process.env.NODE_ENV === 'production')
		let outputhPath = prodMode ? 'images' : undefined
		let name = prodMode ? '[name].[hash:8].[ext]' : '[path][name].[ext]'

		config.module
			.rules.delete('svg')
			.end()
			.rule('svg')
				.test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
				.oneOf('style')
					.set('issuer', /\.(css|less|sass|scss)$/)
					.use('svg-css')
						.loader(svgUrlLoader)
						.options({
							outputhPath,
							name,
							limit: 10000,
							noquotes: false,
							stripdeclarations: true
						})
						.end()
					.end()
				.oneOf('text')
					.use('svg-text')
						.loader(svgUrlLoader)
						.options({ noquotes: true })
						.end()
					.end()
				.end()
	}
}