let path = require('path')
var childProcess = require("child_process");
var { qodePath } = require("@nodegui/qode/index");
let WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = function () {
	return function (neutrino) {
		let devMode = (process.env.NODE_ENV === 'development');
		let otputFileName = Object.keys(neutrino.options.mains).find(Boolean)
		let outputMainPath = path.resolve(neutrino.options.output, otputFileName)

		function startNodeGui(){
			var child = childProcess.spawn(qodePath, `--inspect ${outputMainPath}`.split(' '), {
			  stdio: "inherit",
			  windowsHide: false
			});
			child.on("close", function(code) {
			  process.exit(code);
			});
			
			["SIGINT", "SIGTERM"].forEach(function(signal) {
			  process.on(signal, function () {
				 if (!child.killed) {
					child.kill(signal);
				 }
			  })
			}) 
		 }

		neutrino.config
			.when(devMode, function (config) {
				config
					.plugin('start')
					.use(WebpackShellPluginNext, [{
						onBuildEnd: {
							scripts: [startNodeGui],
							blocking: false,
							parallel: true
						},
						logging: false,
						swallowError: true,
						dev: true,
						safe: true
					}])
					.end()
			})
	}
}