let banner = require('@neutrinojs/banner')

module.exports = function ({ title }) {
	return function (neutrino) {
		let name = title || neutrino.options.packageJson.name

		process.title = name
		neutrino.use(banner({
			pluginId: 'process-title',
			banner  : `process.title = "${name}"`
		}))
		neutrino.config.name(name)
	}
}