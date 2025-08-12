import React from 'react';
import Lottie from 'lottie-react';
import { assets } from '../../assets/assets';

const AboutBanner = () => {
  return (
    <div className="px-4 py-10 text-center bg-[#E1F5EC] rounded-xl mx-4 md:mx-10 shadow-lg">
      <div className="flex flex-col-reverse md:flex-row items-center gap-6">
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary">What is LifeLine.lk?</h1>
          <p className="text-sm md:text-lg max-w-xl mx-auto md:mx-0 leading-relaxed text-gray-700">
            LifeLine.lk is Sri Lanka’s first medical crowdfunding platform – connecting patients in crisis with
            compassionate donors across the country and globe. It's fast, transparent, and designed for Sri Lanka’s real
            needs.
          </p>
        </div>
        <div className="md:w-1/2 max-w-md">
          <Lottie animationData={assets.heart_donation} loop={true} />
        </div>
      </div>
    </div>
  );
};

export default AboutBanner;
