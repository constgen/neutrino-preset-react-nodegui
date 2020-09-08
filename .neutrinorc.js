let constgenEslint = require('@constgen/eslint')

module.exports = {
   use: [
      constgenEslint({
         eslint: {
				env: { node: true }
         }
      })
   ]
}