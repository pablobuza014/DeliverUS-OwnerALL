const { check } = require('express-validator')
const { checkFileIsImage, checkFileMaxSize } = require('./FileValidationHelper')
const maxFileSize = 2000000 // around 2Mb
const models = require('../../models')
const Restaurant = models.Restaurant

const oneOwnerOnePromotedRestaurant = async (ownerId, promotedValue) => {
  if (promotedValue) {
    try {
      const promotedRestaurants = await Restaurant.findAll({ where: { userId: ownerId, promoted: true } })
      if (promotedRestaurants.length !== 0) {
        return Promise.reject(new Error('You can only promote one restaurant at a time'))
      }
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  }
  return Promise.resolve('ok')
}

const checkDiscountCodeNotRepeated = async (discountCodeName, ownerId, { req }) => {
  const restaurantsByOwner = await Restaurant.findAll({ where: { userId: ownerId, discountCode: req.body.discountCode } })
  for (const restaurant of restaurantsByOwner) {
    if (restaurant.discountCode === discountCodeName) {
      throw new Error('The discount code cannot be repeated for restaurants owned by the same owner')
    }
  }
}

module.exports = {
  create: [
    check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('messageToFans').optional({ nullable: true, checkFalsy: true }).isString().isLength({ max: 500 }).trim(),
    check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
    check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
    check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
    check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
    check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
    check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
    check('discountCode').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 10 }).trim(),
    check('discount').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 1, max: 99 }).toFloat(),
    check('discountCode')
      .custom(async (value, { req }) => { // No es necesario indicar tercer parámetro.
        if (value) {
          return await checkDiscountCodeNotRepeated(value, req.user.id, { req })
        }
        return true
      }).withMessage('Restaurant discount codes cannot repeat among restaurants of the same owner.'),
    check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
    check('promoted').custom(oneOwnerOnePromotedRestaurant).withMessage('You can only promote one restaurant at a time'),
    check('userId').not().exists(),
    check('heroImage').custom((value, { req }) => {
      return checkFileIsImage(req, 'heroImage')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('heroImage').custom((value, { req }) => {
      return checkFileMaxSize(req, 'heroImage', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
    check('logo').custom((value, { req }) => {
      return checkFileIsImage(req, 'logo')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('logo').custom((value, { req }) => {
      return checkFileMaxSize(req, 'logo', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
  ],
  update: [
    check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('messageToFans').optional({ nullable: true, checkFalsy: true }).isString().isLength({ max: 500 }).trim(),
    check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
    check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
    check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
    check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
    check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
    check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
    check('discountCode').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 10 }).trim(),
    check('discount').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 1, max: 99 }).toFloat(),
    check('discountCode')
      .custom(async (value, { req }) => { // No es necesario indicar tercer parámetro.
        if (value) {
          return await checkDiscountCodeNotRepeated(value, req.user.id, { req })
        }
        return true
      }).withMessage('Restaurant discount codes cannot repeat among restaurants of the same owner.'),
    check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
    check('promoted').custom(oneOwnerOnePromotedRestaurant).withMessage('You can only promote one restaurant at a time'),
    check('userId').not().exists(),
    check('heroImage').custom((value, { req }) => {
      return checkFileIsImage(req, 'heroImage')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('heroImage').custom((value, { req }) => {
      return checkFileMaxSize(req, 'heroImage', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
    check('logo').custom((value, { req }) => {
      return checkFileIsImage(req, 'logo')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('logo').custom((value, { req }) => {
      return checkFileMaxSize(req, 'logo', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
  ]
}
