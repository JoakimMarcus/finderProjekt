const express = require('express')
const authentication = require('./routes/authentication.js')
const profile = require('./routes/profile.js')
const matching = require('./routes/matching.js')
const Database = require('./database/nedb.js')

// 
const app = express()
const cors = require('cors')
app.use(cors())
require('dotenv').config()

// Middleware
app.use(express.static('static'))
app.use(express.json())


// Routes
app.use(authentication)
app.use(profile)
app.use(matching)



app.get('/users', async(req, res) => {
    let matchList
    if (process.env.NODE_ENV == 'development') {
        matchList = await Database.collections.users.find({})
    } else {
        let cursor = await Database.collections.users.find({})
        matchList = await cursor.toArray()
    }
    res.json({ 'matchList': matchList })
})


app.get('/games', async(req, res) => {
    let games
    if (process.env.NODE_ENV == 'development') {
        games = await Database.collections.games.find({})
        if (games.length > 0) {
            res.json({ 'games': games })
        } else {
            res.status(404).json('error')
        }
    } else {
        let cursor = await Database.collections.games.find({})
        games = await cursor.toArray()
        if (games.length > 0) {
            res.json({ 'games': games })
        } else {
            res.status(404).json('error')
        }
    }
})


async function run() {
    try {
        const port = process.env.PORT || 5000
        app.listen(port)
    } catch (error) {}
}
run()