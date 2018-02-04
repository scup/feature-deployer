const gitClient = {
  commands: []
}

module.exports = {
  getExecution () {
    return gitClient.commands[Symbol.iterator]()
  },

  pull (remote, branch) {
    gitClient.commands = gitClient.commands.concat(`git pull ${remote} ${branch}`)
  },

  checkout (branch) {
    gitClient.commands = gitClient.commands.concat(`git checkout ${branch}`)
  },

  cleanExecution () {
    gitClient.commands = []
  }
}
