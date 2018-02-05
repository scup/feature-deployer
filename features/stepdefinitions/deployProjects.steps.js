const { Then } = require('cucumber')
const { expect } = require('chai')

Then(/^It uses directory of (.+)$/, function (projectName) {
  const changeDirectoryCommand = this.commandsExecuted.next().value
  expect(changeDirectoryCommand).to.match(/^cd \/.+/)
  expect(changeDirectoryCommand).to.match(new RegExp(`${projectName}$`))
})

//
// Then('It switches to main branch', function () {
//   expect(this.commandsExecuted.next().value).to.equal('git checkout master')
// })
//
// Then('It downloads the last version of the code', function () {
//   expect(this.commandsExecuted.next().value).to.equal('git pull origin master')
// })
//
// Then(/^Create the tag (.+)$/, function (gitTag) {
//   this.gitTag = gitTag
//   expect(this.commandsExecuted.next().value).to.equal(`git tag ${gitTag}`)
// })
//
// Then('Upload the created tag to server', function () {
//   expect(this.commandsExecuted.next().value).to.equal(`git push origin ${this.gitTag}`)
// })
