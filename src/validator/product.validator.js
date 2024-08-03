const Joi = require('joi')
const CustomErrorHandler = require('../services/CustomError.service.js')
const fs = require('fs')

// Product create validation
const productCreateSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  size: Joi.string().required(),
  image: Joi.string()
})

exports.productCreateValidationSchema = (req, res, next) => {
  const { error } = productCreateSchema.validate(req.body)
  if (error) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          return next(CustomErrorHandler.serverError(err.message))
        }
        next(error) 
      })
    } else {
      next(error)
    }
  } else {
    next()
  }
}

// Product update validation
const productUpdateSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  size: Joi.string(),
  image: Joi.string()
})

exports.productUpdateValidationSchema = (req, res, next) => {
  const { error } = productUpdateSchema.validate(req.body)
  if (error) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          return next(CustomErrorHandler.serverError(err.message))
        }
        next(error)
      })
    } else {
      next(error)
    }
  } else {
    next()
  }
}
