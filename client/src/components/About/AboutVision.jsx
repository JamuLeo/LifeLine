import React from 'react';

const AboutVision = () => {
  return (
    <div
      className="mt-16 px-6 text-center max-w-3xl mx-auto py-10 rounded-xl shadow-md"
      style={{ backgroundColor: '#E1F5EC' }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Our Vision</h2>
      <p className="text-gray-700 text-base leading-relaxed">
        To become Sri Lanka’s most trusted and impactful medical crowdfunding platform. LifeLine envisions a future
        where no one delays treatment because of money, and every person has access to timely help—made possible by
        compassionate communities and responsible technology.
      </p>
      <div className="mt-6">
        <a
          href="/donate"
          className="inline-block bg-primary text-white py-2 px-6 rounded-full font-medium hover:bg-primary-dull transition"
        >
          Support a Life Now
        </a>
      </div>
    </div>
  );
};

export default AboutVision;
