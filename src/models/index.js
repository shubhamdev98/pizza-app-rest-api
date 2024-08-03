const userSchema = require('./user.model.js')
const refreshTokenSchema = require('./refresh.model.js')
const productSchema = require('./product.model.js')
const mongoose = require('mongoose')
const { config } = require('../config')
const clc = require('cli-color')

// Database connection
mongoose.connect(config.get('DB_URL'), {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(clc.xterm(50)('Database is connected...'))
}).catch((err) => {
  console.log(clc.xterm(202)('Database connection error:'), err)
})

module.exports = { 
  userSchema, 
  refreshTokenSchema,
  productSchema
}