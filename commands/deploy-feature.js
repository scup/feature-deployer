const gitPromissified = require('simple-git/promise')
const chalk = require('chalk')

const dependencies = {
  gitPromissified,
  chalk,
  log: console.log
}

const removeDuplicated = (ignoreItem) => (items, item) => {
  if (item && items.indexOf(item) === -1 && item !== ignoreItem) {
    items.push(item)
  }
  return items
}

const mergeFeature = async (git, log, feature, branchQaName) => {
  log(`Merging feature ${chalk.yellow(feature)} into QA...`)

  await git.checkout([branchQaName])
  await git.raw(['pull', 'origin', feature])

  log(`Merged ${chalk.yellow(feature)} to QA`)
}

const removeBranch = async (git, log, branch, branchQaName) => {
  if (branch.match(/^remotes\/[^\/]*\/qa__.*/)) {
    const remoteBranch = branch.replace(/^remotes\/[^\/]*\//, '')
    log(`Removing branch ${chalk.yellow(remoteBranch)}`)
    await git.push('origin', `:${remoteBranch}`)
    log(`Branch removed!`)
  } else if (branch.match(/^qa__.*/gi) && branch !== branchQaName) {
    log(`Removing branch ${chalk.yellow(branch)}`)
    await git.raw(['branch', '-D', branch])
    log(`Branch removed!`)
  }
}

async function pullProduction(git, log) {
  log('Init Pull...')

  await git.raw(['remote', 'prune', 'origin'])
  await git.raw(['checkout', '-f'])
  await git.fetch()
  await git.checkout(['production'])
  await git.pull()

  log('Pull complete!')
  log()
}

async function createQABranch(git, chalk, log, feature, ignoreItem, maxBranches) {
  const branches = await git.branch()
  const remoteQaBranch = branches.all.find((branch) => branch.match(/^remotes\/[^\/]*\/qa__.*/))

  let features = [feature]
  if (remoteQaBranch) {
    const oldBranch = remoteQaBranch.replace(/^[^\/]*\/[^\/]*\//, '')
    const reduceFunction = ignoreItem ? removeDuplicated(feature) : removeDuplicated()

    const oldFeatures = oldBranch.replace('qa__', '').split('__')

    features = oldFeatures.concat(features).reduce(reduceFunction, [])
  }

  if (features.length > maxBranches) {
    throw `QA can only hold up to ${maxBranches} features`
  }

  log(`Features to deploy in QA: ${chalk.green(features.join(' '))}`)

  const branchQaName = `qa__${features.join('__')}`

  log(`Creating qa branch: ${chalk.green(branchQaName)}`)

  try {
    await git.checkoutBranch(branchQaName, 'production')
  } catch (exception) {
    log(chalk.red('%s'), exception)
  }

  log('Branch created!')
  log()

  return { features, branches, branchQaName }
}

async function mergeFeaturesIntoQA(git, log, features, branchQaName) {
  log('Merging features to build QA...')
  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    await mergeFeature(git, log, feature, branchQaName)
  }
  log('QA branch built!')
  log()
}

async function removeLocalBranches(git, log, branches, branchQaName) {
  log('Removing local branches...')
  for (let i = 0; i < branches.all.length; i++) {
    const branch = branches.all[i]
    await removeBranch(git, log, branch, branchQaName)
  }
  log('Local branches removed.')
  log()
}

async function pushQA(git, chalk, log, branchQaName) {
  log(`Pushing branch ${chalk.green(branchQaName)}`)
  await git.push('origin', branchQaName)
  log(`Branch pushed!`)
  log()
}

async function creteRCLink(git, chalk, log, feature) {
  const featureWithoutQa = feature.replace('_qa', '')
  const remotes = await git.getRemotes(true)
  const repositoryUrl = remotes.pop().refs.fetch.replace(/.*:([^\.]*).*/, '$1')

  const prUrl = `https://bitbucket.org/${repositoryUrl}/pull-requests/new?source=${featureWithoutQa}&t=1`
  log(`Create a pull request to RC: ${chalk.green(prUrl)}`)
}

module.exports = async function deployFeature({ dirname, feature, approve, repprove, maxBranches }, injection) {
  const { gitPromissified, chalk, log } = Object.assign({}, dependencies, injection)

  log(`Using dirname: ${chalk.bold.yellow(dirname)}`)
  log(`Starting deploy of feature ${chalk.bold.green(feature)}...`)
  log()

  const git = gitPromissified(dirname)

  await pullProduction(git, log)

  const ignoreItem = approve || repprove

  const { features, branches, branchQaName } = await createQABranch(git, chalk, log, feature, ignoreItem, maxBranches)

  await mergeFeaturesIntoQA(git, log, features, branchQaName)
  await removeLocalBranches(git, log, branches, branchQaName)
  await pushQA(git, chalk, log, branchQaName)

  if (approve) {
    await creteRCLink(git, chalk, log, feature)
  }

  if (repprove) {
    log(`${chalk.green('REPROVED')} and removed from qa`)
  }

  log(chalk.bold.green('OK!'))
}
