'use strict'

const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

const middlewares = require('../middlewares/')

module.exports = (options) => {
  options.middlewares = middlewares
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach(file => {
      require(path.join(__dirname, file))(options)
    })
}
