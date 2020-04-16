const { Router } = require('express')
const router = new Router()
const bcrypt = require('bcryptjs')
const Database = require('../database/nedb.js')
const jwt = require('jsonwebtoken')
const auth = require('../assets/js/auth')


router.patch('/usersUpdate', auth, async(req, res) => {
    let result
    if (process.env.NODE_ENV == 'development') {
        result = await Database.collections.users.update({ _id: req.user }, {
            $set: req.body
        })
    } else {
        let dataUser = await Database.collections.users.update({ _id: req.user }, {
            $set: req.body
        })
        result = await dataUser.toArray()
    }
    res.json(result)
})

router.patch('/updatePassword', auth, async(req, res) => {
    let result
    const user = await Database.collections.users.findOne({ _id: req.user })
    const correctPassword = await bcrypt.compare(req.body.oldPassword, user.password)
    if (correctPassword) {
        if (req.body.newPassword != req.body.oldPassword) {
            if (req.body.newPassword == req.body.confirmPassword) {
                const hash = await bcrypt.hash(req.body.newPassword, 10)
                result = await Database.collections.users.update({ _id: req.user }, {
                    $set: { "password": hash }
                })
                res.status(200).json({ confirm: 'Lösen ändrat' })
            } else {
                res.status(400).json({ error: 'Stämmer inte!' })
            }
        } else {
            res.status(400).json({ error: 'Samma lösenord som du har nu' })
        }
    }
})

router.delete('/deleteAccount/', auth, async(req, res) => {
    const findOne = await Database.collections.users.findOne({ _id: req.user })
    const correctPassword = await bcrypt.compare(req.body.deletePassword, findOne.password)
    if (correctPassword) {
        const result = await Database.collections.users.remove({ _id: req.user })
        res.status(200).json({ message: 'Deleted' })
    } else {
        res.status(400).json({ error: 'Error' })
    }
})

// router.post('/theroute', auth, async(req, res) => {
//     let result
//     console.log(req.body.fileInput.files[0])
//     result = await Database.collections.users.update({ _id: req.user }, {
//         $set: { "img": req.body.fileInput.files[0] }
//     })
// })
module.exports = router