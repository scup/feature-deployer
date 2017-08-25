#!/usr/bin/env node

const commander = require("commander")

commander
  .version('0.1.0')
  .option('--dirname [name]', 'Set git directory', /^.*$/i, __dirname)
  .option('-d, --deploy-feature [name]', 'Deploy feature to Test')
  .option('-a, --approve-feature [name]', 'Approve feature')
  .option('-r, --repprove-feature [name]', 'Repprove feature')
  .parse(process.argv)

const simpleGit = require("simple-git/promise")(commander.dirname)

if(commander.deployFeature) {
  deployFeature(commander.deployFeature)
}

if(commander.approveFeature) {
  deployFeature(commander.approveFeature, true)
}

if(commander.repproveFeature) {
  deployFeature(commander.repproveFeature, false, true)
}

const removeDuplicated = (ignoreItem) => (items, item) => {
  if (item && items.indexOf(item) === -1 && item !== ignoreItem) {
    items.push(item)
  }
  return items
}

async function deployFeature(feature, approve, repprove) {

  console.log("Init Pull...")

  await simpleGit.raw(['remote', 'prune', 'origin'])
  await simpleGit.raw(['checkout', '-f'])
  await simpleGit.fetch()
  await simpleGit.checkout(['production'])
  await simpleGit.checkout(['rc'])
  await simpleGit.pull()

  console.log("Pull complete!")

  let branchs = await simpleGit.branch()
  const remoteQaBranch = branchs.all.find((branch) => branch.match(/^remotes\/[^\/]*\/qa__.*/))
  
  let features = [feature]
  if (remoteQaBranch) {
    const oldBranch = remoteQaBranch.replace(/^[^\/]*\/[^\/]*\//, '')
    const reduceFunction = approve || repprove ? removeDuplicated(feature) : removeDuplicated()
    features = features.concat(oldBranch.replace('qa__', '').split('__')).reduce(reduceFunction,[])
  }
  
  const branchQaName = `qa__${features.join('__')}`
  
  console.log(`Creating qa branch! ${branchQaName}`)

  await simpleGit.checkoutBranch(branchQaName, 'rc')

  console.log(`Branch created! ${branchQaName}`)

  await Promise.all(features.map((feature) => {
    console.log(`Mergin feature ${feature}`)
    return simpleGit.checkout([feature])
      .then(() => simpleGit.checkout([branchQaName]))
      .then(() => simpleGit.mergeFromTo(feature, branchQaName))
      .then(() => console.log(`Merged ${feature} to ${branchQaName}!`))
  }))

  await branchs.all.map(async (branch) => {
    if ( branch.match(/^remotes\/[^\/]*\/qa__.*/) ) {
      const remoteBranch = branch.replace(/^remotes\/[^\/]*\//, '')
      console.log(`Removing branch ${remoteBranch}`)
      await simpleGit.push('origin', `:${remoteBranch}`)
      console.log(`Branch removed!`)
    } else if ( branch.match(/^qa__.*/gi) && branch !== branchQaName ) {
      console.log(`Removing branch ${branch}`)
      await simpleGit.raw(['branch', '-D', branch])
      console.log(`Branch removed!`)
    }
  })

  console.log(`Pushing branch ${branchQaName}`)
  await simpleGit.push('origin', branchQaName)
  console.log(`Branch pushed!`)

  if (approve) {
    const remotes = await simpleGit.getRemotes(true) 
    const repositoryUrl = remotes.pop().refs.fetch.replace(/.*:([^\.]*).*/,'$1')
    console.log(`Create a pull request to RC: https://bitbucket.org/${repositoryUrl}/pull-requests/new?source=${feature}&t=1`)
  }

  if (repprove) {
    console.log(`REPROVED and removed from qa`)
  }
  console.log('OK!')
}
