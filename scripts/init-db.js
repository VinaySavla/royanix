// Database initialization script
// Run this script once to set up the initial admin user, categories, and sample products

const { MongoClient, ObjectId } = require('mongodb')
const bcryptjs = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://royanix:Royanix2025@royanix.uevqzlg.mongodb.net/?retryWrites=true&w=majority&appName=royanix'

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    const db = client.db()
    
    console.log('Creating admin user...')
    
    // Check if admin exists
    const existingAdmin = await db.collection('admins').findOne({ username: 'admin' })
    
    if (!existingAdmin) {
      const hashedPassword = await bcryptjs.hash('admin123', 12)
      
      await db.collection('admins').insertOne({
        username: 'admin',
        email: 'admin@royanix.com',
        password: hashedPassword,
        role: 'superadmin',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      console.log('✓ Admin user created successfully')
      console.log('  Username: admin')
      console.log('  Password: admin123')
      console.log('  Email: admin@royanix.com')
    } else {
      console.log('✓ Admin user already exists')
    }
    
    console.log('Creating categories...')
    
    // Check if categories exist
    const existingCategories = await db.collection('categories').countDocuments()
    
    let categoryIds = {}
    
    if (existingCategories === 0) {
      const sampleCategories = [
        {
          name: 'All-Purpose',
          description: 'Versatile cleaners for everyday use around the home',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Kitchen',
          description: 'Specialized cleaners for kitchen surfaces and appliances',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Bathroom',
          description: 'Deep cleaning solutions for bathrooms and toilets',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Floor Care',
          description: 'Floor cleaners and polishes for all floor types',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Glass & Surface',
          description: 'Streak-free cleaners for windows, mirrors, and surfaces',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Specialty',
          description: 'Specialized cleaners for specific materials and surfaces',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      const categoryResult = await db.collection('categories').insertMany(sampleCategories)
      
      // Map category names to IDs
      const insertedCategories = await db.collection('categories').find({}).toArray()
      insertedCategories.forEach(cat => {
        categoryIds[cat.name] = cat._id
      })
      
      console.log(`✓ ${sampleCategories.length} categories created successfully`)
    } else {
      console.log(`✓ ${existingCategories} categories already exist in database`)
      
      // Get existing category IDs
      const existingCats = await db.collection('categories').find({}).toArray()
      existingCats.forEach(cat => {
        categoryIds[cat.name] = cat._id
      })
    }
    
    console.log('Creating sample products...')
    
    // Check if products exist
    const existingProducts = await db.collection('products').countDocuments()
    
    if (existingProducts === 0) {
      const sampleProducts = [
        {
          name: 'Eco All-Purpose Cleaner',
          description: 'A powerful, plant-based all-purpose cleaner that tackles grease, grime, and everyday messes while being gentle on surfaces and the environment. Made with natural surfactants and essential oils, this cleaner is safe for families and pets while being tough on dirt.',
          category: categoryIds['All-Purpose'],
          image: '',
          featured: true,
          active: true,
          size: '500ml',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Kitchen Degreaser Pro',
          description: 'Specially formulated to cut through kitchen grease and food residues with ease. Perfect for stovetops, ovens, range hoods, and countertops. Our plant-based formula breaks down grease naturally without harsh chemicals, making it food-safe and family-friendly.',
          category: categoryIds['Kitchen'],
          image: '',
          featured: true,
          active: true,
          size: '750ml',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Bathroom Deep Clean',
          description: 'Eliminate soap scum, water stains, and bathroom grime with this powerful yet gentle bathroom cleaner. Formulated with natural acids and plant extracts to fight mildew and bacteria while leaving a fresh, clean scent.',
          category: categoryIds['Bathroom'],
          image: '',
          featured: false,
          active: true,
          size: '500ml',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Crystal Clear Glass Cleaner',
          description: 'Achieve streak-free glass and mirror cleaning with our advanced formula. Made with purified water, white vinegar, and natural alcohols, this cleaner leaves surfaces crystal clear and sparkling clean without ammonia or harsh chemicals.',
          category: categoryIds['Glass & Surface'],
          image: '',
          featured: true,
          active: true,
          size: '500ml',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Floor Care Concentrate',
          description: 'Concentrated floor cleaner suitable for hardwood, tile, laminate, and vinyl floors. Our coconut-based formula dilutes with water for economical cleaning while protecting and preserving your floors natural beauty.',
          category: categoryIds['Floor Care'],
          image: '',
          featured: false,
          active: true,
          size: '1L',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Stainless Steel Polish',
          description: 'Specialty cleaner and polish designed specifically for stainless steel appliances and surfaces. Removes fingerprints, water spots, and smudges while leaving a protective coating that resists future marks and stains.',
          category: categoryIds['Specialty'],
          image: '',
          featured: false,
          active: true,
          size: '300ml',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Multi-Surface Disinfectant',
          description: 'Natural disinfectant that kills 99.9% of germs and bacteria on contact. Safe for use on all surfaces including countertops, doorknobs, and children toys. Made with plant-based antimicrobial agents and essential oils.',
          category: categoryIds['All-Purpose'],
          image: '',
          featured: true,
          active: true,
          size: '500ml',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Oven & Grill Cleaner',
          description: 'Heavy-duty cleaner for ovens, grills, and baked-on food residues. Our powerful plant-based formula cuts through carbonized grease and food particles without toxic fumes, making oven cleaning safer and easier.',
          category: categoryIds['Kitchen'],
          image: '',
          featured: false,
          active: true,
          size: '400ml',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      await db.collection('products').insertMany(sampleProducts)
      console.log(`✓ ${sampleProducts.length} sample products created successfully`)
    } else {
      console.log(`✓ ${existingProducts} products already exist in database`)
    }
    
    await client.close()
    console.log('✅ Database initialization completed successfully!')
    console.log('')
    console.log('You can now:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Visit the website: http://localhost:3000')
    console.log('3. Access admin portal: http://localhost:3000/admin')
    console.log('   - Username: admin')
    console.log('   - Password: admin123')
    
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
}

module.exports = { initializeDatabase }
