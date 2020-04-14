const jwt = require('jsonwebtoken')

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

module.exports = auth