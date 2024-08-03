const CustomErrorHandler = require('../services/CustomError.service.js')
const { userSchema: _User } = require('../models')

exports.admin = async (req, res, next) => {
  try {
    const user = await _User.findOne({ _id: req.user._id })
    if (user.role === 'admin') {
      next()
    } else {
      return next(CustomErrorHandler.unauthorized('Unathorization'))
    }
  } catch (err) {
    return next(CustomErrorHandler.serverError('Internal server error is'))
  }
}