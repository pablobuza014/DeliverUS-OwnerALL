'use strict'
const models = require('../models')
const Order = models.Order
const Restaurant = models.Restaurant

const checkOrderOwnership = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: {
        model: Restaurant,
        as: 'restaurant'
      }
    })
    if (req.user.id === order.restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(404).send(err)
  }
}

// TODO: Implement the following function to check if the order belongs to current loggedIn customer (order.userId equals or not to req.user.id)
const checkOrderCustomer = async (req, res, next) => { // Se define una función asincrónica llamada checkOrderCustomer que toma tres parámetros: req, res y next
  try {
    const order = await Order.findByPk(req.params.orderId) // Se busca en la base de datos la orden que corresponde al ID proporcionado
    // en los parámetros de la solicitud, utilizando el modelo Order y el método findByPk. El resultado se almacena en la constante "order"
    if (req.user.id === order.userId) { // Se verifica si el ID del usuario que hizo la solicitud es igual al ID del usuario que creó la orden.
      return next() // Si son iguales, se llama al siguiente middleware.
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you') // Si los ID no son iguales, se envía una respuesta de estado 403
      // y un mensaje de error indicando que la entidad no pertenece al usuario.
    }
  } catch (err) {
    return res.status(404).send(err) // Si ocurre un error durante la búsqueda de la orden, se envía una respuesta de estado 404 ('Not found')
    // y se incluye el error en el cuerpo de la respuesta.
  }
}

const checkOrderVisible = (req, res, next) => {
  if (req.user.userType === 'owner') {
    checkOrderOwnership(req, res, next)
  } else if (req.user.userType === 'customer') {
    checkOrderCustomer(req, res, next)
  }
}

module.exports = {
  checkOrderOwnership,
  checkOrderCustomer,
  checkOrderVisible
}
