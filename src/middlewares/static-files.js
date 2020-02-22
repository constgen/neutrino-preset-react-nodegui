let path = require('path')

let copy = require('@neutrinojs/copy')

module.exports = function () {
	return function (neutrino) {
		let staticDir = path.join(neutrino.options.source, 'static')

		neutrino.use(copy({
			patterns: [{
			  context: staticDir,
			  from: '**/*',
			  to: path.basename(staticDir)
			}]
		 }))
	}
}