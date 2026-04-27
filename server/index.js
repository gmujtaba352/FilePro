import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

const testSchema = new mongoose.Schema({
  name: String,
})

const Test = mongoose.models.Test || mongoose.model('Test', testSchema)

app.use(cors())
app.use(express.json())

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

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`API is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
