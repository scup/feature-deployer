describe('executeDeploy', function () {
  const { expect } = require('chai')

  const executeDeploy = require('./executeDeploy')

  context('when production deployDescription should be passed', function () {
    it('throw an expection telling that deployDescription is necessary', function (done) {
      executeDeploy({ environment: 'production' })
        .then(function () { done('It did not failed') })
        .catch(function (error) {
          expect(error.message).to.equal('When executing deploy on production the release should be passed')
          done()
        })
    })
  })
})
