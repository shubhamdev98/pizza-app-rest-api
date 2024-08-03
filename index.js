const express = require('express')
require('./src/models')
const clc = require('cli-color')
const { config } = require('./src/config')
const app = express()
const PORT = config.get('APP_PORT') || 3001
const path = require('path')
const cors = require('cors')

// check request format
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// router's
app.use('/api/v1', require('./src/routes/user.routes.js'))
app.use('/api/v1', require('./src/routes/product.routes.js'))
app.use('/uploads', express.static(path.join(__dirname, './src/uploads')))

app.listen(PORT, (err) => {
  if (err) {
    console.log(clc.xterm(202)('Port is not connected'))
  } else {
    console.log(clc.xterm(11)(`Port is connected ${PORT} number.`))
  }
})