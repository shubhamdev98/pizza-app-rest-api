const { successMessage } = require('../../constant/success.constant.js')
const CustomErrorHandler = require('../../services/CustomError.service.js')
const { productSchema: _Product } = require('../../models')
const fs = require('fs')
const path = require('path')

exports.productController = {
  
  async create(req, res, next) {
    const { name, price, size } = req.body
    const image = req.file.path
    const imagePath = `uploads/${ path.basename(image)}`

    try {
      const createProduct = await _Product.create({ 
        name: name, 
        price: price, 
        size: size, 
        image: imagePath
      })
      res.status(200).jsonp(successMessage('Product create successfully', { createProduct }))
    } catch (err) {
      return next(err)
    }
  },

  async update(req, res, next) {
    const { name, price, size } = req.body
    const { id } = req.params
    console.log(id)
    try {
      let imagePath
      if (req.file) {
        let image = req.file.path
        imagePath = `uploads/${ path.basename(image)}`
      }
      const updateProduct = await _Product.findOneAndUpdate({ _id: id }, { 
        name: name, 
        price: price, 
        size: size, 
        ...(req.file && { image : imagePath })
      }, { new: true })
      res.status(200).jsonp(successMessage('Product update successfully', { updateProduct }))
    } catch (err) {
      return next(err)
    }
  },

  async delete (req, res, next) {
    const { id } = req.params
    try {

      const deleteProduct = await _Product.findByIdAndDelete({ _id: id })

      if (!deleteProduct) {
        return next(CustomErrorHandler.notFound('Product is not found !'))
      }

      const imagePath = deleteProduct._doc.image
      console.log(imagePath)

      const fileName = path.basename(imagePath)
      const fullPath = path.join(__dirname, '../../uploads', fileName)

      fs.unlink(fullPath, (error) => {
        if (error) {
          return next(CustomErrorHandler.serverError('Internal server Error'))
        }
        res.status(200).jsonp(successMessage('Product delete successfully', { deleteProduct }))
      })

    } catch (err) {
      return next(err)
    }
  },

  async getAll (req, res, next) {
    try {
      const getAllProduct = await _Product.find().select('-updatedAt -__v').sort({ _id: -1 })
  
      if (!getAllProduct || getAllProduct.length === 0) {
        return next(CustomErrorHandler.notFound('Product is not found'))
      }  
  
      res.status(200).jsonp(successMessage('All product get successfully', getAllProduct))
    } catch (err) {
      return next(err)
    }
  },

  async getSingle (req, res, next) {
    try {
      const { id } = req.params
      const getSingleProduct = await _Product.findOne({ _id : id }).select('-updatedAt -__v')
      res.status(200).jsonp(successMessage('Single product get successfully', getSingleProduct))
    } catch (err) {
      return next(err)
    }
  }

}