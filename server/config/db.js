import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let memoryServer

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI
  const localFallbackUri = process.env.MONGO_FALLBACK_URI || 'mongodb://127.0.0.1:27017/filepro'
  const dbName = process.env.MONGO_DB_NAME

  if (!primaryUri) {
    throw new Error('MONGO_URI is not defined')
  }

  try {
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
      ...(dbName ? { dbName } : {}),
    })
    console.log('MongoDB Connected (primary URI)')
    return
  } catch (error) {
    console.error(`MongoDB primary connection failed: ${error.message}`)
  }

  try {
    await mongoose.connect(localFallbackUri, {
      serverSelectionTimeoutMS: 5000,
      ...(dbName ? { dbName } : {}),
    })
    console.log(`MongoDB Connected (local fallback: ${localFallbackUri})`)
    return
  } catch (error) {
    console.error(`MongoDB local fallback failed: ${error.message}`)
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
