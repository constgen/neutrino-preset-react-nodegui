let deepmerge    = require('deepmerge')
let clean        = require('@neutrinojs/clean')
let progress     = require('@constgen/neutrino-progress')
let dependency   = require('@constgen/neutrino-dependency')
let revision     = require('@constgen/neutrino-revision')
let react        = require('@constgen/neutrino-react-loader')
let sourcemap    = require('@constgen/neutrino-sourcemap')
let optimization = require('@constgen/neutrino-optimization')
let mode         = require('@constgen/neutrino-mode')
let nodeLoader   = require('@constgen/neutrino-node-loader')

let reactNodeguiLauncher = require('./middlewares/react-nodegui-launcher')
let open                 = require('./middlewares/open')
let pack                 = require('./middlewares/pack')
let stylesheet           = require('./middlewares/stylesheet')
let title                = require('./middlewares/title')
let eslint               = require('./middlewares/eslint')
let nodegui              = require('./middlewares/nodegui')
let image                = require('./middlewares/image')

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		const NODE_VERSION    = '12'
		let { name, version } = neutrino.options.packageJson
		let appName           = `${name} ${version}`
		let defaultSettings   = {
			launcher  : true,
			clean     : true,
			open      : true,
			sourcemaps: false,
			title     : appName,
			polyfills : true
		}
		let settings          = deepmerge(defaultSettings, customSettings)
		let useLauncher       = Boolean(settings.launcher)

		neutrino.use(mode())
		neutrino.use(nodegui())
		neutrino.use(nodeLoader())
		neutrino.use(stylesheet())
		neutrino.use(image())
		if (useLauncher) neutrino.use(reactNodeguiLauncher())
		neutrino.use(react({
			node     : NODE_VERSION,
			browsers : false,
			polyfills: settings.polyfills
		}))
		neutrino.use(clean())
		neutrino.use(title({ title: settings.title }))
		neutrino.use(dependency())
		neutrino.use(progress({ name: settings.title, clean: settings.clean }))
		neutrino.use(sourcemap({ prod: settings.sourcemaps }))
		neutrino.use(revision())
		neutrino.use(optimization({ chunks: false }))

		if (settings.open) neutrino.use(open())
		neutrino.use(pack({ name: settings.title }))
		neutrino.use(eslint())
	}
}