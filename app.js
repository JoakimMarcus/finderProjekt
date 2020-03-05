const express = require('express')
const Datastore = require('nedb-promise')
const users = new Datastore({ filename: './data/users.db', autoload: true })
const games = new Datastore({ filename: './data/games.db', autoload: true })
const app = express()
const cors = require('cors')
app.use(cors())
require('dotenv').config()

let Database, db

if (process.env.NODE_ENV == "development") {
    Database = require("./nedb")
} else {
    Database = require("./mongo")
}


app.use(express.json())


app.get("/games", async(req, res) => {
    if (process.env.NODE_ENV == "development") {
        let game = await games.find({})
    } else {
        let cursor = collection.find({})
        data = await cursor.toArray()
    }
    if (game.length > 0) {
        res.json({ "game": game })
    } else {
        res.status(404).json("error")
    }
})

app.post("/register", async(req, res) => {
    let collections = db.collection('users')

    let data

    if (process.env.NODE_ENV == 'development') {
        data = await Database.collections.users.find({})
    } else {
        let cursor = await Database.collections.users.find({})
        data = await cursor.toArray()
    }
    res.json({ data: data })

    let user = await users.find({ username: req.body.username })
    let email = await users.find({ email: req.body.email })
    if (req.body.password !== req.body.repeatPassword) {
        res.status(400).json({ error: 'ERROR_PASSWORD_MISMATCH' })
    } else if (user == false) {
        if (email == false) {
            let newUser = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                games: req.body.games
            }
            const result = await users.insert(newUser)
            res.status(200).json({ message: 'user created' })
        } else {
            res.status(400).json({ error: 'ERROR_EMAIL_ALREADY_EXISTS' })
        }
    } else {
        res.status(400).json({ error: 'ERROR_USER_ALREADY_EXISTS' })
    }
})

app.listen(8080, console.log("Server started"))