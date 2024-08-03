const { userSchema: _User, refreshTokenSchema: _Refresh } = require('../../models')
const { successMessage } = require('../../constant/success.constant.js')
const { JwtService } = require('../../services/jwt.service.js')
const { config } = require('../../config/index.js')
const CustomErrorHandler = require('../../services/CustomError.service.js')
const bcrypt = require('bcrypt')

// User register 
exports.registerController = {
  async register (req, res, next) {
    try {
      
      const { first_name, last_name, email, phone_number, password, repeat_password } = req.body

      /* Check email is already existed o not */ 
      const emailExisted = await _User.exists({ email: email })
      if (emailExisted) {
        return next(CustomErrorHandler.alreadyExist('This Email is already registered.'))
      }
      
      /* Check phone number is existed or not */
      const phoneExisted = await _User.exists({ phone_number: phone_number })
      if (phoneExisted) {
        return next(CustomErrorHandler.alreadyExist('This Phone number is already registered.'))
      }

      /* Check password and repeat_password both are same or not */
      if (password !== repeat_password) {
        return next(CustomErrorHandler.invalidInput('Password and reenter password is not match.'))
      }

      /* Hash Password */
      const hashedPassword = await bcrypt.hash(password, 10)

      /* Create Entry */
      const userCreated = new _User({
        first_name : first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        phone_number: phone_number,
      })

      const createEntry = await userCreated.save()

      // Access token generate
      const accessTokenGenerate = JwtService.sign({ _id: createEntry._id, role: createEntry.role })

      // Refresh token
      const refreshTokenGenerate = JwtService.sign({ _id: createEntry._id, role: createEntry.role }, '1m', config.get('REFRESH_SECRET'))

      await _Refresh.create({ token: refreshTokenGenerate }) // refresh token store in database

      res.status(201).jsonp(successMessage('Registration create successfull', { createEntry, access_token: accessTokenGenerate, refresh_token: refreshTokenGenerate }))

    } catch (err) {
      return next(err)
    }
  }
}

// User login 
exports.loginController = {
  async login(req, res, next) {
    try {
      const { value, password } = req.body

      // Determine whether the value is an email or a phone number
      const isEmail = value.includes('.')

      // Find the user based on the value
      const user = isEmail ? await _User.findOne({ email: value }) : await _User.findOne({ phone_number: value })
      const inputType = isEmail ? 'email' : 'phone number'

      // Validate user existence
      if (!user) {
        return next(CustomErrorHandler.invalidInput(`${inputType} and password is not Match`))
      }

      // Compare the password
      const matchPassword = await bcrypt.compare(password, user.password)
      if (!matchPassword) {
        return next(CustomErrorHandler.invalidInput(`${inputType} and password is not Match`))
      }

      // Generate access token
      const accessTokenGenerate = JwtService.sign({ _id: user._id, role: user.role })
      
      // Generate refresh token
      const refreshTokenGenerate = JwtService.sign({ _id: user._id, role: user.role }, '1m', config.get('REFRESH_SECRET'))

      res.status(200).jsonp(successMessage('Login successfully', { accessTokenGenerate, refreshTokenGenerate }))

    } catch (err) {
      return next(err)
    }
  }
}

// User profile get
exports.profileController = {
  async profile(req, res, next) {
    try {
      const getProfile = await _User.findOne({ _id: req.user._id }).select('-password -updatedAt -__v')
      if (!getProfile) {
        return next(CustomErrorHandler.notFound('User is not found'))
      }
      res.status(200).jsonp(successMessage('User profile get successfully', { userProfile: getProfile }))
    } catch (err) {
      return next(err)
    }
  }
}

// Refresh token match
exports.refreshController = {
  async refresh(req, res, next) {
    try {
      const { refresh } = req.body
      const refreshToken = await _Refresh.findOne({ token: refresh })

      if (!refreshToken) {
        return next(CustomErrorHandler.invalidInput('Invalid refresh token'))
      }

      const { _id } = await JwtService.verify(refreshToken.token, config.get('REFRESH_SECRET'))

      const userId = _id
      const user = await _User.findOne({ _id: userId })
      if (!user) {
        return next(CustomErrorHandler.invalidInput('No user found'))
      }

      // Access token
      const accessTokenGenerate = JwtService.sign({ _id: user._id, role: user.role })

      // Refresh token
      const refreshTokenGenerate = JwtService.sign({ _id: user._id, role: user.role }, '1m', config.get('REFRESH_SECRET'))

      await _Refresh.create({ token: refreshTokenGenerate }) // refresh token store in database
      res.status(200).jsonp(successMessage('Refresh token is match', { accessToken: accessTokenGenerate, refreshToken: refreshTokenGenerate }))

    } catch (err) {
      return next(err)
    }
  }
}

// logout user
exports.logoutController = {
  async logout(req, res, next) {
    try {
      const { refresh } = req.body
      await _Refresh.deleteOne({ token: refresh })
      res.status(200).jsonp(successMessage('User logout successfully'))
    } catch (err) {
      return next(err)
    }
  }
}