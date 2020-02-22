let CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = function () {
	return function (neutrino) {
		neutrino.config
			.plugin('depend')
				.use(CircularDependencyPlugin, [{
					exclude: /node_modules/,
					failOnError: false,
					allowAsyncCycles: true,
					cwd: process.cwd()
				}])
				.end()
	}
}