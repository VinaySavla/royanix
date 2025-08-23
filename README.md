# Royanix - Eco-Friendly Cleaning Products Website

A professional Next.js website for Royanix, showcasing eco-friendly cleaning products with an admin portal for product management.

## Features

### Frontend
- 🌿 Modern, eco-friendly design with green and yellow color scheme
- 📱 Fully responsive layout
- 🏠 Professional homepage with hero section and featured products
- 📦 Products catalog with category filtering
- ℹ️ About us page highlighting environmental commitment
- 📞 Contact page with contact form
- 🖼️ Product image support

### Admin Portal
- 🔐 Secure login system with JWT authentication
- 📊 Dashboard with product statistics
- ✏️ Full CRUD operations for products
- 🏷️ Product categorization
- ⭐ Featured products management
- 📝 Rich product details (ingredients, benefits, instructions)

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, JavaScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd royanix
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
# Copy .env.local and update with your values
cp .env.local .env.local
\`\`\`

Update the environment variables:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens

4. Create an admin user (run this script once)
\`\`\`bash
# You'll need to create a script or manually add an admin user to MongoDB
\`\`\`

5. Run the development server
\`\`\`bash
npm run dev
\`\`\`

The website will be available at [http://localhost:3000](http://localhost:3000)

## Usage

### Public Website
- Browse products at `/products`
- Learn about the company at `/about`
- Contact information at `/contact`

### Admin Portal
- Access admin login at `/admin`
- Manage products at `/admin/dashboard`
- Default credentials: Create your admin user in MongoDB

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── products/          # Product pages
│   └── ...
├── components/            # React components
├── lib/                   # Utility libraries
└── models/               # Mongoose models
\`\`\`

## Environment Variables

\`\`\`bash
MONGODB_URI=mongodb://localhost:27017/royanix-db
JWT_SECRET=your-super-secret-jwt-key
\`\`\`

## Deployment

1. Build the project
\`\`\`bash
npm run build
\`\`\`

2. Start production server
\`\`\`bash
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email royanix@gmail.com or create an issue in the repository.
