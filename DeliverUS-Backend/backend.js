const express = require('express')
const cors = require('cors')
require('dotenv').config()
const path = require('path')
const helmet = require('helmet')

const app = express()
app.use(express.json()) // parser de requests body como json
app.use(cors()) // habilita peticiones desde otro dominio
app.use(helmet({ // seguridad general en servicios REST
  crossOriginResourcePolicy: false // permite carga de imágenes del archivo public
}))

app.use('/public', express.static(path.join(__dirname, '/public')))// Serves resources from public folder

// require only admits one parameter, so we need to create an object composed of both parameters needed on routes
const requireOptions = { app }
require('./routes/')(requireOptions)

const { initPassport } = require('./config/passport')
initPassport()

const { initSequelize } = require('./config/sequelize')
const sequelize = initSequelize()

sequelize.authenticate()
  .then(() => {
    console.info('INFO - Database connected.')
    const port = process.env.APP_PORT || 3000
    return app.listen(port)
  })
  .then((server) => {
    console.log('Deliverus listening at http://localhost:' + server.address().port)
  })
  .catch(err => {
    console.error('ERROR - Unable to connect to the database:', err)
  })
