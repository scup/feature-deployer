const gitPromisified = require('simple-git/promise')
const path = require('path')

const environment = require('../configuration/environment')

const DEFAULT_TAG_SORT = 'taggerdate'
const REF_NAME = 'refname'
const DEFAULT_TAG_FIELDS = [{ name: 'authordate', type: Date }, 'authorname', 'authoremail']

const dependencies = {
  gitPromisified,
  path,
  addCommandOnLog: noop,
  isProduction: process.env.NODE_ENV !== 'test'
}

const executeGitCommandForEnvironment = {
  production: executeGitCommand,
  test: noop
}

const baseDirectory = process.cwd()
const gitClient = {
  baseDirectory,
  git: gitPromisified(baseDirectory),
  executeGitCommand: executeGitCommandForEnvironment[environment],
  async applyGitCommand (gitParameters, { dontFail }, injection) {
    const { addCommandOnLog } = Object.assign({}, dependencies, injection)

    addCommandOnLog(`git ${gitParameters.join(' ')}`)

    try {
      const result = await gitClient.executeGitCommand(gitParameters)
      return result
    } catch (error) {
      if (!dontFail) {
        return Promise.reject(error)
      }
    }
  }
}

const gitClientApi = {
  changeDirectory (gitDirectory, injection) {
    const { addCommandOnLog, gitPromisified, path, isProduction } = Object.assign({}, dependencies, injection)
    const directoryResolved = path.resolve(gitClient.baseDirectory, gitDirectory)
    addCommandOnLog(`cd ${directoryResolved}`)

    if (isProduction) {
      gitClient.git = gitPromisified(directoryResolved)
      gitClient.executeGitCommand = executeGitCommand
    }
  },

  async currentBranch (injection) {
    const { isProduction } = Object.assign({}, dependencies, injection)

    if (!isProduction) return null

    const { current } = await gitClient.git.branch()
    return current
  },

  async download (remote, branch, injection) {
    const currentBranch = await gitClientApi.currentBranch(injection)

    if (currentBranch === branch) {
      return gitClient.applyGitCommand(['pull', remote, branch], {}, injection)
    }

    const fetchBranch = `${branch}:${branch}`

    return gitClient.applyGitCommand(['fetch', remote, fetchBranch], {}, injection)
  },

  async push (remote, branchOrTag, injection) {
    return gitClient.applyGitCommand(['push', remote, branchOrTag], {}, injection)
  },

  async pull (remote, branchOrTag, injection) {
    return gitClient.applyGitCommand(['pull', remote, branchOrTag], {}, injection)
  },

  async checkout (branchOrTag, injection) {
    return gitClient.applyGitCommand(['checkout', branchOrTag], {}, injection)
  },

  async tag (tagDescription, injection) {
    return gitClient.applyGitCommand(['tag', tagDescription], {}, injection)
  },

  async fetchTags (remote, injection) {
    return gitClient.applyGitCommand(['fetch', remote, '--tags'], {}, injection)
  },

  async merge (branch, injection) {
    return gitClient.applyGitCommand(['merge', branch, '--no-edit'], {}, injection)
  },

  async deleteBranchLocally (branch, injection) {
    return gitClient.applyGitCommand(['branch', '-D', branch], { dontFail: true }, injection)
  },

  async detailTags ({ filter, sortField = DEFAULT_TAG_SORT, fields = DEFAULT_TAG_FIELDS }, injection) {
    const { randomSeparator } = Object.assign({}, dependencies, injection)
    const formatFields = [REF_NAME].concat(fields)

    const format = formatFields.map(toGitField).join(randomSeparator)

    const tags = await gitClient.applyGitCommand(['for-each-ref', `--sort=-${sortField}`, `--format=${format}`, `--count=100`, 'refs/tags'], {}, injection)

    return `${tags}`.split('\n').reduce(toGitTagObject, { fields: formatFields, randomSeparator, filter, tags: [] }).tags
  },

  async listTags ({ preffix }, injection) {
    const { isProduction, addCommandOnLog } = Object.assign({}, dependencies, injection)

    addCommandOnLog(`git tag -l '${preffix}*'`)

    if (!isProduction) return gitClientApi.tags

    const { all } = await gitClient.git.tags()
    const tags = all.filter(filterByPreffix, { preffix })
    return tags.length ? tags : null
  },

  async deleteTag (origin, tagToDelete, injection) {
    await gitClient.applyGitCommand(['tag', '-d', `${tagToDelete}`], { dontFail: true }, injection)
    await gitClient.applyGitCommand(['push', origin, `:${tagToDelete}`], { dontFail: true }, injection)
  }
}

module.exports = gitClientApi

function filterByPreffix (tag) {
  return tag.startsWith(this.preffix)
}

function executeGitCommand (parameters) {
  return gitClient.git.raw(parameters)
}

function toGitField (field) {
  return `%(${field.type ? field.name : field})`
}

function toGitTagObject ({ fields, randomSeparator, filter, tags }, gitTagString) {
  const values = gitTagString.split(randomSeparator)
  const tag = fields.reduce(buildObjectAttributes, { object: {}, values }).object

  if (!filter.test(tag.refname)) return { fields, randomSeparator, filter, tags }
  return { fields, randomSeparator, filter, tags: tags.concat(tag) }
}

function buildObjectAttributes ({ object, values }, key, index) {
  const Type = key.type
  const attributeKey = !key.type ? key : key.name
  const attributeValue = !key.type ? values[index] : new Type(values[index])
  const cleanedAttributeValue = attributeKey === REF_NAME ? attributeValue.replace(/^refs\/tags\//, '') : attributeValue

  return {
    values,
    object: Object.assign({}, object, {
      [attributeKey]: cleanedAttributeValue
    })
  }
}

function noop () {}
