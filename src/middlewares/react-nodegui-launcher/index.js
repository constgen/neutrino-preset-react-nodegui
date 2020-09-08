let path = require('path')

module.exports = function () {
	return function (neutrino) {
		let launcherPath           = path.resolve(__dirname, './launcher/launcher.js')
		let projectNodeModulesPath = path.resolve(process.cwd(), 'node_modules')
		let developmentMode        = neutrino.config.get('mode') === 'development'

		neutrino.config
			.when(developmentMode, function (config) {
				config
					.watch(true)
					.resolve
						.alias
							.set('webpack/hot/log', require.resolve('webpack/hot/log'))
							.end()
						.end()
					.plugin('hot')
						.use(require.resolve('webpack/lib/HotModuleReplacementPlugin'))
						.end()
			})
			.resolve
				.alias
					.set('react', path.resolve(path.join(projectNodeModulesPath, 'react')))
					.set('@nodegui/react-nodegui', path.resolve(path.join(projectNodeModulesPath, '@nodegui/react-nodegui')))
					.end()
				.end()

		Object.keys(neutrino.options.mains).forEach(function (key) {
			neutrino.config
				.entry(key)
					.clear()
					.add(launcherPath)
					.when(developmentMode, function (entry) {
						entry.add(`${require.resolve('webpack/hot/poll')}?1000`)
					})
					.end()
				.resolve
					.alias
						.set('__entry__', path.resolve(__dirname, neutrino.options.mains[key].entry))
						.end()
					.end()
		})
	}
}