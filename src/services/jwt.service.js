const { config } = require('../config')
const jwt = require('jsonwebtoken')

class JwtService {
  static sign(payload, expiry = '30m', secret = config.get('JWT_SECRET')) {
    return jwt.sign(payload, secret, { expiresIn: expiry })
  }
  static verify(token, secret = config.get('JWT_SECRET')) {
    return jwt.verify(token, secret)
  }
}

module.exports = { JwtService }