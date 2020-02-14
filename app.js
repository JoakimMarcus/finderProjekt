const express = require('express')
const Datastore = require('nedb-promise')
const users = new Datastore({ filename: './data/users.db', autoload: true })
const app = express()

app.use(express.json())

app.post("/users", async(req, res) => {
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
    res.json({ "result": result })
})

app.listen(8080, console.log("Server started", users))