'use strict'
const RestaurantValidation = require('../controllers/validation/RestaurantValidation')
const RestaurantController = require('../controllers/RestaurantController')
const OrderController = require('../controllers/OrderController')
const ProductController = require('../controllers/ProductController')
const multer = require('multer')
const fs = require('fs')
const Restaurant = require('../models').Restaurant

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(process.env.RESTAURANTS_FOLDER, { recursive: true })
    cb(null, process.env.RESTAURANTS_FOLDER)
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).substring(7) + '-' + Date.now() + '.' + file.originalname.split('.').pop())
  }
})

const upload = multer({ storage }).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 }
])

module.exports = (options) => {
  const app = options.app
  const middlewares = options.middlewares

  app.route('/restaurants')
    .get(
      RestaurantController.index)
    .post(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      upload,
      RestaurantValidation.create,
      middlewares.handleValidation,
      RestaurantController.create)

  app.route('/restaurants/:restaurantId')
    .get(RestaurantController.show)
    .put(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Restaurant, 'restaurantId'),
      middlewares.checkRestaurantOwnership,
      upload, // Upload se indica ante la necesidad de adjuntar contenido.
      RestaurantValidation.update,
      middlewares.handleValidation,
      RestaurantController.update)
    .delete(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Restaurant, 'restaurantId'),
      middlewares.checkRestaurantOwnership,
      RestaurantController.destroy)

  app.route('/restaurants/:restaurantId/sortingProducts')
    .patch(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Restaurant, 'restaurantId'),
      middlewares.checkRestaurantOwnership,
      RestaurantController.sortingProducts)

  app.route('/restaurants/:restaurantId/orders')
    .get(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Restaurant, 'restaurantId'),
      middlewares.checkRestaurantOwnership,
      OrderController.indexRestaurant)

  app.route('/restaurants/:restaurantId/products')
    .get(
      middlewares.checkEntityExists(Restaurant, 'restaurantId'),
      ProductController.indexRestaurant)

  app.route('/restaurants/:restaurantId/analytics')
    .get(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Restaurant, 'restaurantId'),
      middlewares.checkRestaurantOwnership,
      OrderController.analytics)

  app.route('/restaurants/:restaurantId/promote')
    .patch(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Restaurant, 'restaurantId'),
      middlewares.checkRestaurantOwnership,
      RestaurantController.promote)
}
