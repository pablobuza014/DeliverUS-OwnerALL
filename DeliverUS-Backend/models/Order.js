'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      const OrderProducts = sequelize.define('OrderProducts', {
        quantity: DataTypes.INTEGER,
        unityPrice: DataTypes.DOUBLE
      })

      Order.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' })
      Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Order.belongsToMany(models.Product, { as: 'products', through: OrderProducts }, { onDelete: 'cascade' })
    }

    getStatus () {
      if (this.deliveredAt) { return 'delivered' }
      if (this.sentAt) { return 'sent' }
      if (this.startedAt) { return 'in process' }
      return 'pending'
    }
  }
  Order.init({
    createdAt: DataTypes.DATE,
    startedAt: DataTypes.DATE,
    sentAt: DataTypes.DATE,
    deliveredAt: DataTypes.DATE,
    price: DataTypes.DOUBLE,
    address: DataTypes.STRING,
    shippingCosts: DataTypes.DOUBLE,
    restaurantId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.getStatus()
      }
    }
  }, {
    sequelize,
    modelName: 'Order'
  })
  return Order
}
