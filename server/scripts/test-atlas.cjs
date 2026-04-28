const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

async function test() {
  console.log('ATLAS_TEST_START')
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.error('ATLAS_ERR MONGO_URI missing')
    process.exit(1)
  }

  const hardTimeout = setTimeout(() => {
    console.error('ATLAS_ERR hard-timeout after 20s')
    process.exit(1)
  }, 20000)

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 12000 })
    clearTimeout(hardTimeout)
    console.log('ATLAS_OK')
    process.exit(0)
  } catch (error) {
    clearTimeout(hardTimeout)
    console.error('ATLAS_ERR', error.message)
    process.exit(1)
  }
}

test()
