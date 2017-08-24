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
  await simpleGit.fetch()
  await simpleGit.checkout(['production'])
  await simpleGit.checkout(['rc'])
  await simpleGit.pull()

  let branchs = await simpleGit.branch()
  const remoteQaBranch = branchs.all.find((branch) => branch.match(/^remotes\/[^\/]*\/qa__.*/))
  
  branchs.all.map(async (branch) => {
    if ( branch.match(/^remotes\/[^\/]*\/qa__.*/) ) {
      const remoteBranch = branch.replace(/^remotes\/[^\/]*\//, '')
      await simpleGit.push('origin', `:${remoteBranch}`)
    } else if ( branch.match(/^qa__.*/gi) ) {
      await simpleGit.deleteLocalBranch(branch)
    }
  })

  let features = [feature]
  if (remoteQaBranch) {
    const oldBranch = remoteQaBranch.replace(/^[^\/]*\/[^\/]*\//, '')
    const reduceFunction = approve || repprove ? removeDuplicated(feature) : removeDuplicated()
    features = features.concat(oldBranch.replace('qa__', '').split('__')).reduce(reduceFunction,[])
  }

  await simpleGit.branch([`qa__${features.join('__')}`])

  features.map(async (feature) => {
    try {
        await simpleGit.checkout([feature])
        await simpleGit.mergeFromTo(feature, `qa__${features.join('__')}`)
    } catch(e) {
      throw `Feature inexistente: ${feature}`
    }
  })

  await simpleGit.push('origin', `qa__${features.join('__')}`)

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
