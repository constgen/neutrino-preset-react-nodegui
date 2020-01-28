import React from 'react'; // eslint-disable-line import/no-unresolved
import { Renderer } from '@nodegui/react-nodegui'; // eslint-disable-line import/no-unresolved
import HotContainer from './hot-container';

Renderer.render(React.createElement(HotContainer, null), {
	onRender: function(){}
 });

if (module.hot) {
	require('webpack/hot/log').setLogLevel('none');
	module.hot.accept(['./hot-container'], function() {
		console.clear(); // eslint-disable-line no-console
		Renderer.forceUpdate();
	});
	module.hot.accept();
	module.hot.dispose(function () {});
}