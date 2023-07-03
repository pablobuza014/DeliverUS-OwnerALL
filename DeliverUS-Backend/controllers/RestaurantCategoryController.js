'use strict'
const models = require('../models')
const RestaurantCategory = models.RestaurantCategory

exports.indexRestaurantCategory = async function (req, res) {
  try {
    const restaurantCategories = await RestaurantCategory.findAll()
    res.json(restaurantCategories)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.create = async function (req, res) {
  const newRestaurantCategory = RestaurantCategory.build(req.body)
  try {
    const restaurantCategory = await newRestaurantCategory.save()
    res.json(restaurantCategory)
  } catch (err) {
    res.status(500).send(err)
  }
}
