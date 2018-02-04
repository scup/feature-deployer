function getNowDateFormatted () {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hour = now.getHours().toString().padStart(2, '0')
  const minute = now.getMinutes().toString().padStart(2, '0')
  return `${year}${month}${day}${hour}${minute}`
}

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
