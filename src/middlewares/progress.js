let WebpackBar = require('webpackbar');

module.exports = function (settings = {}) {
	return function (neutrino) {
		let name = settings.name || process.title
		neutrino.config
			.plugin('progress')
				.use(WebpackBar, [{
					name: name,
					color: 'green',
					profile: false

					// fancy: true // true when not in CI or testing mode
					// basic: true // true when running in minimal environments.
				}])
				.end()
	}
}