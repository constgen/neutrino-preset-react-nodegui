let image = require('@constgen/neutrino-image-loader')

module.exports = function () {
	return function (neutrino) {
		const SVG_EXTENSIONS        = /\.svg$/i
		const { IMAGE_EXTENSIONS }  = image
		let productionMode          = neutrino.config.get('mode') === 'production'
		let postTransformPublicPath = productionMode ? function (path) {
			return `require("path").relative(process.cwd(), __dirname) + "/" + ${path}`
		} : undefined

		neutrino.use(image({ limit: false }))

		neutrino.config
			.module
				.rule('image')
					.test([IMAGE_EXTENSIONS, SVG_EXTENSIONS])
					.use('url')
						.tap(options => ({
							...options,
							postTransformPublicPath
						}))
						.end()
					.end()
				.end()
	}
}