import React from 'react';

const Contact = () => {
  return (
    <section className="contact-section bg-gray-100 py-16">
      <div className="container mx-auto px-4">

        {/* Title Section */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800">
          Get in Touch with Us
        </h2>
        <p className="text-center text-gray-600 mt-4 text-lg">
          We would love to hear from you. Reach out to us and we will get back to you as soon as possible.
        </p>

        {/* Contact Form */}
        <div className="mt-12 flex justify-center">
          <form className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Your Email"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-lg font-medium text-gray-700">Message</label>
              <textarea
                className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:outline-none"
                rows="6"
                placeholder="Your Message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn-box btn-black"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">Our Contact Information</h3>
          <p className="text-lg text-gray-600 mt-4">Feel free to reach out to us through the following methods:</p>

          <div className="mt-8 flex justify-center gap-12">
            {/* Address */}
            <div>
              <h4 className="text-xl font-medium text-gray-700">Address</h4>
              <p className="text-gray-600">1234 Main Street, City, Country</p>
            </div>

            {/* Phone */}
            <div>
              <h4 className="text-xl font-medium text-gray-700">Phone</h4>
              <p className="text-gray-600">(123) 456-7890</p>
            </div>

            {/* Email */}
            <div>
              <h4 className="text-xl font-medium text-gray-700">Email</h4>
              <p className="text-gray-600">contact@company.com</p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
            <h3 className="text-2xl font-semibold text-center text-gray-800">Find Us on the Map</h3>
            <div className="mt-4">
                <iframe 
                    className='rounded overflow-hidden'
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28266.31896594087!2d85.40386701738603!3d27.677434432067766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1aae42806ba1%3A0x5449e079404e5e82!2sBhaktapur!5e0!3m2!1sen!2snp!4v1739727385708!5m2!1sen!2snp" 
                    width="100%" 
                    height="450" 
                    style={{ border: '0' }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
