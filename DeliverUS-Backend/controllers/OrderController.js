/* eslint-disable brace-style */
'use strict'
const models = require('../models')
const Order = models.Order
const Product = models.Product
const Restaurant = models.Restaurant
const User = models.User
const moment = require('moment')
const { Op } = require('sequelize')

const generateFilterWhereClauses = function (req) {
  const filterWhereClauses = []
  if (req.query.status) {
    switch (req.query.status) {
      case 'pending':
        filterWhereClauses.push({
          startedAt: null
        })
        break
      case 'in process':
        filterWhereClauses.push({
          [Op.and]: [
            {
              startedAt: {
                [Op.ne]: null
              }
            },
            { sentAt: null },
            { deliveredAt: null }
          ]
        })
        break
      case 'sent':
        filterWhereClauses.push({
          [Op.and]: [
            {
              sentAt: {
                [Op.ne]: null
              }
            },
            { deliveredAt: null }
          ]
        })
        break
      case 'delivered':
        filterWhereClauses.push({
          sentAt: {
            [Op.ne]: null
          }
        })
        break
    }
  }
  if (req.query.from) {
    const date = moment(req.query.from, 'YYYY-MM-DD', true)
    filterWhereClauses.push({
      createdAt: {
        [Op.gte]: date
      }
    })
  }
  if (req.query.to) {
    const date = moment(req.query.to, 'YYYY-MM-DD', true)
    filterWhereClauses.push({
      createdAt: {
        [Op.lte]: date.add(1, 'days') // FIXME: se pasa al siguiente día a las 00:00
      }
    })
  }
  return filterWhereClauses
}

