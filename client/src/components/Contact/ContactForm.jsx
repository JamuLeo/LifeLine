import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AiOutlineSend } from 'react-icons/ai';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/contact-request/submit', formData);
      if (data.success) {
        toast.success('Your message has been sent!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Submission failed');
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto -mt-12 px-6 py-10 bg-white rounded-xl shadow-2xl relative z-10 animate-fade-in"
    >
      <div className="grid gap-6 mb-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            className="border border-gray-300 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="example@email.com"
            className="border border-gray-300 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="What would you like to talk about?"
          className="border border-gray-300 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      <div className="mb-6 flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Write your message here..."
          className="border border-gray-300 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        ></textarea>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[var(--color-button)] hover:bg-[var(--color-button-dull)] text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 hover:scale-105"
        >
          <AiOutlineSend className="text-lg" />
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;

