// Database cleanup script to fix any data inconsistencies
const { MongoClient, ObjectId } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://royanix:Royanix2025@royanix.uevqzlg.mongodb.net/?retryWrites=true&w=majority&appName=royanix'

async function cleanupDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    const db = client.db()
    
    // First, get all categories
    const categories = await db.collection('categories').find({}).toArray()
    console.log(`Found ${categories.length} categories`)
    
    // Get all products
    const products = await db.collection('products').find({}).toArray()
    console.log(`Found ${products.length} products`)
    
    let fixedCount = 0
    
    // Fix products with string categories or null categories
    for (const product of products) {
      let needsUpdate = false
      let updateData = {}
      
      // If category is a string, try to find matching category by name
      if (typeof product.category === 'string') {
        const matchingCategory = categories.find(cat => cat.name === product.category)
        if (matchingCategory) {
          updateData.category = matchingCategory._id
          needsUpdate = true
          console.log(`Converting product "${product.name}" category from string "${product.category}" to ObjectId`)
        } else {
          // If no matching category found, assign to first category or create one
          if (categories.length > 0) {
            updateData.category = categories[0]._id
            needsUpdate = true
            console.log(`Assigning product "${product.name}" to default category "${categories[0].name}"`)
          }
        }
      }
      
      // If category is null or undefined, assign to first category
      if (!product.category && categories.length > 0) {
        updateData.category = categories[0]._id
        needsUpdate = true
        console.log(`Assigning product "${product.name}" to default category "${categories[0].name}"`)
      }
      
      // Remove old fields if they exist
      const fieldsToRemove = ['ingredients', 'instructions', 'benefits']
      fieldsToRemove.forEach(field => {
        if (product[field] !== undefined) {
          updateData[`$unset`] = { ...updateData[`$unset`], [field]: "" }
          needsUpdate = true
        }
      })
      
      if (needsUpdate) {
        if (updateData[`$unset`]) {
          await db.collection('products').updateOne(
            { _id: product._id },
            { 
              $set: { category: updateData.category },
              $unset: updateData[`$unset`]
            }
          )
        } else {
          await db.collection('products').updateOne(
            { _id: product._id },
            { $set: updateData }
          )
        }
        fixedCount++
      }
    }
    
    console.log(`✅ Fixed ${fixedCount} products`)
    
    await client.close()
    console.log('✅ Database cleanup completed!')
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error)
    process.exit(1)
  }
}

// Run cleanup
cleanupDatabase()
