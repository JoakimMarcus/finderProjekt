const express = require('express')
const authentication = require('./routes/authentication.js')
const profile = require('./routes/profile.js')
const matching = require('./routes/matching.js')
const index = require('./routes/index.js')
const Database = require('./database/nedb.js')
const fileUpload = require('express-fileupload')


const app = express()
const cors = require('cors')
app.use(cors())
require('dotenv').config()

// Middleware
app.use(express.static('static'))
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
}));

// Routes
app.use(authentication)
app.use(profile)
app.use(matching)
app.use(index)

async function run() {
    try {
        const port = process.env.PORT || 5000
        app.listen(port, () => console.log('Server started'))
    } catch (error) {}
}
run()