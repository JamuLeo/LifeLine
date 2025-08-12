import React from 'react';
import { FiMail } from 'react-icons/fi';
import { Parallax } from 'react-scroll-parallax';

const ContactIntro = ({ onScrollToForm }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dull)] text-white px-4 sm:px-8 md:px-16 py-24 text-center shadow-xl rounded-xl">

      {/* ✨ Parallax blurred background blobs */}
      <Parallax speed={-10}>
        <div className="absolute -top-10 -left-10 w-52 h-52 bg-white opacity-10 rounded-full blur-3xl z-0" />
      </Parallax>
      <Parallax speed={5}>
        <div className="absolute bottom-0 -right-20 w-60 h-60 bg-white opacity-10 rounded-full blur-2xl z-0" />
      </Parallax>

      {/* ✨ Parallax wave SVG */}
      <Parallax speed={10}>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 text-white opacity-5">
            <path
              d="M321.39,56.4C233.5,79.56,150.87,104.22,64,106.2c-31.88.72-63.21-2.65-92.92-9.6V0H1200V27.35C1101.6,64.06,982.57,83.35,872.6,86.42c-131.09,3.62-241.06-27.88-377.61-39.68C402.9,37.49,360.66,46.56,321.39,56.4Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </Parallax>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex justify-center items-center gap-2">
          <FiMail className="text-white text-4xl" /> Let's Connect
        </h1>

        <p className="text-base md:text-lg leading-relaxed mb-6">
          Got a question, suggestion, or just want to say hi? Fill out the form and our friendly team will get back to you within 1–2 business days. Whether you’re a donor, campaign creator, or just someone curious about LifeLine.lk — we’d love to hear from you.
        </p>

        {/* Additional info highlights */}
        <div className="grid sm:grid-cols-2 gap-6 text-left text-sm md:text-base mb-6">
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <h3 className="font-semibold text-lg mb-1">💬 General Inquiries</h3>
            <p>If you need help understanding how LifeLine works, or need clarification on a campaign, reach out to us anytime.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <h3 className="font-semibold text-lg mb-1">🤝 Partnerships</h3>
            <p>Are you a hospital, NGO, or community group interested in collaborating? We’d be excited to discuss potential partnerships.</p>
          </div>
        </div>

        <p className="text-white/90 mb-6 italic">“Your message could start something powerful.”</p>

        <button
          onClick={onScrollToForm}
          className="px-8 py-3 bg-[var(--color-button)] text-white font-semibold rounded-full hover:bg-[var(--color-button-dull)] transition duration-300 shadow-lg hover:shadow-xl"
        >
          Message Us Now
        </button>
      </div>

      {/* Floating SVG Icons */}
      <Parallax speed={-5}>
        <svg className="absolute top-10 left-10 w-16 h-16 opacity-10" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M21 10.5a8.38 8.38 0 01-5.9 7.99M8 12H3m9 4v5m0-5a4 4 0 01-4-4m4 4a4 4 0 004-4m-4-4V3" />
        </svg>
      </Parallax>

      <Parallax speed={3}>
        <svg className="absolute bottom-8 right-10 w-24 h-24 opacity-10" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 3h18v18H3V3z" />
        </svg>
      </Parallax>
    </div>
  );
};

export default ContactIntro;
