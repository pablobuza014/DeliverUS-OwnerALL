'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      highlight: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      promoted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      Fats: {
        type: Sequelize.DOUBLE,
        defaultValue: 25.00
      },
      Proteins: {
        type: Sequelize.DOUBLE,
        defaultValue: 50.00
      },
      Carbohydrates: {
        type: Sequelize.DOUBLE,
        defaultValue: 25.00
      },
      Calories: {
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      image: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      availability: {
        type: Sequelize.BOOLEAN
      },
      restaurantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Restaurants'
          },
          key: 'id'
        },
        onDelete: 'cascade'
      },
      productCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'ProductCategories'
          },
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products')
  }
}
