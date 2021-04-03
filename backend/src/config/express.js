const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const https = require('https')
const http = require('http')

const fs = require('fs')

const routes = require('../api/routes/routes.js')

module.exports = () => {
  const app = express()

  app.use(bodyParser.json())
  app.use(cors())
  app.use('/assets', express.static('./assets'))
  app.use(routes)

  // Listen both http & https ports
  const httpServer = http.createServer(app)
  const httpsServer = https.createServer({
    key: fs.readFileSync('./config/key.pem'),
    cert: fs.readFileSync('./config/cert.pem')
  }, app)

  httpServer.listen(3334, () => {
    console.log('HTTP Server running on port 3334')
  })

  httpsServer.listen(3333, () => {
    console.log('HTTPS Server running on port 3333')
  })

  return app
}
