const { Router } = require('express')
const router = new Router()
const Database = require('../database/nedb.js')
const jwt = require('jsonwebtoken')
const auth = require('../assets/js/auth')


router.patch('/match/:liked_user_name', auth, async(req, res) => {
    const matchResult = await Database.collections.users.findOne({ _id: req.user })
    if (!matchResult.match.includes(req.params.liked_user_name)) {
        const result = await Database.collections.users.update({ _id: req.user }, {
            $push: { 'match': req.params.liked_user_name }
        })
        res.json({ message: 'Liked' })
    } else {
        res.json({ error: 'You already liked this user!' })
    }
})

router.patch('/delete', auth, async(req, res) => {
    let result
    result = await Database.collections.users.update({ _id: req.user }, {
        $pull: { match: req.body.match }
    })
    res.json(result)
})

module.exports = router