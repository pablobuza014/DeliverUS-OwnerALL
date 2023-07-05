'use strict'
const RestaurantCategoryController = require('../controllers/RestaurantCategoryController')
const RestaurantCategoryValidation = require('../controllers/validation/RestaurantCategoryValidation')

module.exports = (options) => {
  const app = options.app
  const middlewares = options.middlewares // Añadido para creación ventana 'CreateRestaurantCategoryScreen'

  app.route('/restaurantCategories')
    .get(RestaurantCategoryController.indexRestaurantCategory)
    .post( // Añadido para creación ventana 'CreateRestaurantCategoryScreen'
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      RestaurantCategoryValidation.create,
      middlewares.handleValidation,
      RestaurantCategoryController.create)
}
