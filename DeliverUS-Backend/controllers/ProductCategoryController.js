'use strict'
const models = require('../models')
const ProductCategory = models.ProductCategory

exports.indexProductCategory = async function (req, res) {
  try {
    const productCategories = await ProductCategory.findAll()
    res.json(productCategories)
  } catch (err) {
    res.status(500).send(err)
  }
}
