const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { config } = require('../config')

const productSchema = new Schema({
  name: { 
    type: String, 
    require: true 
  },
  price: { 
    type: Number, 
    require: true 
  },
  size: { 
    type: String, 
    require: true 
  },
  image: { 
    type: String, 
    require: true,
    get: (image) => {
      return `${config.get('APP_URL')}/${image}`
    } 
  },

}, {
  timestamps: true, 
  toJSON: { getters: true },
  id: false
})

module.exports = mongoose.model('Product', productSchema, 'products')