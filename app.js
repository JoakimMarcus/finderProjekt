const express = require('express')
const Datastore = require('nedb-promise')
const users = new Datastore({ filename: './data/users.db', autoload: true })
const games = new Datastore({ filename: './data/games.db', autoload: true })
const app = express()
const cors = require('cors')
app.use(cors())

app.use(express.json())

app.get("/games", async(req, res) => {
    let game = await games.find({})
    if (game.length > 0) {
        res.json({ "game": game })
    } else {
        res.status(404).json("error")
    }
})

app.post("/register", async(req, res) => {
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
                games: {
                    game1: req.body.game1,
                    game2: req.body.game2,
                    game3: req.body.game3
                }
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