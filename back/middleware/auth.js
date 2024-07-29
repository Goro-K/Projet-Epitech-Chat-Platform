import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const TOKEN = process.env.TOKEN

const requireAuth = async (req, res, next) => {
    const {authorization} = req.headers
    if (!authorization) {
        return res.status(403).json({error: 'You must be logged in'})
    }

    const token = authorization.replace('Bearer ', '')

    jwt.verify(token, TOKEN, (err, payload) => {
        if (err) {
            return res.status(403).json({error: 'You must be logged in'})
        }

        req.auth = payload
        next()
    })
}

export default requireAuth