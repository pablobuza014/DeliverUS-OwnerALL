'use strict'

module.exports = (options) => {
  const app = options.app
  app.get('/', (req, res) => {
    res.send('Deliverus API. Check <a href="https://github.com/IISSI2-IS/DeliverUS-Backend">Repository</a>')
  })
}
