const { registerController, loginController, profileController, refreshController, logoutController } = require('./auth/user.controller.js')
const { productController } = require('./products/product.controller.js')

module.exports = { 
  
  // user
  registerController, 
  loginController,
  profileController,
  refreshController,
  logoutController,

  // product
  productController
}