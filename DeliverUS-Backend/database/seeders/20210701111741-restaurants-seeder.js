'use strict'
const fs = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {})
    */

    module.exports.copyFiles()

    await queryInterface.bulkInsert('Restaurants',
      [
        { name: 'Casa Félix', messageToFans: 'Fuera de carta tenemos albóndigas caseras, muy ricas', description: 'Cocina Tradicional', address: 'Av. Reina Mercedes 51, Sevilla', postalCode: '41012', url: 'https://goo.gl/maps/GZEfzge4zXz6ySLR8', restaurantCategoryId: 1, shippingCosts: 2.5, email: 'casafelix@restaurant.com', logo: process.env.RESTAURANTS_FOLDER + '/casaFelixLogo.jpeg', phone: 954123123, createdAt: new Date(), updatedAt: new Date(), userId: 2, status: 'closed' },
        { name: '100 montaditos', messageToFans: 'Miércoles y Domingos, todo al 50%', description: 'Una forma divertida y variada de disfrutar de la comida. Un lugar para compartir experiencias y dejarse llevar por el momento.', address: 'Av. de la Reina Mercedes, 43, Sevilla', postalCode: '41012', logo: process.env.RESTAURANTS_FOLDER + '/100MontaditosLogo.jpeg', heroImage: process.env.RESTAURANTS_FOLDER + '/100MontaditosHero.jpeg', url: 'http://spain.100montaditos.com/', restaurantCategoryId: 2, shippingCosts: 1.5, email: 'attcliente@gruporestalia.com', phone: '+34902197494', createdAt: new Date(), updatedAt: new Date(), userId: 2, status: 'online' },
        { name: '1000 productos', description: '1000 productos', address: 'Av. de la Reina Mercedes, 43, Sevilla', postalCode: '41012', logo: '', heroImage: '', url: 'http://1000productos.com/', restaurantCategoryId: 2, shippingCosts: 1.5, email: 'attcliente@gruporestalia.com', phone: '+34902197494', createdAt: new Date(), updatedAt: new Date(), userId: 2, status: 'online' },
        { name: '0 productos', description: '0 productos', address: 'Av. de la Reina Mercedes, 43, Sevilla', postalCode: '41012', logo: '', heroImage: '', url: 'http://1000productos.com/', restaurantCategoryId: 2, shippingCosts: 1.5, email: 'attcliente@gruporestalia.com', phone: '+34902197494', createdAt: new Date(), updatedAt: new Date(), userId: 2, status: 'closed' },
        { name: '30 productos', description: '1000 productos', address: 'Av. de la Reina Mercedes, 43, Sevilla', postalCode: '41012', logo: '', heroImage: '', url: 'http://1000productos.com/', restaurantCategoryId: 2, shippingCosts: 1.5, email: 'attcliente@gruporestalia.com', phone: '+34902197494', createdAt: new Date(), updatedAt: new Date(), userId: 2, status: 'online' },
        { name: '50 productos', description: '1000 productos', address: 'Av. de la Reina Mercedes, 43, Sevilla', postalCode: '41012', logo: '', heroImage: '', url: 'http://1000productos.com/', restaurantCategoryId: 2, shippingCosts: 1.5, email: 'attcliente@gruporestalia.com', phone: '+34902197494', createdAt: new Date(), updatedAt: new Date(), userId: 2, status: 'online' },
        { name: '100 productos', description: '1000 productos', address: 'Av. de la Reina Mercedes, 43, Sevilla', postalCode: '41012', logo: '', heroImage: '', url: 'http://1000productos.com/', restaurantCategoryId: 2, shippingCosts: 1.5, email: 'attcliente@gruporestalia.com', phone: '+34902197494', createdAt: new Date(), updatedAt: new Date(), userId: 2, status: 'online' },
        { name: '200 productos', description: '1000 productos', address: 'Av. de la Reina Mercedes, 43, Sevilla', postalCode: '41012', logo: '', heroImage: '', url: 'http://1000productos.com/', restaurantCategoryId: 2, shippingCosts: 1.5, email: 'attcliente@gruporestalia.com', phone: '+34902197494', createdAt: new Date(), updatedAt: new Date(), userId: 2, status: 'online' },
        { name: '1 producto', description: '1 producto', address: 'Av. de la Reina Mercedes, 43, Sevilla', postalCode: '41012', logo: '', heroImage: '', url: 'http://1000productos.com/', restaurantCategoryId: 2, shippingCosts: 1.5, email: 'attcliente@gruporestalia.com', phone: '+34902197494', createdAt: new Date(), updatedAt: new Date(), userId: 2, status: 'online' }
      ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {})
     */

    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
        await sequelize.query('TRUNCATE TABLE Restaurants', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.log(error)
    }
  },
  copyFiles: () => {
    const originDir = 'example_api_client/example_assets/'
    const destinationDir = process.env.RESTAURANTS_FOLDER + '/'
    console.error(destinationDir)
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true })
    }

    fs.copyFile(originDir + 'casaFelixLogo.jpeg', destinationDir + 'casaFelixLogo.jpeg', (err) => {
      if (err) throw err
    })
    fs.copyFile(originDir + '100MontaditosLogo.jpeg', destinationDir + '100MontaditosLogo.jpeg', (err) => {
      if (err) throw err
    })
    fs.copyFile(originDir + '100MontaditosHero.jpeg', destinationDir + '100MontaditosHero.jpeg', (err) => {
      if (err) throw err
    })
  }
}
