const { Sequelize } = require('sequelize')

const databaseHost = process.env.DATABASE_HOST
const databasePort = process.env.DATABASE_PORT
const databaseUsername = process.env.DATABASE_USERNAME
const databasePassword = process.env.DATABASE_PASSWORD
const databaseName = process.env.DATABASE_NAME

module.exports = {
  initSequelize: () => {
    return new Sequelize(databaseName, databaseUsername, databasePassword, {
      host: databaseHost,
      port: databasePort,
      dialect: 'mariadb'
      // logging: false
    })
  }
}
