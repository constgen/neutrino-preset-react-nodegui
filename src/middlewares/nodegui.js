let path = require('path')

module.exports = function () {
	return function (neutrino) {
		// let nodeModulesPath = path.resolve(__dirname, '../node_modules')
		// let projectNodeModulesPath = path.resolve(process.cwd(), 'node_modules')

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
			// .resolveLoader
			// 	.modules
			// 		.add('node_modules')
			// 		.add(nodeModulesPath)
			// 		.add(projectNodeModulesPath)
			// 		.end()
			// 	.end()
			.resolve
				// .modules
				// 	.add(nodeModulesPath)
				// 	.add(projectNodeModulesPath)
				// 	.end()
				.extensions
					.merge(['.wasm'])
					.merge([...neutrino.options.extensions.map(ext => `.${ext}`)])
					.merge(['.js', '.json'])
					.end()
				.end()
	}
}