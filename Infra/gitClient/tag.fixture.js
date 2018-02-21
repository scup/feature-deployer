const { Factory } = require('rosie')
const { lorem, name, date, internet } = require('faker')

const factory = new Factory()
  .attr('refname', ['tagname'], (tagName) => `refs/tags/${tagName}`)
  .attr('authordate', () => date.past().toString())
  .attr('authorname', () => name.findName())
  .attr('authoremail', () => `<${internet.email().toLowerCase()}>`)
  .attr('tagname', () => `${lorem.word()}`)

factory.toGitTag = function toGitTag(object) {
  return Object.values(object).slice(1).join('#')
}

factory.convertDates = function convertDates(object) {
  return {
    authordate: new Date(object.authordate),
    refname: object.tagname,
    authorname: object.authorname,
    authoremail: object.authoremail
  }
}

module.exports = factory
