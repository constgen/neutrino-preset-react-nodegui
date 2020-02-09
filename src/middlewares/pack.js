let path = require('path')
let WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = function (settings = {}) {
	return function (neutrino) {
		let name = settings.name || process.title
		let prodMode = (process.env.NODE_ENV === 'production');
		let outputPath = path.relative(neutrino.options.root, neutrino.options.output)
		let nodeGuiPackerBin = path.resolve(require.resolve('@nodegui/packer'), '../../../../.bin/nodegui-packer');
		let initPacking = `${nodeGuiPackerBin} --init "${name}"`
		let performPacking = `${nodeGuiPackerBin} --pack ${outputPath}`

		neutrino.config
			.when(prodMode, function (config) {
				config
					.plugin('pack')
					.use(WebpackShellPluginNext, [{
						onBuildEnd: {
							scripts: [initPacking, performPacking],
							blocking: true,
							parallel: false
						},
						logging: false,
						swallowError: true,
						dev: false,
						safe: false
					}])
					.end()
			})
	}
}