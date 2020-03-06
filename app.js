const express = require('express')
const Datastore = require('nedb-promise')
let collectionsNEDB = {
    users: new Datastore({ filename: './data/users.db', autoload: true }),
    games: new Datastore({ filename: './data/games.db', autoload: true })
}
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
    // let games = db.collection("games")
    let data, games
    if (process.env.NODE_ENV == "development") {
        games = await collectionsNEDB.games.find({})
        if (games.length > 0) {
            res.json({ "games": games })
        } else {
            res.status(404).json("error")
        }
    } else {
        let cursor = await Database.collections.games.find({})
        data = await cursor.toArray()
    }
})

app.post("/register", async(req, res) => {

    // let collections = db.collection('users')
    let data, user, email

    if (process.env.NODE_ENV == 'development') {
        user = await collectionsNEDB.users.find({ username: req.body.username })
        email = await collectionsNEDB.users.find({ email: req.body.email })
    } else {
        user = await Database.collections.users.find({ username: req.body.username })
        email = await Database.collections.users.find({ username: req.body.username })
        data = await user.toArray()
        data = await email.toArray()
    }
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
            const result = await collectionsNEDB.users.insert(newUser)
            res.status(200).json({ message: 'user created' })
        } else {
            res.status(400).json({ error: 'ERROR_EMAIL_ALREADY_EXISTS' })
        }
    } else {
        res.status(400).json({ error: 'ERROR_USER_ALREADY_EXISTS' })
    }
})

async function run() {
    try {
        await Database.connect()
        const port = process.env.PORT || 5000
        app.listen(port, () =>
            console.log(`Server started on port ${port}!`)
        )
    } catch (error) {
        console.error(error.message)
    }

}
run()

//app.listen(8080, console.log("Server started"))