// Returns :restaurantId orders
exports.indexRestaurant = async function (req, res) {
  const whereClauses = generateFilterWhereClauses(req)
  whereClauses.push({
    restaurantId: req.params.restaurantId
  })
  try {
    const orders = await Order.findAll({
      where: whereClauses,
      include: {
        model: Product,
        as: 'products'
      }
    })
    res.json(orders)
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Implement the indexCustomer function that queries orders from current logged-in customer and send them back.
// Orders have to include products that belongs to each order and restaurant details
// sort them by createdAt date, desc.
exports.indexCustomer = async function (req, res) {
  try {
    const orders = await Order.findAll({ // Localizamos o encontramos todas las órdenes de la base de datos que pertenezcan al usuario actual.
      where: {
        userId: req.user.id // Filtramos las órdenes por el ID de usuario del usuario actual.
      },
      include: [{ // Incluimos los productos y el restaurante asociados a cada orden.
        model: Product,
        as: 'products'
      }, {
        model: Restaurant,
        as: 'restaurant',
        attributes: { exclude: ['createdAt', 'updatedAt'] } // Excluímos las propiedades de fecha de creación y actualización del restaurante.
      }],
      order: [['createdAt', 'DESC']] // Ordenamos las órdenes por fecha de creación en orden descendente.
    })
    res.json(orders) // Devolvemos la lista de órdenes encontradas en formato JSON como respuesta.
  } catch (err) {
    res.status(500).send(err) // Si se produce un error, devolvemos un código de error 500 y el mensaje de error recibido.
  }
}

// TODO: Implement the create function that receives a new order and stores it in the database.
// Take into account that:
// 1. If price is greater than 10€, shipping costs have to be 0.
// 2. If price is less or equals to 10€, shipping costs have to be restaurant default shipping costs and have to be added to the order total price
// 3. In order to save the order and related products, start a transaction, store the order, store each product linea and commit the transaction
// 4. If an exception is raised, catch it and rollback the transaction
exports.create = async function (req, res) {
  const transaction = await models.sequelize.transaction() // Iniciamos una transacción con la base de datos utilizando Sequelize.
  try {
    let newOrder = Order.build(req.body) // Creamos una nueva instancia del modelo Order usando los datos del cuerpo de la solicitud.
    newOrder.createdAt = Date.now() // Establecemos la fecha y hora en que se creó la orden en la propiedad 'createdAt'.
    newOrder.startedAt = null // Establecemos valor 'null' para las propiedades de las fechas 'startedAt', 'sentAt' y 'deliveredAt'.
    newOrder.sentAt = null
    newOrder.deliveredAt = null
    newOrder.userId = req.user.id // Establecemos el ID del usuario que hizo la solicitud HTTP en la propiedad 'userId'.
    newOrder.products = null // Establecemos valor 'null' para la propiedad 'products'.

    const restaurant = await Restaurant.findByPk(req.body.restaurantId) // Buscamos el restaurante al que se le está realizando el pedido mediante su id.
    let totalPrice = 0.0 // Inicializamos la variable 'totalPrice' a 0 (euros)
    for (const product of req.body.products) { // En base a una constante 'product', hacemos un bucle for que recorra todos los productos.
      const databaseProduct = await Product.findByPk(product.productId) // En base a una constante 'databaseProduct', buscamos la información del producto
      // en la base de datos mediante su ID.
      totalPrice += product.quantity * databaseProduct.price // Calculamos el precio total según la cantidad del producto y el precio del producto.
    }

    let shippingCosts = 0 // Establecemos la variable 'shippingCosts' a 0 (euros).
    if (totalPrice <= 10) { // Si el precio total de los productos es inferior a 10 (euros)...
      shippingCosts = restaurant.shippingCosts // ... el coste de envío no será gratuito, es decir, el cliente deberá pagar el precio de envío.
    }

    newOrder.price = totalPrice + shippingCosts // Establecemos el precio total de la orden como la suma del precio total y el coste de envío.
    newOrder.shippingCosts = shippingCosts // Establecemos el coste de envío de la orden en la propiedad 'shippingCosts'.

    // A continuación, se ejecuta la transacción utilizando el objeto Order, creando primero el pedido
    // y buscando y agregando posteriormente los productos pertinentes, estableciendo también la cantidad y precio correspondientes.
    // Finalmente, se retorna el pedido creado.
    newOrder = await newOrder.save({ transaction })
    for (const product of req.body.products) {
      const databaseProduct = await Product.findByPk(product.productId)
      await newOrder.addProduct(databaseProduct, {
        through: { quantity: product.quantity, unityPrice: databaseProduct.price },
        transaction
      })
    }
    await transaction.commit() // Si no se producen errores, se confirman todos los cambios realizados durante la transacción.

    await newOrder.reload({ include: [{ model: Product, as: 'products' }] }) // Utilizamos el metodo reload() para recargar
    // la instancia de Order después de haber guardado los productos y así obtener los productos asociados a la orden.

    res.json(newOrder) // Devolvemos el pedido creado en formato 'json' como respuesta de la solicitud.
  } catch (error) { // Si hay un error...
    await transaction.rollback() // ... se realiza un rollback de la transacción.
    res.status(500).send(error) // Y se envía una respuesta HTTP con un estado de error 500 (error por parte del servidor)
    // y el mensaje de error en el cuerpo de la respuesta.
  }
}

// TODO: Implement the update function that receives a modified order and persists it in the database.
// Take into account that:
// 1. If price is greater than 10€, shipping costs have to be 0.
// 2. If price is less or equals to 10€, shipping costs have to be restaurant default shipping costs and have to be added to the order total price
// 3. In order to save the updated order and updated products, start a transaction, update the order, remove the old related OrderProducts and store the new product lines, and commit the transaction
// 4. If an exception is raised, catch it and rollback the transaction
exports.update = async function (req, res) {
  const transaction = await models.sequelize.transaction()
  try {
    let updatedOrder = await Order.findByPk(req.params.orderId) // Buscamos la orden a actualizar.
    const restaurant = await Restaurant.findByPk(updatedOrder.restaurantId)// Buscamos el restaurante al que se le está realizando el pedido mediante su id.

    let totalPrice = 0.0 // Inicializamos la variable 'totalPrice' a 0 (euros)
    for (const product of req.body.products) { // En base a una constante 'product', hacemos un bucle for que recorra todos los productos.
      const databaseProduct = await Product.findByPk(product.productId) // En base a una constante 'databaseProduct', buscamos la información del producto en la base de datos mediante su ID.
      totalPrice += product.quantity * databaseProduct.price // Calculamos el precio total según la cantidad del producto y el precio del producto.
    }

    let shippingCosts // Establecemos en la variable 'shippingCosts' los costes de envío a 0.
    if (totalPrice > 10.0) { // Si el precio total de los productos es inferior a 10 (euros)...
      shippingCosts = 0 // ... el coste de envío no será gratuito, es decir, el cliente deberá pagar el precio de envío.
    } else {
      shippingCosts = restaurant.shippingCosts
    }

    req.body.price = totalPrice + shippingCosts // Actualizamos el precio total de la orden sumando el coste de envío.
    req.body.shippingCosts = shippingCosts // Actualizamos el coste de envío en la orden.

    await Order.update(req.body, { where: { id: req.params.orderId } }, { transaction }) // Actualizamos la orden con los nuevos datos.
    await updatedOrder.setProducts([], { transaction }) // Borramos los productos asociados a la orden.
    for (const product of req.body.products) { // Por cada producto en los datos de la orden actualizada...
      const databaseProduct = await Product.findByPk(product.productId) // ... buscamos el producto en la base de datos.
      await updatedOrder.addProduct(databaseProduct, { // Agregamos el producto a la orden actualizada.
        through: { quantity: product.quantity, unityPrice: databaseProduct.price }, // Añadimos la cantidad de producto y el precio unitario del producto.
        transaction
      })
    }

    await transaction.commit() // Si no se producen errores, se confirman todos los cambios realizados durante la transacción.
    updatedOrder = await Order.findByPk(req.params.orderId, { include: [{ model: Product, as: 'products' }] }) // Buscamos la orden actualizada con los productos asociados.

    res.json(updatedOrder) // Devolvemos la orden actualizada como respuesta.
  } catch (error) { // Si hay un error...
    await transaction.rollback() // ... se realiza un rollback de la transacción.
    res.status(500).send(error) // Y se envía una respuesta HTTP con un estado de error 500 (error por parte del servidor)
    // y el mensaje de error en el cuerpo de la respuesta.
  }
}

// TODO: Implement the destroy function that receives an orderId as path param and removes the associated order from the database.
// Take into account that:
// 1. The migration include the "ON DELETE CASCADE" directive so OrderProducts related to this order will be automatically removed.
exports.destroy = async function (req, res) {
  try {
    const result = await Order.destroy({ where: { id: req.params.orderId } }) // Eliminamos la orden de la base de datos según el ID de pedido recibido.
    let message = ''
    if (result === 1) { // Si se eliminó con éxito un registro, mostramos el mensaje de éxito.
      message = 'Order id ' + req.params.orderId + ' has been successfully deleted.'
    } else { // Si no se eliminó ningún registro, mostramos el mensaje de fallo.
      message = 'Could not delete order.'
    }
    res.json(message) // Devolvemos el mensaje como respuesta.
  } catch (err) { // Si se produce un error...
    res.status(500).send(err) // ... devolvemos un código de error 500 y el mensaje de error recibido.
  }
}

exports.confirm = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId)
    order.startedAt = new Date()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.send = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId)
    order.sentAt = new Date()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.deliver = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId)
    order.deliveredAt = new Date()
    const updatedOrder = await order.save()
    const restaurant = await Restaurant.findByPk(order.restaurantId)
    const averageServiceTime = await restaurant.getAverageServiceTime()
    await Restaurant.update({ averageServiceMinutes: averageServiceTime }, { where: { id: order.restaurantId } })
    res.json(updatedOrder)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.show = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId']
      },
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'email', 'avatar', 'userType']
      },
      {
        model: Product,
        as: 'products'
      }]
    })
    res.json(order)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.analytics = async function (req, res) {
  const yesterdayZeroHours = moment().subtract(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  const todayZeroHours = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  try {
    const numYesterdayOrders = await Order.count({
      where:
      {
        createdAt: {
          [Op.lt]: todayZeroHours,
          [Op.gte]: yesterdayZeroHours
        },
        restaurantId: req.params.restaurantId
      }
    })
    const numPendingOrders = await Order.count({
      where:
      {
        startedAt: null,
        restaurantId: req.params.restaurantId
      }
    })
    const numDeliveredTodayOrders = await Order.count({
      where:
      {
        deliveredAt: { [Op.gte]: todayZeroHours },
        restaurantId: req.params.restaurantId
      }
    })

    const invoicedToday = await Order.sum(
      'price',
      {
        where:
        {
          createdAt: { [Op.gte]: todayZeroHours }, // FIXME: Created or confirmed?
          restaurantId: req.params.restaurantId
        }
      })
    res.json({
      restaurantId: req.params.restaurantId,
      numYesterdayOrders,
      numPendingOrders,
      numDeliveredTodayOrders,
      invoicedToday
    })
  } catch (err) {
    res.status(500).send(err)
  }
}
