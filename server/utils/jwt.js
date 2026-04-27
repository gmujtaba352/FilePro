import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_development'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET)
