const gitClient = {
  commands: []
}

module.exports = {
  getExecution() {
    return gitClient.commands[Symbol.iterator]()
  },

  pull(branch) {
    gitClient.commands = gitClient.commands.concat(`git pull origin ${branch}`)
  },

  cleanExecution() {
    gitClient.commands = []
  }
}
