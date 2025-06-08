import React from 'react';
import { useForm } from 'react-hook-form';
import { backendUrl } from '../App';

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        reset();
        alert(result.message || 'Message sent successfully!');
      } else {
        alert(result.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <section className="contact-section bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800">
          Get in Touch with Us
        </h2>
        <p className="text-center text-gray-600 mt-4 text-lg">
          We would love to hear from you. Reach out to us and we will get back to you as soon as possible.
        </p>

        <div className="mt-12 flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-lg font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'Name can only contain letters and spaces',
                    },
                  })}
                  className={`mt-2 w-full p-4 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none`}
                  placeholder="Your Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-lg font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  className={`mt-2 w-full p-4 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none`}
                  placeholder="Your Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="mt-6">
              <label className="block text-lg font-medium text-gray-700">Message</label>
              <textarea
                {...register('message', {
                  required: 'Message is required',
                  minLength: {
                    value: 10,
                    message: 'Message should be at least 10 characters',
                  },
                })}
                className={`mt-2 w-full p-4 border ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none`}
                rows="6"
                placeholder="Your Message"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-box btn-black mt-6"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
