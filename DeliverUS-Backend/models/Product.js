'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      const OrderProducts = sequelize.define('OrderProducts', {
        quantity: DataTypes.INTEGER,
        unityPrice: DataTypes.DOUBLE
      })

      Product.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant', onDelete: 'cascade' })
      Product.belongsTo(models.ProductCategory, { foreignKey: 'productCategoryId', as: 'productCategory' })
      Product.belongsToMany(models.Order, { as: 'orders', through: OrderProducts })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    highlight: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    promoted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Fats: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 25.00
    },
    Proteins: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 50.00
    },
    Carbohydrates: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 25.00
    },
    Calories: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    description: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    image: DataTypes.STRING,
    order: DataTypes.INTEGER,
    availability: DataTypes.BOOLEAN,
    restaurantId: DataTypes.INTEGER,
    productCategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product'
  })
  return Product
}
