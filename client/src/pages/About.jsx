import React from 'react';
import AboutBanner from '../components/About/AboutBanner';
import AboutMission from '../components/About/AboutMission';
import AboutHowItWorks from '../components/About/AboutHowItWorks';
import AboutTrust from '../components/About/AboutTrust';
import AboutAudience from '../components/About/AboutAudience';
import AboutVision from '../components/About/AboutVision';
import NewsLetter from '../components/NewsLetter';


const About = () => {
  return (
    <div className="mt-10">
      <AboutBanner />
      <AboutMission />
      <AboutHowItWorks />
      <AboutTrust />
      <AboutAudience />
      <AboutVision />
      <NewsLetter />
    </div>
  );
};

export default About;
