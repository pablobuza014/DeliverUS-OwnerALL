'use strict'
const { validationResult } = require('express-validator')

module.exports = {
  handleValidation: async (req, res, next) => {
    const err = validationResult(req)
    if (err.errors.length > 0) {
      res.status(422).send(err)
    } else {
      next()
    }
  }
}
