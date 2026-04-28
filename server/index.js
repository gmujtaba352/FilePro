import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import fileRoutes from './routes/fileRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

const testSchema = new mongoose.Schema({
  name: String,
})

const Test = mongoose.models.Test || mongoose.model('Test', testSchema)

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

const isServerAlreadyRunning = async (port) => {
  try {
    const response = await fetch(`http://localhost:${port}/api/health`)
    return response.ok
  } catch {
    return false
  }
}

app.get('/', (req, res) => {
  res.send('API is running')
})

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running' })
})

app.get('/insert-test', async (req, res) => {
  try {
    await Test.create({ name: 'FilePro Test' })
    res.send('Test data inserted')
  } catch (error) {
    res.status(500).send(`Failed to insert test data: ${error.message}`)
  }
})

// auth routes will be mounted here
app.use("/api/auth", authRoutes);
app.use('/api/files', fileRoutes)

const startServer = async () => {
  try {
    await connectDB()

    const server = app.listen(PORT, () => {
      console.log(`API is running on http://localhost:${PORT}`)
    })

    server.on('error', async (error) => {
      if (error.code === 'EADDRINUSE') {
        const alreadyRunning = await isServerAlreadyRunning(PORT)

        if (alreadyRunning) {
          console.log(`API is already running on http://localhost:${PORT}`)
          process.exit(0)
        }

        console.error(
          `Port ${PORT} is already in use. Stop the other process or set a different PORT in server/.env.`
        )
        process.exit(1)
      }

      console.error('Server listen error:', error.message)
      process.exit(1)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
