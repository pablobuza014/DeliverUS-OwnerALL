const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const UserController = require('../controllers/UserController')

module.exports = {
  initPassport: () => {
    passport.use(new BearerStrategy(
      async function (token, done) {
        try {
          const user = await UserController.findByToken(token)
          return done(null, user, { scope: 'all' })
        } catch (err) {
          return done(null, false, { message: err.message })
        }
      }
    ))
  }
}
