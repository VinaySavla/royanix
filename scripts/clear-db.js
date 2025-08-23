// Clear database and reinitialize
const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://royanix:Royanix2025@royanix.uevqzlg.mongodb.net/?retryWrites=true&w=majority&appName=royanix'

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    const db = client.db()
    
    // Drop all collections
    const collections = ['products', 'categories', 'admins']
    
    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop()
        console.log(`✓ Dropped ${collectionName} collection`)
      } catch (error) {
        if (error.code === 26) {
          console.log(`⚠ Collection ${collectionName} doesn't exist`)
        } else {
          console.error(`Error dropping ${collectionName}:`, error.message)
        }
      }
    }
    
    await client.close()
    console.log('✅ Database cleared successfully!')
    
  } catch (error) {
    console.error('❌ Error clearing database:', error)
    process.exit(1)
  }
}

clearDatabase()
