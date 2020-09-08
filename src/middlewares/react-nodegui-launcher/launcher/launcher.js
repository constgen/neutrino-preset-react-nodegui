import React from 'react' // eslint-disable-line import/no-unresolved
import { Renderer } from '@nodegui/react-nodegui' // eslint-disable-line import/no-unresolved

function requireHotEntry () {
	let HotEntry = require('./hot-entry')

	return HotEntry.default || HotEntry
}

Renderer.render(React.createElement(requireHotEntry()), {
	onRender () {}
})

if (module.hot) {
	require('webpack/hot/log').setLogLevel('none')
	module.hot.accept(['./hot-entry'], function () {
		console.clear() // eslint-disable-line no-console
		requireHotEntry()
		Renderer.forceUpdate()
	})
	module.hot.accept()
	module.hot.dispose(function () {})
}