'use strict'

module.exports = {
  checkEntityExists: (model, idPathParamName) => async (req, res, next) => {
    try {
      const entity = await model.findByPk(req.params[idPathParamName])
      if (entity === null) { return res.status(404).send('Not found') }
      return next()
    } catch (err) {
      return res.status(500).send(err)
    }
  }
}
