const { check } = require('express-validator')
const { Restaurant } = require('../../models')
const { Product } = require('../../models')
const { checkFileIsImage, checkFileMaxSize } = require('./FileValidationHelper')

const maxFileSize = 2000000 // around 2Mb

const checkOneOwnerFiveHighlightProducts = async (highlightValue, { req }) => {
  if (highlightValue) {
    try {
      const highlightedProducts = await Product.count({ where: { restaurantId: req.body.restaurantId, highlight: true } })
      if (highlightedProducts > 4) {
        return Promise.reject(new Error('You can only highlight five products at the same time'))
      }
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  }
  return Promise.resolve('ok')
}

const oneRestaurantOnePromotedProduct = async (promotedValue, { req }) => {
  if (promotedValue) {
    try {
      const promotedProducts = await Product.count({ where: { restaurantId: req.body.restaurantId, promoted: true } })
      if (promotedProducts > 0) {
        return Promise.reject(new Error('You can only promoted one product at the same time'))
      }
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  }
  return Promise.resolve('ok')
}

const checkRestaurantExists = async (value, { req }) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (restaurant === null) {
      return Promise.reject(new Error('The restaurantId does not exist.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const checkProductHyperCaloric = async (req, res) => {
  try {
    if (req.body.Fats * 9 + req.body.Proteins * 4 + req.body.Carbohydrates * 4 > 1000.00) {
      return Promise.reject(new Error('This product is hypercaloric'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const check100Grams = async (req, res) => {
  const Fats = parseFloat(req.body.Fats)
  const Proteins = parseFloat(req.body.Proteins)
  const Carbohydrates = parseFloat(req.body.Carbohydrates)
  try {
    if (Fats < 0 || Proteins < 0 || Carbohydrates < 0 || (Fats + Proteins + Carbohydrates) !== 100.0) {
      return Promise.reject(new Error('Remember, the sum of grams of Fats, Proteins and Carbohydrates must be 100'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

module.exports = {
  create: [
    check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('').custom(async (value, { req, res }) => {
      return check100Grams(req, res)
    }).withMessage('Remember, the sum of grams of Fats, Proteins and Carbohydrates must be 100'),
    check('').custom(async (value, { req, res }) => {
      return checkProductHyperCaloric(req, res)
    }).withMessage('This product is hypercaloric'),
    check('description').optional({ checkNull: true, checkFalsy: true }).isString().isLength({ min: 1 }).trim(),
    check('price').exists().isFloat({ min: 0 }).toFloat(),
    check('order').default(null).optional({ nullable: true }).isInt().toInt(),
    check('productCategoryId').exists().isInt({ min: 1 }).toInt(),
    check('restaurantId').exists().isInt({ min: 1 }).toInt(),
    check('restaurantId').custom(checkRestaurantExists),
    check('availability').optional().isBoolean().toBoolean(),
    check('highlight').custom(checkOneOwnerFiveHighlightProducts).withMessage('You can only highlight five products at the same time'),
    check('promoted').custom(oneRestaurantOnePromotedProduct).withMessage('You can only promote one restaurant at the same time'),
    check('image').custom((value, { req }) => {
      return checkFileIsImage(req, 'image')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('image').custom((value, { req }) => {
      return checkFileMaxSize(req, 'image', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
  ],

  update: [
    check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('').custom(async (value, { req, res }) => {
      return check100Grams(req, res)
    }).withMessage('Remember, the sum of grams of Fats, Proteins and Carbohydrates must be 100'),
    check('').custom(async (value, { req, res }) => {
      return checkProductHyperCaloric(req, res)
    }).withMessage('This product is hypercaloric'),
    check('description').optional({ checkNull: true, checkFalsy: true }).isString().isLength({ min: 1 }).trim(),
    check('price').exists().isFloat({ min: 0 }).toFloat(),
    check('order').default(null).optional({ nullable: true }).isInt().toInt(),
    check('productCategoryId').exists().isInt({ min: 1 }).toInt(),
    check('restaurantId').exists(),
    check('availability').optional().isBoolean().toBoolean(),
    check('highlight').custom(checkOneOwnerFiveHighlightProducts).withMessage('You can only highlight five products at the same time'),
    check('promoted').custom(oneRestaurantOnePromotedProduct).withMessage('You can only promote one restaurant at the same time'),
    check('image').custom((value, { req }) => {
      return checkFileIsImage(req, 'image')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('image').custom((value, { req }) => {
      return checkFileMaxSize(req, 'image', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
  ]
}
