const gitPromisified = require('simple-git/promise')
const path = require('path')

const baseDirectory = process.cwd()
const gitClient = {
  baseDirectory,
  git: gitPromisified(baseDirectory)
}

const dependencies = {
  executeGitClients: process.env.NODE_ENV !== 'tests',
  addCommandOnLog () {}
}

module.exports = {
  changeDirectory (gitDirectory, injection) {
    const { addCommandOnLog, executeGitClients } = Object.assign({}, dependencies, injection)
    const directoryResolved = path.resolve(gitClient.baseDirectory, gitDirectory)
    addCommandOnLog(`cd ${directoryResolved}`)
    executeGitClients && (gitClient.git = gitPromisified(directoryResolved))
  },

  async pull (remote, branch, injection) {
    const { addCommandOnLog, executeGitClients } = Object.assign({}, dependencies, injection)
    addCommandOnLog(`git pull ${remote} ${branch}`)
    // await (executeGitClients && gitClient.git.raw(['pull', 'origin', branch]))
  },

  async push (remote, branchOrTag, injection) {
    const { addCommandOnLog, executeGitClients } = Object.assign({}, dependencies, injection)
    addCommandOnLog(`git push ${remote} ${branchOrTag}`)
  },

  async checkout (branchOrTag, injection) {
    const { addCommandOnLog, executeGitClients } = Object.assign({}, dependencies, injection)
    addCommandOnLog(`git checkout ${branchOrTag} -f`)
    // await (executeGitClients && await gitClient.git.raw(['checkout', branchOrTag, '-f']))
  },

  async tag (tagDescription, injection) {
    const { addCommandOnLog, executeGitCommands } = Object.assign({}, dependencies, injection)
    addCommandOnLog(`git tag ${tagDescription}`)
  }
}
