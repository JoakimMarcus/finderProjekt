const { Router } = require('express')
const router = new Router()
const Database = require('../database/nedb.js')
const jwt = require('jsonwebtoken')

router.get('/users', async(req, res) => {
    let matchList
    if (process.env.NODE_ENV == 'development') {
        matchList = await Database.collections.users.find({})
    } else {
        let cursor = await Database.collections.users.find({})
        matchList = await cursor.toArray()
    }
    res.json({ 'matchList': matchList })
})

router.get('/games', async(req, res) => {
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

module.exports = router