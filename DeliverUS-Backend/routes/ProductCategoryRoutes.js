'use strict'
const ProductCategoryController = require('../controllers/ProductCategoryController')

module.exports = (options) => {
  const app = options.app

  app.route('/productCategories')
    .get(ProductCategoryController.indexProductCategory)
}
