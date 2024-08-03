require('dotenv').config()

const _config = {
  APP_PORT :  process.env.APP_PORT,
  DEBUG_MODE : process.env.DEBUG_MODE,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  APP_URL: process.env.APP_URL
} 

// exports.config = Object.freeze(_config) 

exports.config = {
  get(key) {
    const value = _config[key]
    if (!value) {
      console.log(`The ${key} variable is not found. Make sure to pass environment variables`)
      process.exit()
    } else {
      return _config[key]
    }
  } 
}