const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}` 
    const filenameWithExtension = path.basename(uniqueName)
    cb(null, filenameWithExtension)
  }
})
  
const handleMultiPartData = multer({ storage, limits: { fileSize: 10000000 * 10 } }).single('image')
module.exports = { handleMultiPartData }