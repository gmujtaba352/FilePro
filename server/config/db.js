import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let memoryServer

const connectDB = async () => {
  const uri = process.env.MONGO_URI

  if (!uri) {
    throw new Error('MONGO_URI is not defined')
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    console.log('MongoDB Connected')
    return
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`)
  }

  memoryServer = await MongoMemoryServer.create()
  try {
    await mongoose.connect(memoryServer.getUri())
    console.log('MongoDB Connected (in-memory development instance)')
  } catch (error) {
    console.error(`In-memory MongoDB connection failed: ${error.message}`)
    throw error
  }
}

export default connectDB
