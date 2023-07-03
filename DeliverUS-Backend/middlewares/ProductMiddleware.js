'use strict'
const models = require('../models')
const Restaurant = models.Restaurant
const Product = models.Product

module.exports = {
  checkProductOwnership: async (req, res, next) => {
    try {
      const product = await Product.findByPk(req.params.productId, { include: { model: Restaurant, as: 'restaurant' } })
      if (req.user.id === product.restaurant.userId) {
        return next()
      } else {
        return res.status(403).send('Not enough privileges. This entity does not belong to you')
      }
    } catch (err) {
      return res.status(404).send(err)
    }
  },
  checkProductRestaurantOwnership: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.body.restaurantId)
      if (req.user.id === restaurant.userId) {
        return next()
      } else {
        return res.status(403).send('Not enough privileges. This entity does not belong to you')
      }
    } catch (err) {
      return res.status(404).send(err)
    }
  },
  checkProductHyperCaloric: async (req, res, next) => {
    try {
      if (req.body.Fats * 9 + req.body.Proteins * 4 + req.body.Carbohydrates * 4 > 1000.00) {
        return res.status(422).send('This product is hypercaloric')
      } else {
        return next()
      }
    } catch (err) {
      return res.status(500).send(err)
    }
  },

  check100Grams: async (req, res, next) => {
    const Fats = parseFloat(req.body.Fats)
    const Proteins = parseFloat(req.body.Proteins)
    const Carbohydrates = parseFloat(req.body.Carbohydrates)
    try {
      if (Fats < 0 || Proteins < 0 || Carbohydrates < 0 || (Fats + Proteins + Carbohydrates) !== 100.0) {
        return res.status(422).send('Remember, the sum of grams of Fats, Proteins and Carbohydrates must be 100')
      } else {
        return next()
      }
    } catch (err) {
      return res.status(500).send(err)
    }
  }

}
