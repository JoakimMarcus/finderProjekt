const express = require('express')
const Datastore = require('nedb-promise')
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

if (process.env.NODE_ENV == 'development') {
    Database = require('./database/nedb')
} else {
    Database = require('./database/mongo')
}

app.use(express.static('static'))

app.use(express.json())

app.post('/register', async(req, res) => {
    // let collections = db.collection('users')
    let user, email

    if (process.env.NODE_ENV == 'development') {
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
        errors.push('ERROR_PASSWORD_MISMATCH')
    } else if (user == false) {
        if (email == false) {
            let newUser = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                gender: '',
                age: '',
                city: '',
                games: req.body.games,
                usernameDiscord: req.body.usernameDiscord,
                usernameSteam: req.body.usernameSteam,
                usernameOrigin: req.body.usernameOrigin,
                match: []

            }
            if (process.env.NODE_ENV == 'development') {
                const result = await collectionsNEDB.users.insert(newUser)
                res.status(200).json({ message: 'SUCCESS' })

            } else {
                let db = await Database.connect()
                let users = db.collection('users')
                const result = await users.insert(newUser)
                res.status(200).json({ message: 'SUCCESS' })
            }
        } else {
            errors.push('ERROR_EMAIL_ALREADY_EXISTS')
        }
    } else {
        errors.push('ERROR_USER_ALREADY_EXISTS')
    }
    if (errors.length > 0) {
        res.status(400).json({ errors: errors })
    }
})

const auth = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const payload = jwt.verify(req.headers.authorization, 'hej')
            req.user = payload.userId
            next()
        } else {
            throw new Error('dilfjsdjklh')
        }
    } catch (error) {
        res.status(403).json({ error: error })
    }
}

app.post('/login', async(req, res) => {
    let user
    if (process.env.NODE_ENV == 'development') {
        user = await collectionsNEDB.users.find({})
    } else {
        let dataUser = await Database.collections.users.find({})
        user = await dataUser.toArray()
    }
    let matchedUser
    for (let i = 0; i < user.length; i++) {
        if (req.body.username == user[i].username && req.body.password == user[i].password) {
            matchedUser = user[i]
            break
        }
    }
    if (matchedUser) {
        const payload = { userId: matchedUser._id }
        const token = jwt.sign(payload, 'hej', { expiresIn: '60m' })
        res.json({ token, userId: matchedUser._id, })
    } else {
        res.status(403).json({ error: 'Invalid Credentials' })
    }
})

app.get('/secured', auth, (req, res) => {
    res.json({ message: `${req.user}` })
})

app.patch('/users/:id', auth, async(req, res) => {
    let result
    if (process.env.NODE_ENV == 'development') {
        result = await collectionsNEDB.users.update({ _id: req.params.id }, {
            $set: req.body
        })
    } else {
        let dataUser = await Database.collectionsNEDB.users.update({ _id: req.params.id }, {
            $set: req.body
        })
        result = await dataUser.toArray()
    }
    res.json(result)
})

app.patch('/match/:liked_user_name', auth, async(req, res) => {
    const matchResult = await collectionsNEDB.users.findOne({ _id: req.user })
    if (!matchResult.match.includes(req.params.liked_user_name)) {
        const result = await collectionsNEDB.users.update({ _id: req.user }, {
            $push: { 'match': req.params.liked_user_name }
        })
        res.json({ message: 'Liked' })
    } else {
        res.json({ error: 'You already liked this user!' })
    }


})

app.patch('/delete', auth, async(req, res) => {
    let result
    result = await collectionsNEDB.users.update({ _id: req.user }, {
        $pull: { match: req.body.match }
    })
    res.json(result)
})

app.delete('/deleteAccount/', auth, async(req, res) => {
    const findOne = await collectionsNEDB.users.findOne({ _id: req.user })
    if (req.body.deletePassword == findOne.password) {
        const result = await collectionsNEDB.users.remove({ _id: req.user })
        res.status(200).json({ message: 'Deleted' })
    } else {
        res.status(400).json({ error: 'Error' })
    }
})

app.get('/users', async(req, res) => {
    let matchList
    if (process.env.NODE_ENV == 'development') {
        matchList = await collectionsNEDB.users.find({})

    } else {
        let cursor = await Database.collections.users.find({})
        matchList = await cursor.toArray()
    }
    res.json({ 'matchList': matchList })
})

app.get('/games', async(req, res) => {
    // let games = db.collection('games')
    let games
    if (process.env.NODE_ENV == 'development') {
        games = await collectionsNEDB.games.find({})
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



// //app.js
// app.patch('/match/:liked_user_id', auth, async(req, res) => {
//         const loggedUser = await collectionsNEDB.users.findOne({ _id: req.user })​
//         if (!loggedUser.match.includes(req.params.liked_user_id)) {
//             const result = await collectionsNEDB.users.update({ _id: req.user }, {
//                 $push: { 'match': req.params.liked_user_id }
//             })
//             res.json(result)
//         } else {
//             res.json({ error: 'You already liked this user!' })
//         }
//     })​​
//     // script.js
//     ​
// async function likeUser(userId) {
//     const response = await fetch('/match/' + userId, {
//         headers: {
//             'Authorization': sessionStorage.getItem('token'),
//         }
//     })
//     const data = await response.json()
//     if (data.error) {
//         // Handle error
//     } else {
//         // User succesfully liked
//     }
// }