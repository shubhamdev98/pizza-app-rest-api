const express = require('express')
const router = express.Router()
const errorHandler = require('../middlewares/errorHandler.middleware.js')
const { auth } = require('../middlewares/auth.middleware.js')
const { admin } = require('../middlewares/admin.middleware.js')

const { productController } = require('../controllers')
const { productCreateValidationSchema, productUpdateValidationSchema } = require('../validator/product.validator.js')
const { handleMultiPartData } = require('../helper/imageUpload.helper.js')

router.route('/products/create').post(auth, admin, handleMultiPartData, productCreateValidationSchema, productController.create)
router.route('/products/update/:id').put(auth, admin, handleMultiPartData, productUpdateValidationSchema, productController.update)
router.route('/products/delete/:id').delete(auth, admin, productController.delete)
router.route('/products/get/all').get(productController.getAll)
router.route('/product/get/single/:id').get(productController.getSingle)
router.use(errorHandler)

module.exports = router