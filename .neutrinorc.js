let constgenEslint = require('@constgen/eslint')

module.exports = {
   use: [
      constgenEslint({
         eslint: {
				env: { node: true },
				overrides: [
					{
						files: ['**/*.md'],
						rules: {
							'class-methods-use-this': ['warn', {
								'exceptMethods': [
									'render',
									'getInitialState',
									'getDefaultProps',
									'getChildContext',
									'shouldComponentUpdate',
									'componentDidCatch',
									'getSnapshotBeforeUpdate'
								]
							}]
						}
					}
				]
         }
      })
   ]
}