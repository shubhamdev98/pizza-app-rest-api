const express = require('express')
const router = express.Router()
const errorHandler = require('../middlewares/errorHandler.middleware.js')
const { auth } = require('../middlewares/auth.middleware.js')

const { 
  registerController, 
  loginController, 
  profileController, 
  refreshController, 
  logoutController 
} = require('../controllers') 

const { 
  registerValidateSchema, 
  loginValidationSchema, 
  refreshValidationSchema 
} = require('../validator/user.validator.js')

router.route('/user/register').post(registerValidateSchema, registerController.register) // user registration route
router.route('/user/login').post(loginValidationSchema, loginController.login) // user login route
router.route('/user/profile').get(auth, profileController.profile) // user profile route
router.route('/user/refresh').post(refreshValidationSchema, refreshController.refresh) // user refresh route
router.route('/user/logout').post(refreshValidationSchema, auth, logoutController.logout)
router.use(errorHandler)

module.exports = router