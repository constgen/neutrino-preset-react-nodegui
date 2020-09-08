let path = require('path')

let WebpackShellPluginNext = require('webpack-shell-plugin-next')

module.exports = function (settings = {}) {
	return function (neutrino) {
		let name             = settings.name || process.title
		let productionMode   = neutrino.config.get('mode') === 'production'
		let nodeModulesPath  = path.resolve(__dirname, '../../node_modules')
		let outputPath       = path.relative(neutrino.options.root, neutrino.options.output)
		let nodeGuiPackerBin = path.resolve(nodeModulesPath, '.bin/nodegui-packer')
		let initPacking      = `${nodeGuiPackerBin} --init "${name}"`
		let performPacking   = `${nodeGuiPackerBin} --pack ${outputPath}`

		neutrino.config
			.when(productionMode, function (config) {
				config
					.plugin('pack')
					.use(WebpackShellPluginNext, [{
						onBuildEnd: {
							scripts : [initPacking, performPacking],
							blocking: true,
							parallel: false
						},
						logging     : false,
						swallowError: true,
						dev         : false,
						safe        : false
					}])
					.end()
			})
	}
}