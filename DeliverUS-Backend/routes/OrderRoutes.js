'use strict'
const OrderController = require('../controllers/OrderController')
const OrderValidation = require('../controllers/validation/OrderValidation')
const Order = require('../models').Order

module.exports = (options) => {
  const app = options.app
  const middlewares = options.middlewares

  // TODO: Include routes for:
  // 1. Retrieving orders from current logged-in customer
  // 2. Creating a new order (only customers can create new orders)

  app.route('/orders/:orderId/confirm')
    .patch(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Order, 'orderId'),
      middlewares.checkOrderOwnership,
      OrderValidation.confirm,
      middlewares.handleValidation,
      OrderController.confirm)

  app.route('/orders/:orderId/send')
    .patch(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Order, 'orderId'),
      middlewares.checkOrderOwnership,
      OrderValidation.send,
      middlewares.handleValidation,
      OrderController.send)

  app.route('/orders/:orderId/deliver')
    .patch(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Order, 'orderId'),
      middlewares.checkOrderOwnership,
      OrderValidation.deliver,
      middlewares.handleValidation,
      OrderController.deliver)

  // TODO: Include routes for:
  // 3. Editing order (only customers can edit their own orders)
  // 4. Remove order (only customers can remove their own orders)
  app.route('/orders/:orderId')
    .get(
      middlewares.isLoggedIn,
      middlewares.checkEntityExists(Order, 'orderId'),
      middlewares.checkOrderVisible,
      OrderController.show)
}
