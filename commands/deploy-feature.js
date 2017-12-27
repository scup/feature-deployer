const gitPromissified = require('simple-git/promise')
const chalk = require('chalk')

const dependencies = {
  gitPromissified,
  chalk
}

const removeDuplicated = (ignoreItem) => (items, item) => {
  if (item && items.indexOf(item) === -1 && item !== ignoreItem) {
    items.push(item)
  }
  return items
}

const mergeFeature = async (git, feature, branchQaName) => {
  console.log(`Merging feature ${chalk.yellow(feature)} into QA...`)

  await git.checkout([branchQaName])
  await git.raw(['pull', 'origin', feature])

  console.log(`Merged ${chalk.yellow(feature)} to QA`)
}

const removeBranch = async (git, branch, branchQaName) => {
  if (branch.match(/^remotes\/[^\/]*\/qa__.*/)) {
    const remoteBranch = branch.replace(/^remotes\/[^\/]*\//, '')
    console.log(`Removing branch ${chalk.yellow(remoteBranch)}`)
    await git.push('origin', `:${remoteBranch}`)
    console.log(`Branch removed!`)
  } else if (branch.match(/^qa__.*/gi) && branch !== branchQaName) {
    console.log(`Removing branch ${chalk.yellow(branch)}`)
    await git.raw(['branch', '-D', branch])
    console.log(`Branch removed!`)
  }
}

async function pullProduction(git) {
  console.log('Init Pull...')

  await git.raw(['remote', 'prune', 'origin'])
  await git.raw(['checkout', '-f'])
  await git.fetch()
  await git.checkout(['production'])
  await git.pull()

  console.log('Pull complete!')
  console.log()
}

async function createQABranch(git, chalk, feature, ignoreItem) {
  const branches = await git.branch()
  const remoteQaBranch = branches.all.find((branch) => branch.match(/^remotes\/[^\/]*\/qa__.*/))

  let features = [feature]
  if (remoteQaBranch) {
    const oldBranch = remoteQaBranch.replace(/^[^\/]*\/[^\/]*\//, '')
    const reduceFunction = ignoreItem ? removeDuplicated(feature) : removeDuplicated()
    const oldFeatures = oldBranch.replace('qa__', '').split('__')
    features = oldFeatures.concat(features).reduce(reduceFunction, [])
  }

  console.log(`Features to deploy in QA: ${chalk.green(features.join(' '))}`)

  const branchQaName = `qa__${features.join('__')}`

  console.log(`Creating qa branch: ${chalk.green(branchQaName)}`)

  try {
    await git.checkoutBranch(branchQaName, 'production')
  } catch (exception) {
    console.log(chalk.red('%s'), exception)
  }

  console.log('Branch created!')
  console.log()

  return { features, branches, branchQaName }
}

async function mergeFeaturesIntoQA(git, features, branchQaName) {
  console.log('Merging features to build QA...')
  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    await mergeFeature(git, feature, branchQaName)
  }
  console.log('QA branch built!')
  console.log()
}

async function removeLocalBranches(git, branches, branchQaName) {
  console.log('Removing local branches...')
  for (let i = 0; i < branches.all.length; i++) {
    const branch = branches.all[i]
    await removeBranch(git, branch, branchQaName)
  }
  console.log('Local branches removed.')
  console.log()
}

async function pushQA(git, chalk, branchQaName) {
  console.log(`Pushing branch ${chalk.green(branchQaName)}`)
  await git.push('origin', branchQaName)
  console.log(`Branch pushed!`)
  console.log()
}

async function creteRCLink(git, chalk, feature) {
  const featureWithoutQa = feature.replace('_qa', '')
  const remotes = await git.getRemotes(true)
  const repositoryUrl = remotes.pop().refs.fetch.replace(/.*:([^\.]*).*/, '$1')

  const prUrl = `https://bitbucket.org/${repositoryUrl}/pull-requests/new?source=${featureWithoutQa}&t=1`
  console.log(`Create a pull request to RC: ${chalk.green(prUrl)}`)
}

module.exports = async function deployFeature({ dirname, feature, approve, repprove }, injection) {
  const { gitPromissified, chalk } = Object.assign({}, dependencies, injection)

  console.log(`Using dirname: ${chalk.bold.yellow(dirname)}`)
  console.log(`Starting deploy of feature ${chalk.bold.green(feature)}...`)
  console.log()

  const git = gitPromissified(dirname)

  await pullProduction(git)

  const { features, branches, branchQaName } = await createQABranch(git, chalk, feature, approve || repprove)

  await mergeFeaturesIntoQA(git, features, branchQaName)
  await removeLocalBranches(git, branches, branchQaName)
  await pushQA(git, chalk, branchQaName)

  if (approve) {
    await creteRCLink(git, chalk, feature)
  }

  if (repprove) {
    console.log(`${chalk.green('REPROVED')} and removed from qa`)
  }

  console.log(chalk.bold.green('OK!'))
}
