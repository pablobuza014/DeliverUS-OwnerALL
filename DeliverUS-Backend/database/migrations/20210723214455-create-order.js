'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startedAt: {
        type: Sequelize.DATE
      },
      sentAt: {
        type: Sequelize.DATE
      },
      deliveredAt: {
        type: Sequelize.DATE
      },
      price: {
        type: Sequelize.DOUBLE
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shippingCosts: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      restaurantId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Restaurants'
          },
          key: 'id'
        }
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users'
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
    await queryInterface.createTable('OrderProducts', {
      orderId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Orders'
          },
          key: 'id'
        },
        onDelete: 'cascade'
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Products'
          },
          key: 'id'
        }
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      unityPrice: {
        allowNull: false,
        type: Sequelize.DOUBLE
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
    await queryInterface.addIndex(
      'OrderProducts',
      {
        fields: ['orderId', 'productId'],
        unique: true
      }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OrderProducts')
    await queryInterface.dropTable('Orders')
  }
}
