const express = require("express")
const Datastore = require("nedb-promise")
let collectionsNEDB = {
    users: new Datastore({ filename: './data/users.db', autoload: true }),
    games: new Datastore({ filename: './data/games.db', autoload: true })
}
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
app.use(cors())
require('dotenv').config()


let Database, db

if (process.env.NODE_ENV == "development") {
    Database = require("./database/nedb")
} else {
    Database = require("./database/mongo")
}

app.use(express.static("static"))

app.use(express.json())


app.get("/games", async(req, res) => {
    // let games = db.collection("games")
    let games
    if (process.env.NODE_ENV == "development") {
        games = await collectionsNEDB.games.find({})
        if (games.length > 0) {
            res.json({ "games": games })
        } else {
            res.status(404).json("error")
        }
    } else {
        let cursor = await Database.collections.games.find({})
        games = await cursor.toArray()
        if (games.length > 0) {
            res.json({ "games": games })
        } else {
            res.status(404).json("error")
        }
    }
})

app.get("/users", async(req, res) => {
    let matchList
    if (process.env.NODE_ENV == "development") {
        matchList = await collectionsNEDB.users.find({})
        res.json({ "matchList": matchList })

    } else {
        let cursor = await Database.collections.users.find({})
        matchList = await cursor.toArray()
    }

})

app.post("/register", async(req, res) => {

    // let collections = db.collection('users')
    let user, email

    if (process.env.NODE_ENV == "development") {
        user = await collectionsNEDB.users.find({ username: req.body.username })
        email = await collectionsNEDB.users.find({ email: req.body.email })
    } else {
        dataUser = await Database.collections.users.find({ username: req.body.username })
        dataEmail = await Database.collections.users.find({ email: req.body.email })
        user = await dataUser.toArray()
        email = await dataEmail.toArray()
    }
    let errors = []
    if (req.body.password !== req.body.repeatPassword) {
        errors.push("ERROR_PASSWORD_MISMATCH")
    } else if (user == false) {
        if (email == false) {
            let newUser = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                games: req.body.games
            }
            if (process.env.NODE_ENV == "development") {
                const result = await collectionsNEDB.users.insert(newUser)
                res.status(200).json({ message: "SUCCESS" })

            } else {
                let db = await Database.connect()
                let users = db.collection("users")
                const result = await users.insert(newUser)
                res.status(200).json({ message: "SUCCESS" })
                console.log(result)
            }
        } else {
            errors.push("ERROR_EMAIL_ALREADY_EXISTS")
        }
    } else {
        errors.push("ERROR_USER_ALREADY_EXISTS")
    }
    if (errors.length > 0) {
        res.status(400).json({ errors: errors })
    }
})

const auth = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const payload = jwt.verify(req.headers.authorization, "hej")
            req.user = payload.userId
            next()
        } else {
            throw new Error("dilfjsdjklh")
        }
    } catch (error) {
        res.status(403).json({ error: 'Unauthorized' })
    }
}

app.post('/login', async(req, res) => {
    user = await collectionsNEDB.users.find({})
    console.log(req.body)
    for (let i = 0; i < user.length; i++) {
        console.log(user[i].username)
        console.log(user[i]._id)
        if (req.body.username == user[i].username && req.body.password == user[i].password) {
            const payload = { userId: user[i]._id }
            const token = jwt.sign(payload, "hej", { expiresIn: '20m' })
            res.json({ token })
            res.status(200).json({ message: 'loggedin' })
        }
    }
    res.status(403).json({ error: 'Invalid Credentials' })
})

app.get('/secured', auth, (req, res) => {
    res.json({ message: `You are user ${req.user}` })
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