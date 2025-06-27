import React from 'react';
import { useForm } from 'react-hook-form';
import { backendUrl } from '../App';

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
        alert(result.message || 'Thanks! We received your message.');
      } else {
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Let’s Start a Conversation</h2>
          <p className="text-gray-500 mt-4 text-lg">
            Whether you have questions, feedback, or just want to say hello — we’d love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Panel - Contact Info */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Reach us directly</h3>
            <p className="text-gray-600 mb-4">We’re here Monday through Friday, 10am – 6pm (NPT).</p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Email:</strong> support@yourshop.com</li>
              <li><strong>Phone:</strong> +977-1234567890</li>
              <li><strong>Address:</strong> Kathmandu, Nepal</li>
            </ul>
          </div>

          {/* Right Panel - Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Please enter your name',
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'Only letters and spaces allowed',
                    },
                  })}
                  className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Please enter a valid email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="example@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Your Message</label>
                <textarea
                  rows="5"
                  {...register('message', {
                    required: 'Please write your message',
                    minLength: {
                      value: 3,
                      message: 'Message must be at least 3 characters',
                    },
                  })}
                  className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Write your message here..."
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
