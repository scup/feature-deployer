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

  push (remote, branchOrTag) {
    gitClient.commands = gitClient.commands.concat(`git push ${remote} ${branchOrTag}`)
  },

  checkout (branchOrTag) {
    gitClient.commands = gitClient.commands.concat(`git checkout ${branchOrTag}`)
  },

  tag (tagDescription) {
    gitClient.commands = gitClient.commands.concat(`git tag ${tagDescription}`)
  },

  cleanExecution () {
    gitClient.commands = []
  }
}
