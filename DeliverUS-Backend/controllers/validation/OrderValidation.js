const { check } = require('express-validator')
const models = require('../../models')
const Product = models.Product
const Order = models.Order
const Restaurant = models.Restaurant

// Esta función comprueba si la orden aún no ha sido iniciada.
const checkOrderPending = async (value, { req }) => {
  try {
    const order = await Order.findByPk(req.params.orderId,
      {
        attributes: ['startedAt']
      })
    if (order.startedAt) { // Si la hora de inicio ya está establecida...
      return Promise.reject(new Error('The order has already been started'))
    } else {
      return Promise.resolve('ok')
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

// Esta función comprueba si la orden puede ser enviada.
const checkOrderCanBeSent = async (value, { req }) => {
  try {
    const order = await Order.findByPk(req.params.orderId,
      {
        attributes: ['startedAt', 'sentAt']
      })
    if (!order.startedAt) { // Si la hora de inicio aún no está establecida...
      return Promise.reject(new Error('The order is not started'))
    } else if (order.sentAt) { // Si la hora de envío ya está establecida...
      return Promise.reject(new Error('The order has already been sent'))
    } else {
      return Promise.resolve('ok')
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

// Esta función comprueba si la orden puede ser entregada.
const checkOrderCanBeDelivered = async (value, { req }) => {
  try {
    const order = await Order.findByPk(req.params.orderId,
      {
        attributes: ['startedAt', 'sentAt', 'deliveredAt']
      })
    if (!order.startedAt) { // Si la hora de inicio aún no está establecida...
      return Promise.reject(new Error('The order is not started'))
    } else if (!order.sentAt) { // Si la hora de envío aún no está establecida...
      return Promise.reject(new Error('The order is not sent'))
    } else if (order.deliveredAt) { // Si la hora de entrega ya está establecida...
      return Promise.reject(new Error('The order has already been delivered'))
    } else {
      return Promise.resolve('ok')
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports = {
  // TODO: Include validation rules for create that should:
  // 1. Check that restaurantId is present in the body and corresponds to an existing restaurant
  // 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
  // 3. Check that products are available
  // 4. Check that all the products belong to the same restaurant
  create: [
    check('restaurantId')
      .exists() // El restaurante debe existir.
      .isInt() // Debe corresponderse con un número de tipo entero.
      .custom(async (value) => {
        const restaurant = await Restaurant.findByPk(value) // Buscamos el restaurante por su ID.
        if (!restaurant) { // Si no encontramos el restaurante...
          return Promise.reject(new Error('The restaurant does not exist')) // ... devolvemos un mensaje de error diciendo que el restaurante no existe.
        } else {
          return Promise.resolve() // En caso contrario, devolvemos que se ha completado la búsqueda con éxito.
        }
      }),

    check('products')
      .custom((value, { req }) => {
        let existingProducts = true // Asignamos el valor true a la variable existingProducts
        let quantityProducts = true // Asignamos el valor true a la variable quantityProducts

        if (req.body.products.length < 1) { // Si el tamaño del producto es menor que 1...
          existingProducts = false // ... se asigna el valor false a la variable existingProducts
        }
        for (const product of req.body.products) {
          if (product.quantity < 1) { // Si la cantidad del producto es menor que 1...
            quantityProducts = false // ... se asigna el valor false a la variable quantityProducts
            break
          }
        }
        if (!(existingProducts && quantityProducts)) { // Si no existen productos y no hay cantidad de producto...
          return Promise.reject(new Error('Products have to exist and their quantity should be greater than 0')) // ... lanzamos un error.
        } else {
          return Promise.resolve() // En caso contrario, devolvemos que se ha completado la búsqueda con éxito.
        }
      }),

    check('products')
      .custom(async (value) => {
        const productoID = [] // Creamos una lista vacía
        value.forEach(item => productoID.push(item.productId)) // Recorremos los productos y guardamos sus ID en un array.
        const productosExistentes = await Product.findAll({ where: { id: productoID } }) // Obtenemos la lista de productos existentes.
        const productosDisponibles = productosExistentes.filter(product => product.availability) // Filtramos para obtener productos disponibles.

        if (productosDisponibles.length !== productoID.length) { // Si la cantidad de productos disponibles no es igual a la cantidad original,
          // entonces no todos los productos están disponibles.
          return Promise.reject(new Error('One or more products are not available')) // y, por tanto, lanzamos un error.
        }
        return Promise.resolve() // En caso contrario, devolvemos que se ha completado la búsqueda con éxito.
      }),

    check('products')
      .custom(async (value, { req }) => {
        const restaurantesID = new Set() // Creamos un nuevo conjunto vacío llamado "restaurantesID"
        for (const product of req.body.products) {
          const databaseProduct = await Product.findByPk(product.productId) // Busca el producto utilizando su ID y se añade a "databaseProduct"
          restaurantesID.add(databaseProduct.restaurantId) // Se añade al conjunto vacío el ID del restaurante asociado al producto
        }
        // Si hay más de un ID en el conjunto, significa que los productos no pertenecen a un solo restaurante, por lo que mandamos un error.
        if (restaurantesID.size > 1) { // Si hay más de un ID en el conjunto, significa que los productos no pertenecen a un solo restaurante
          return Promise.reject(new Error('All products must belong to the same restaurant')) // y, por tanto, devolvemos un mensaje de error, ya
          // que los productos deben estar asignados al mismo restaurante.
        } else if (!(restaurantesID.has(parseInt(req.body.restaurantId)))) { // Si no se cumple la condición anterior, se comprueba si el restaurantId
          // es un número que se encuentra en restaurantesID.
          return Promise.reject(new Error('All products must belong to the restaurant which we are ordering to')) // En su caso, se devuelve un mensaje de error,
          // ya que los productos deben estar relacionados con el restaurante al cual se ha hecho el pedido.
        } else {
          return Promise.resolve() // En caso contrario, devolvemos que se ha completado la búsqueda con éxito.
        }
      })
  ],

  // TODO: Include validation rules for update that should:
  // 1. Check that restaurantId is NOT present in the body.
  // 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
  // 3. Check that products are available
  // 4. Check that all the products belong to the same restaurant of the originally saved order that is being edited.
  // 5. Check that the order is in the 'pending' state.
  update: [
    // 1. Comprobamos que el restaurantId NO está presente en el cuerpo.
    check('restaurantId').not().exists(),

    // 2. Comprobamos que 'products' es un array no vacío que está compuesto de objetos con 'productId' y cuya cantidad es mayor que 0.
    check('products')
      .custom((value, { req }) => {
        let existingProducts = true // Variable booleana que utilizamos para indicar si los productos existen.
        let quantityProducts = true // Variable booleana que utilizamos para indicar si la cantidad de productos es mayor que 0.

        if (req.body.products.length < 1) { // Si la longitud del array de productos es menor que 1, entonces es porque no hay productos.
          existingProducts = false // Por tanto, cambiamos el valor de la variable booleana pertinente a falso.
        }

        // Recorremos todos los productos en el array.
        for (const product of req.body.products) { // Recorremos todos los productos del array.
          if (product.quantity < 1) { // Si la cantidad de un producto es menor que 1...
            quantityProducts = false // ... cambiamos el valor de la variable booleana correspondiente a falso
            break // y salimos del bucle.
          }
        }

        if (!(existingProducts && quantityProducts)) { // Si las variables booleanas de existencia de productos y de cantidad de productos son falsas...
          return Promise.reject(new Error('Products have to exist and their quantity should be greater than 0')) // rechazamos la solicitud lanzando un error.
        } else {
          return Promise.resolve() // En caso contrario, devolvemos que se ha completado la búsqueda con éxito.
        }
      }),

    // 3. Comprobamos si los productos están disponibles.
    check('products')
      .custom(async (value) => {
        const productoID = [] // Creamos una lista vacía
        value.forEach(item => productoID.push(item.productId)) // Recorremos los productos y guardamos sus ID en un array.
        const productosExistentes = await Product.findAll({ where: { id: productoID } }) // Obtenemos la lista de productos existentes.
        const productosDisponibles = productosExistentes.filter(product => product.availability) // Filtramos para obtener productos disponibles.

        if (productosDisponibles.length !== productoID.length) { // Si la cantidad de productos disponibles no es igual a la cantidad original,
          // entonces no todos los productos están disponibles
          return Promise.reject(new Error('One or more products are not available')) // y, por tanto, lanzamos un error.
        } else {
          return Promise.resolve() // En caso contrario, devolvemos que se ha completado la búsqueda con éxito.
        }
      }),

    // 4. Comprobamos que todos los productos pertenecen al mismo restaurante que la orden original que se está editando.
    check('products')
      .custom(async (value, { req }) => {
        // Obtenemos un conjunto de todos los ID de los restaurantes a los que pertenecen los productos.
        const restaurantesID = new Set()
        for (const product of req.body.products) {
          const databaseProduct = await Product.findByPk(product.productId)
          restaurantesID.add(databaseProduct.restaurantId)
        }

        if (restaurantesID.size > 1) { // Si hay más de un ID en el conjunto, significa que los productos no pertenecen a un solo restaurante
          return Promise.reject(new Error('All products must belong to the same restaurant')) // y, por tanto, lanzamos un error.
        } else {
          return Promise.resolve() // En caso contrario, devolvemos que se ha completado la búsqueda con éxito.
        }
      }),

    // 5. Comprobamos que la orden está en estado 'pendiente'.
    check('startedAt').custom(checkOrderPending)
  ],

  // TODO: Include validation rules for destroying an order that should check if the order is in the 'pending' state
  destroy: [
    check('startedAt').custom(checkOrderPending) // Sólo eliminamos aquellas órdenes que estén en el estado 'pendiente'.
  ],

  confirm: [
    check('startedAt').custom(checkOrderPending)
  ],
  send: [
    check('sentAt').custom(checkOrderCanBeSent)
  ],
  deliver: [
    check('deliveredAt').custom(checkOrderCanBeDelivered)
  ]
}
