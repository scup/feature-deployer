const getNowDateFormatted = require('../getNowDateFormatted')

function getTagParts ({ environment, deployDescription }) {
  const tag = ['release', environment, getNowDateFormatted()]

  if (!deployDescription) return tag

  return tag.concat(deployDescription)
}

module.exports = async function executeDeploy ({ environment, deployDescription }) {
  require('../../Infra/gitClient').checkout('master')
  require('../../Infra/gitClient').pull('origin', 'master')

  const tag = getTagParts({ environment, deployDescription }).join('_')

  require('../../Infra/gitClient').tag(tag)
  require('../../Infra/gitClient').push('origin', tag)
}
