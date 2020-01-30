let path = require('path')
let banner = require('@neutrinojs/banner');
let clean = require('@neutrinojs/clean');
let deepmerge = require('deepmerge');

let native = require('./middlewares/native')
let images = require('./middlewares/images')
let babel = require('./middlewares/babel')
let progress = require('./middlewares/progress')
let dependency = require('./middlewares/dependency')
let watch = require('./middlewares/watch')
let sourcemaps = require('./middlewares/sourcemaps')
let start = require('./middlewares/start')
let revision = require('./middlewares/revision')
let static = require('./middlewares/static')

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		const NODE_VERSION = '12'
		const NODE_MODULES = path.resolve(__dirname, '../node_modules');
		const PROJECT_NODE_MODULES = path.resolve(process.cwd(), 'node_modules');
		const LAUNCHER_PATH = path.resolve(__dirname, './launcher.js');
		let devMode = (process.env.NODE_ENV === 'development');
		let prodMode = (process.env.NODE_ENV === 'production');
		let { name, version } = neutrino.options.packageJson;
		let appName = `${name} ${version}`;
		let defaultSettings = {
			launcher: true,
			sourcemaps: false,
			title: appName
		};
		let settings = deepmerge(defaultSettings, customSettings);
		let useLauncher = Boolean(settings.launcher);
		
		neutrino.use(banner({
			pluginId: 'process-title',
			banner: `process.title = '${process.title}'`
		}));
		neutrino.use(native());
		neutrino.use(images());
		neutrino.use(babel({ targets: { node: NODE_VERSION } }));
		neutrino.use(clean())
		neutrino.use(dependency())
		neutrino.use(progress({ name: `${appName} (NodeGui)` }))
		neutrino.use(watch())
		neutrino.use(sourcemaps({ prod: sourcemaps }))
		neutrino.use(start())
		neutrino.use(revision())
		neutrino.use(static())
		
		Object.keys(neutrino.options.mains).forEach(function (key) {
			neutrino.config
				.entry(key)
					.when(useLauncher, function (entry) {
						entry.clear().add(LAUNCHER_PATH);
					})
					.when(useLauncher && devMode, function (entry) {
						entry.add(`${require.resolve('webpack/hot/poll')}?1000`);
					})
					.end()
				.resolve.alias
					.when(useLauncher, function (alias) {
						alias.set('__entry__', path.resolve(__dirname, neutrino.options.mains[key].entry));
					})
					.when(useLauncher && devMode, function (alias) {
						alias.set('webpack/hot/log', require.resolve('webpack/hot/log'));
					});
		});

		neutrino.config
			.target('node')
			.node
				.set('__filename', true)
				.set('__dirname', true)
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
					.add(NODE_MODULES)
					.add(PROJECT_NODE_MODULES)
					.end()
				.end()
			.resolve
				.modules
					.add(NODE_MODULES)
					.add(PROJECT_NODE_MODULES)
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
				hash: false,
				performance: true,
				version: prodMode,
				assets: prodMode,
				colors: true,
				assetsSort: 'chunks',
				env: true,
				builtAt: prodMode,
				timings: prodMode
			})
	};
};