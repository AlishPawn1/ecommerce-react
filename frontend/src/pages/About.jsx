import React from 'react'
import Title from '../components/Title'

const About = () => {
  return (
    <section className="about-section bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center text-3xl">
          {/* Title Section */}
          <Title text1={'About'} text2={'Us'} />
        </div>

        {/* About Content */}
        <div className="mt-12 text-center text-gray-700">
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed">
            We are a passionate team dedicated to bringing high-quality products and services.
          </p>
          <p className="mt-6 text-base sm:text-lg md:text-xl">
            Our mission is to revolutionize the way people interact with technology, providing innovative solutions that simplify everyday tasks and enhance productivity.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-2xl font-semibold text-gray-800">Our Mission</h3>
            <p className="mt-4 text-gray-600">
              We aim to make a positive impact on society through our cutting-edge products that serve as solutions for modern problems.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-2xl font-semibold text-gray-800">Our Values</h3>
            <p className="mt-4 text-gray-600">
              Integrity, customer satisfaction, and innovation are at the core of our values, driving everything we do.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-2xl font-semibold text-gray-800">Our Vision</h3>
            <p className="mt-4 text-gray-600">
              To become a leading force in the tech industry, known for our innovation, excellence, and customer-centric approach.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-800">Want to learn more? Reach out to us today!</p>
          <button className="btn-box btn-black">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  )
}

export default About
