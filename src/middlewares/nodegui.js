module.exports = function () {
	return function (neutrino) {
		neutrino.config
			.target('node')
			.node
				.set('__filename', true)
				.set('__dirname', false)
				.end()
			.context(neutrino.options.root)
			.output
				.path(neutrino.options.output)
				.libraryTarget('commonjs2')
				.filename('index.js')
				.end()
			.resolve
				.extensions
					.merge(['.wasm'])
					.merge([...neutrino.options.extensions.map(extension => `.${extension}`)])
					.merge(['.js', '.json'])
					.end()
				.end()
	}
}