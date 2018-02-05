const path = require('path')

const gitClient = {
  commands: [],
  baseDirectory: process.cwd(),
  addCommand (command) {
    gitClient.commands.push(command)
  }
}

module.exports = {
  changeDirectory (directory) {
    const directoryResolved = path.resolve(gitClient.baseDirectory, directory)
    gitClient.addCommand(`cd ${directoryResolved}`)
  },

  getExecution () {
    return gitClient.commands[Symbol.iterator]()
  },

  pull (remote, branch) {
    gitClient.addCommand(`git pull ${remote} ${branch}`)
  },

  push (remote, branchOrTag) {
    gitClient.addCommand(`git push ${remote} ${branchOrTag}`)
  },

  checkout (branchOrTag) {
    gitClient.addCommand(`git checkout ${branchOrTag}`)
  },

  tag (tagDescription) {
    gitClient.addCommand(`git tag ${tagDescription}`)
  }
}
