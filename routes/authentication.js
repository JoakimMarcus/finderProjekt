const { Router } = require('express')
const router = new Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Database = require('../database/nedb.js')
const auth = require('../assets/js/auth')



router.post('/register', async(req, res) => {
    let user, email
    if (process.env.NODE_ENV == 'development') {
        user = await Database.collections.users.find({ username: req.body.username })
        email = await Database.collections.users.find({ email: req.body.email })
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
            const password = req.body.password
            const hash = await bcrypt.hash(password, 10)
            console.log(hash)
            let newUser = {
                username: req.body.username,
                email: req.body.email,
                password: hash,
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
                const result = await Database.collections.users.insert(newUser)
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

router.post('/login', async(req, res) => {
    let user
    if (process.env.NODE_ENV == 'development') {
        user = await Database.collections.users.findOne({ username: req.body.username })
    } else {
        let dataUser = await Database.collections.users.findOne({ username: req.body.username })
        user = await dataUser.toArray()
    }
    if (user) {
        const correctPassword = await bcrypt.compare(req.body.password, user.password)
        if (correctPassword) {
            const payload = { userId: user._id }
            const token = jwt.sign(payload, 'hej', { expiresIn: '60m' })
            res.json({ token, userId: user._id, })
        } else {
            res.status(403).json({ error: 'Fel användarnamn eller lösenord' })
        }
    } else {
        res.status(404).json({ error: 'Användaren finns inte' })
    }
})

module.exports = router