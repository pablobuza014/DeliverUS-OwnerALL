'use strict'
const models = require('../models')
const Restaurant = models.Restaurant

module.exports = {
  checkRestaurantOwnership: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.restaurantId)
      if (req.user.id === restaurant.userId) {
        return next()
      }
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    } catch (err) {
      return res.status(500).send(err)
    }
  }
}
