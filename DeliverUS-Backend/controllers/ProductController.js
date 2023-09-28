'use strict'
const models = require('../models')
const Product = models.Product
const Order = models.Order
const Restaurant = models.Restaurant
const RestaurantCategory = models.RestaurantCategory
const ProductCategory = models.ProductCategory

const Sequelize = require('sequelize')

exports.indexRestaurant = async function (req, res) {
  try {
    const products = await Product.findAll({
      where: {
        restaurantId: req.params.restaurantId
      }
    })
    res.json(products)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.show = async function (req, res) { // show -> id / index -> all
  // Only returns PUBLIC information of products
  try {
    const product = await Product.findByPk(req.params.productId, {
      include: [
        {
          model: ProductCategory,
          as: 'productCategory'
        }]
    }
    )
    res.json(product)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.create = async function (req, res) {
  let newProduct = Product.build(req.body)
  if (typeof req.file !== 'undefined') {
    newProduct.image = req.file.destination + '/' + req.file.filename
  }
  try {
    newProduct = await newProduct.save()
    await updateEconomicRestaurants(req.body.restaurantId)
    res.json(newProduct)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.update = async function (req, res) {
  if (typeof req.file !== 'undefined') {
    req.body.image = req.file.destination + '/' + req.file.filename
  }
  try {
    await Product.update(req.body, { where: { id: req.params.productId } })
    const updatedProduct = await Product.findByPk(req.params.productId)
    await updateEconomicRestaurants(updatedProduct.restaurantId)
    res.json(updatedProduct)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.destroy = async function (req, res) {
  try {
    const result = await Product.destroy({ where: { id: req.params.productId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted product id.' + req.params.productId
    } else {
      message = 'Could not delete product.'
    }
    await updateEconomicRestaurants(result.restaurantId)
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.popular = async function (req, res) {
  try {
    const topProducts = await Product.findAll(
      {
        include: [{
          model: Order,
          as: 'orders',
          attributes: []
        },
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'isEconomic', 'messageToFans', 'promoted', 'highlight', 'sortByPrice', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId'],
          include:
        {
          model: RestaurantCategory,
          as: 'restaurantCategory'
        }
        }
        ],
        attributes: {
          include: [
            [Sequelize.fn('SUM', Sequelize.col('orders.OrderProducts.quantity')), 'soldProductCount']
          ],
          separate: true
        },
        group: ['orders.OrderProducts.productId'],
        order: [[Sequelize.col('soldProductCount'), 'DESC']]
      // limit: 3 //this is not supported when M:N associations are involved
      })
    res.json(topProducts.slice(0, 3))
  } catch (err) {
    res.status(500).send(err)
  }
}

const updateEconomicRestaurants = async function (restaurantId) {
  const averagePriceOfOtherRestaurants = await Product.findOne(({ // Media de precios de los productos de los demas restaurantes
    where: {
      restaurantId: { [Sequelize.Op.ne]: restaurantId }
    },
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('price')), 'avgPrice']
    ]
  }))
  const averagePriceOfMyRestaurant = await Product.findOne(({ // Media de precios de los productos de mi restaurante
    where: {
      restaurantId: { [Sequelize.Op.eq]: restaurantId }
    },
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('price')), 'avgPrice']
    ]
  }))
  const restaurant = await Restaurant.findByPk(restaurantId) // Restaurante del producto
  if (averagePriceOfMyRestaurant !== null && averagePriceOfOtherRestaurants !== null) {
    if (averagePriceOfMyRestaurant.dataValues.avgPrice < averagePriceOfOtherRestaurants.dataValues.avgPrice) {
      restaurant.isEconomic = true
    } else {
      restaurant.isEconomic = false
    }
  }
  await restaurant.save()
}

exports.highlight = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const highlightedProductsCount = await Product.count({ where: { highlight: true } })
    if (highlightedProductsCount >= 5) {
      const firstHighlightedProduct = await Product.findOne({ // ¿Cuál fue el primer producto destacado como favorito?
        where: { highlight: true },
        order: [['createdAt', 'DESC']]
      })
      await Product.update(
        { highlight: false },
        { where: { id: firstHighlightedProduct.id }, transaction: t }
      )
    }

    await Product.update(
      { highlight: true },
      { where: { id: req.params.productId }, transaction: t }
    )

    await t.commit()
    res.status(200).send('Product highlighted successfully')
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

exports.promote = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const existingPromotedProduct = await Product.findOne({ where: { promoted: true } })

    if (existingPromotedProduct) {
      await Product.update(
        { promoted: false },
        { where: { id: existingPromotedProduct.id }, transaction: t }
      )
    }

    await Product.update(
      { promoted: true },
      { where: { id: req.params.productId }, transaction: t }
    )

    await t.commit()
    res.status(200).send('Product promoted successfully')
  } catch (err) {
    await t.rollback()
    next(err)
  }
}
