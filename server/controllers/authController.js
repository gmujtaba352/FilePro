import User from '../models/User.js'
import { signToken } from '../utils/jwt.js'

const sendAuthResponse = (res, statusCode, user, token) => {
  res.status(statusCode).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ error: 'Email is already registered' })
    }

    const user = await User.create({ name, email, password })
    const token = signToken(user._id)

    sendAuthResponse(res, 201, user, token)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((entry) => entry.message)
      return res.status(400).json({ error: messages.join(', ') })
    }

    console.error('Register error:', error)
    res.status(500).json({ error: 'Server error during registration' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signToken(user._id)
    sendAuthResponse(res, 200, user, token)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error during login' })
  }
}

export const me = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  })
}
