const { config } = require('../config')
const { ValidationError } = require('joi')
const CustomErrorHandler = require('../services/CustomError.service.js')

const errorHandler = (err, req, res, next) => {
  let success = false
  let statusCode = 500
  let data = {
    message: 'Internal server error',
    ...(config.get('DEBUG_MODE') === 'true' && { originalError : err.message })
  }

  if (err instanceof ValidationError) {
    success = false
    statusCode = 422
    data = {
      message: err.message
    }
  }

  if (err instanceof CustomErrorHandler) {
    success = false
    statusCode = err.status
    data = {
      message : err.message
    }
  }

  return res.status(statusCode).jsonp({ success, data })
}

module.exports = errorHandler