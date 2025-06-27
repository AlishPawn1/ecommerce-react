import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Intro Title */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-800">About Our Brand</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Where tradition meets innovation — delivering quality you can trust.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src={assets.about_img}
              alt="Our Story"
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed">
              We are a passionate team driven by craftsmanship and culture. Every product we create tells a story of heritage,
              quality, and community. From handcrafted garments to unique accessories, we strive to blend tradition with today’s modern lifestyle.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Founded with a belief in celebrating identity, we empower artisans and bring meaningful products to people around the world.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Authenticity</h3>
            <p className="text-gray-600">Every product is rooted in tradition and made with genuine intention.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality</h3>
            <p className="text-gray-600">Crafted with premium materials and attention to detail you can feel.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Community</h3>
            <p className="text-gray-600">We support local artisans and give back to the communities we work with.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Want to collaborate or learn more?</h2>
          <p className="text-gray-600 mt-2">We’d love to hear from you. Reach out and let’s connect!</p>
          <a
            href="/contact"
            className="white-btn btn mt-5"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
