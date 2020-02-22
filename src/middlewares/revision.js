let GitRevisionPlugin = require('git-revision-webpack-plugin')
let { DefinePlugin } = require('webpack')
let envCi = require('env-ci')

let {
	isCi: inCIEnvironment, branch, isPr: duringPR, tag, prBranch
} = envCi()
let branchCommand

if (inCIEnvironment) {
	if (duringPR) {
		branchCommand = `--version | tail -n0 && echo ${prBranch}`
	}
	else if (branch !== tag) {
		branchCommand = `--version | tail -n0 && echo ${branch}`
	}
}

module.exports = function () {
	return function (neutrino) {
		let { version } = neutrino.options.packageJson
		let revisionOptions = {
			lightweightTags: true,
			branch: true,
			branchCommand
		}
		let env = {
			VERSION: version,
			COMMITHASH: '',
			BRANCH: ''
		}
		let inGitEnvironment = false

		try {
			let gitRevisionPlugin = new GitRevisionPlugin(revisionOptions)

			env.VERSION = gitRevisionPlugin.version()
			env.COMMITHASH = gitRevisionPlugin.commithash()
			env.BRANCH = gitRevisionPlugin.branch()
			inGitEnvironment = true
		}
		catch (err) {}

		neutrino.config
			.when(inGitEnvironment, function (config) {
				config
					.plugin('revision')
					.use(GitRevisionPlugin, [revisionOptions])
					.end()
			})
			.plugin('revision-vars')
				.use(DefinePlugin, [{
					'process.env.VERSION': JSON.stringify(env.VERSION),
					'process.env.COMMITHASH': JSON.stringify(env.COMMITHASH),
					'process.env.BRANCH': JSON.stringify(env.BRANCH)
				}])
				.end()
	}
}