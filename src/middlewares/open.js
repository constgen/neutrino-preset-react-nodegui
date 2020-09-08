let path = require('path')

let spawn                  = require('cross-spawn')
let WebpackShellPluginNext = require('webpack-shell-plugin-next')

module.exports = function () {
	return function (neutrino) {
		let developmentMode = neutrino.config.get('mode') === 'development'

		function startNodeGui () {
			let otputFileName  = Object.keys(neutrino.options.mains).find(Boolean)
			let outputMainPath = path.resolve(neutrino.options.output, otputFileName)
			let child          = spawn('node_modules/.bin/qode', ['--inspect', outputMainPath], {
				cwd        : process.cwd(),
				stdio      : 'inherit',
				windowsHide: false
			}, function (error) {
				if (error) {
					console.error(error)
				}
			})

			child.on('close', function (code) {
				process.exit(code) // eslint-disable-line node/no-process-exit
			});

			['SIGINT', 'SIGTERM'].forEach(function (signal) {
				process.on(signal, function () {
					if (!child.killed) {
						child.kill(signal)
					}
				})
			})
		}

		neutrino.config
			.when(developmentMode, function (config) {
				config
					.plugin('start')
					.use(WebpackShellPluginNext, [{
						onBuildEnd: {
							scripts : [startNodeGui],
							blocking: false,
							parallel: true
						},
						logging     : false,
						swallowError: true,
						dev         : true,
						safe        : true
					}])
					.end()
			})
	}
}