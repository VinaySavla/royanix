import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductGrid from '../../components/ProductGrid'

export default function Products() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-primary-600">Eco-Friendly</span> Products
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our complete range of environmentally conscious cleaning solutions. 
            Each product is carefully formulated to deliver exceptional results while protecting our planet.
          </p>
        </div>

        {/* Product Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              All Products
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              All-Purpose
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              Kitchen
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              Bathroom
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              Floor Care
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              Glass & Surface
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              Specialty
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid />
      </div>

      <Footer />
    </div>
  )
}
