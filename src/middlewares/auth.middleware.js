const CustomErrorHandler = require('../services/CustomError.service.js')
const { JwtService } = require('../services/jwt.service.js')

exports.auth = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization
    
    if (!authHeader) {
      return next(CustomErrorHandler.invalidInput('Authorization token is missing'))
    }

    const token = authHeader.split(' ')[1]

    const { _id, role } = await JwtService.verify(token)

    req.user = {}
    req.user._id = _id
    req.user.role = role

    next()

  } catch (err) {
    return next(CustomErrorHandler.invalidInput('Unathorization token please check'))
  }
}