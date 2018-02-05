const path = require('path')

const gitClient = {
  baseDirectory: process.cwd()
}

module.exports = {
  changeDirectory (directory, addCommandOnLog) {
    const directoryResolved = path.resolve(gitClient.baseDirectory, directory)
    addCommandOnLog(`cd ${directoryResolved}`)
  },

  pull (remote, branch, addCommandOnLog) {
    addCommandOnLog(`git pull ${remote} ${branch}`)
  },

  push (remote, branchOrTag, addCommandOnLog) {
    addCommandOnLog(`git push ${remote} ${branchOrTag}`)
  },

  checkout (branchOrTag, addCommandOnLog) {
    addCommandOnLog(`git checkout ${branchOrTag}`)
  },

  tag (tagDescription, addCommandOnLog) {
    addCommandOnLog(`git tag ${tagDescription}`)
  }
}
