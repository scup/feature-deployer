const { transports: { Console }, createLogger, format } = require('winston')
const level = process.env.LOG_LEVEL

const logger = createLogger({
  transports: [new Console({
    level,
    colorize: true
  })],

  format: format.printf(function (info) {
    return `${info.message}`
  })
})

module.exports = logger
