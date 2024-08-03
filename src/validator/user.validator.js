const Joi = require('joi')

// Registartion schema
const registerSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).required(),
  last_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().pattern(/^\+91\s\d{10}$/).message('Invalid Indian phone number').required(),
  password: Joi.string().min(3).max(30).required().regex(/^[a-zA-Z0-9@#$%^&+=*]{3,30}$/),
  repeat_password: Joi.ref('password')
})

exports.registerValidateSchema = (req, res, next) => {
  const { error } = registerSchema.validate(req.body)
  if (error) {
    return next(error)
  } else {
    next()
  }
}

// Login schema
const loginSchema = Joi.object({
  value: Joi.alternatives().try(
    Joi.string().email(),
    Joi.string().pattern(/^\+[0-9]{1,3} [0-9]{10}$/) // Phone number format: +91 7621006587
  ).required(),
  password: Joi.string().min(3).max(30).required().regex(/^[a-zA-Z0-9@#$%^&+=*]{3,30}$/),
})

exports.loginValidationSchema = (req, res, next) => {
  const { error } = loginSchema.validate(req.body)
  if (error) {
    return next(error)
  } else {
    next()
  }
}

// Refresh schema
const refreshSchema = Joi.object({
  refresh : Joi.string().required()
})

exports.refreshValidationSchema = (req, res, next) => {
  const { error } = refreshSchema.validate(req.body)
  if (error) {
    return next(error)
  } else {
    next()
  }
}