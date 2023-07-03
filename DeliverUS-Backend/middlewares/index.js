'use strict'

const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

const middlewares = {}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const middleware = require(path.join(__dirname, file))
    Object.keys(middleware).forEach(function (key) {
      middlewares[key] = middleware[key]
    })
  })

module.exports = middlewares
