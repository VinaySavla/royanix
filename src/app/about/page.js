import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Image from 'next/image'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-primary-600">Royanix</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We are committed to creating powerful, eco-friendly cleaning solutions that protect 
            both your family and our planet. Our mission is to prove that effective cleaning 
            doesn't have to come at the cost of environmental health.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded with a vision to revolutionize the cleaning industry, Royanix emerged 
                  from a simple belief: that powerful cleaning products should enhance our lives 
                  without harming the environment we call home.
                </p>
                <p>
                  Our journey began when we realized that traditional cleaning products often 
                  contained harsh chemicals that posed risks to families and ecosystems. We set 
                  out to create alternatives that would deliver "kingly clean" results using 
                  nature's own powerful ingredients.
                </p>
                <p>
                  Today, Royanix stands as a testament to innovation in eco-friendly cleaning. 
                  Every product in our line represents hours of research, testing, and refinement 
                  to ensure we deliver nothing but the best for our customers and the planet.
                </p>
              </div>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-primary-600">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-lg font-medium">Eco-Friendly Innovation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Environmental Stewardship</h3>
              <p className="text-gray-600">
                We are committed to protecting our planet through sustainable practices, 
                biodegradable formulas, and eco-conscious packaging solutions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Excellence</h3>
              <p className="text-gray-600">
                Every product undergoes rigorous testing to ensure it meets our high standards 
                for effectiveness, safety, and environmental responsibility.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Focus</h3>
              <p className="text-gray-600">
                We believe in building strong relationships with our customers, partners, 
                and communities to create a cleaner, healthier world together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Our Commitment to You</h2>
          <p className="text-lg mb-8">
            At Royanix, we promise to continue innovating and improving our products to serve you better. 
            Our commitment extends beyond just cleaning – we're dedicated to creating a sustainable future 
            where effective cleaning and environmental protection go hand in hand.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div>Eco-Friendly</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">0</div>
              <div>Harmful Chemicals</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">∞</div>
              <div>Innovation</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
