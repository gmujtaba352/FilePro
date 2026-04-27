import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated. Token missing.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' })
    }

    return res.status(401).json({ error: 'Invalid token' })
  }
}

export default protect
