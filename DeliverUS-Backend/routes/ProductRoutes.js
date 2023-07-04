'use strict'
const ProductValidation = require('../controllers/validation/ProductValidation')
const ProductController = require('../controllers/ProductController')
const Product = require('../models').Product
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fs = require('fs')
    fs.mkdirSync(process.env.PRODUCTS_FOLDER, { recursive: true })
    cb(null, process.env.PRODUCTS_FOLDER)
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).substring(7) + '-' + Date.now() + '.' + file.originalname.split('.').pop())
  }
})
const upload = multer({ storage }).single('image')

module.exports = (options) => {
  const app = options.app
  const middlewares = options.middlewares

  app.route('/products')
    .post(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      upload,
      ProductValidation.create,
      middlewares.handleValidation,
      middlewares.checkProductRestaurantOwnership,
      ProductController.create
    )
  app.route('/products/popular')
    .get(
      ProductController.popular
    )
  app.route('/products/:productId')
    .get(
      middlewares.checkEntityExists(Product, 'productId'),
      ProductController.show)
    .put(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      upload,
      middlewares.checkEntityExists(Product, 'productId'),
      middlewares.checkProductOwnership,
      ProductValidation.update,
      middlewares.handleValidation,
      ProductController.update
    )
    .delete(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Product, 'productId'),
      middlewares.checkProductOwnership,
      ProductController.destroy
    )
  app.route('/products/:productId/highlight')
    .patch(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Product, 'productId'),
      middlewares.checkProductOwnership,
      ProductController.highlight)

  app.route('/products/:productId/promote')
    .patch(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkEntityExists(Product, 'productId'),
      middlewares.checkProductOwnership,
      ProductController.promote)
}
