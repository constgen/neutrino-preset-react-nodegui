let path = require('path')

let banner = require('@neutrinojs/banner')
let clean = require('@neutrinojs/clean')
let deepmerge = require('deepmerge')

let native = require('./middlewares/native')
let image = require('./middlewares/image')
let babel = require('./middlewares/babel')
let progress = require('./middlewares/progress')
let dependency = require('./middlewares/dependency')
let watch = require('./middlewares/watch')
let sourcemaps = require('./middlewares/sourcemaps')
let open = require('./middlewares/open')
let pack = require('./middlewares/pack')
let revision = require('./middlewares/revision')
let staticFiles = require('./middlewares/static-files')
let style = require('./middlewares/style')
let svg = require('./middlewares/svg')

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		const NODE_VERSION = '12'
		let nodeModulesPath = path.resolve(__dirname, '../node_modules')
		let projectNodeModulesPath = path.resolve(process.cwd(), 'node_modules')
		let launcherPath = path.resolve(__dirname, './launcher.js')
		let devMode = (process.env.NODE_ENV === 'development')
		let prodMode = (process.env.NODE_ENV === 'production')
		let { name, version } = neutrino.options.packageJson
		let appName = `${name} ${version}`
		let defaultSettings = {
			launcher: true,
			open: true,
			sourcemaps: false,
			title: appName
		}
		let settings = deepmerge(defaultSettings, customSettings)
		let useLauncher = Boolean(settings.launcher)
		let lintRule = neutrino.config.module.rules.get('lint')

		neutrino.use(banner({
			pluginId: 'process-title',
			banner: `process.title = '${process.title}'`
		}))
		neutrino.use(native())
		neutrino.use(image())
		neutrino.use(babel({ targets: { node: NODE_VERSION } }))
		neutrino.use(clean())
		neutrino.use(dependency())
		neutrino.use(progress({ name: settings.title }))
		neutrino.use(watch())
		neutrino.use(sourcemaps({ prod: settings.sourcemaps }))
		neutrino.use(revision())
		neutrino.use(staticFiles())
		neutrino.use(style())
		neutrino.use(svg())
		if (settings.open) neutrino.use(open())
		neutrino.use(pack({ name: settings.title }))

		Object.keys(neutrino.options.mains).forEach(function (key) {
			neutrino.config
				.entry(key)
					.when(useLauncher, function (entry) {
						entry.clear().add(launcherPath)
					})
					.when(useLauncher && devMode, function (entry) {
						entry.add(`${require.resolve('webpack/hot/poll')}?1000`)
					})
					.end()
				.resolve.alias
					.when(useLauncher, function (alias) {
						alias.set('__entry__', path.resolve(__dirname, neutrino.options.mains[key].entry))
					})
					.when(useLauncher && devMode, function (alias) {
						alias.set('webpack/hot/log', require.resolve('webpack/hot/log'))
					})
		})

		neutrino.config
			.target('node')
			.node
				.set('__filename', true)
				.set('__dirname', false)
				.end()
			.context(neutrino.options.root)
			.output
				.path(neutrino.options.output)
				.libraryTarget('commonjs2')
				.filename('index.js')
				.end()
			.resolveLoader
				.modules
					.add('node_modules')
					.add(nodeModulesPath)
					.add(projectNodeModulesPath)
					.end()
				.end()
			.resolve
				.modules
					.add(nodeModulesPath)
					.add(projectNodeModulesPath)
					.end()
				.extensions
					.merge(['.wasm'])
					.merge([...neutrino.options.extensions.map(ext => `.${ext}`)])
					.merge(['.tsx', '.ts', '.js', '.jsx', '.json'])
					.end()
				.end()
			.optimization
				.minimize(prodMode)
				.end()
			.stats({
				children: false,
				entrypoints: false,
				modules: false,
				hash: prodMode,
				performance: true,
				version: prodMode,
				assets: prodMode,
				colors: true,
				assetsSort: 'chunks',
				env: true,
				builtAt: prodMode,
				timings: prodMode
			})

		if (lintRule) {
			lintRule.use('eslint').tap(options => deepmerge(options, {
				baseConfig: {
					env: {
						node: true,
						commonjs: true
					}
				}
			}))
		}
	}
}