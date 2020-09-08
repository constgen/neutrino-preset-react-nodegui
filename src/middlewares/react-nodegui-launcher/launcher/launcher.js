import React from 'react'
import { Renderer } from '@nodegui/react-nodegui'

function requireHotEntry () {
	let HotEntry = require('./hot-entry')

	return HotEntry.default || HotEntry
}

Renderer.render(React.createElement(requireHotEntry(), null), {
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