const express = require('express')
const Datastore = require('nedb-promise')
let collections = {
    users: new Datastore({ filename: './data/users.db', autoload: true }),
    games: new Datastore({ filename: './data/games.db', autoload: true })
}
const app = express()
const cors = require('cors')
app.use(cors())

app.use(express.json())

app.get("/games", async(req, res) => {
    let games = await collections.games.find({})
    if (games.length > 0) {
        res.json({ "games": game })
    } else {
        res.status(404).json("error")
    }
})

app.post("/register", async(req, res) => {
    let user = await collections.users.find({ username: req.body.username })
    let email = await collections.users.find({ email: req.body.email })
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