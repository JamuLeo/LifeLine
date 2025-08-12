// import React from 'react';
// import { assets } from '../../assets/assets';


// const steps = [
//   {
//     icon: assets.start_campaign , // use a proper icon image
//     title: 'Start a Campaign',
//     text: 'Upload documents, tell your story, and go live in minutes.',
//   },
//   {
//     icon: assets.share_with_world,
//     title: 'Share with the World',
//     text: 'Use social media and word-of-mouth to spread awareness.',
//   },
//   {
//     icon: assets.track_donation,
//     title: 'Track Donations',
//     text: 'Get real-time updates and encouragement from donors.',
//   },
//   {
//     icon: assets.withdraw_funds,
//     title: 'Withdraw Funds',
//     text: 'Seamlessly withdraw to a hospital or personal account.',
//   },
// ];

// const AboutHowItWorks = () => {
//   return (
//     <div className="mt-16 px-6">
//       <h2 className="text-2xl md:text-3xl font-semibold mb-6">How It Works</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {steps.map((step, index) => (
//           <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center hover:scale-[1.02] transition">
//             <img src={step.icon} alt={step.title} className="w-16 h-16 mx-auto mb-4" />
//             <h3 className="text-lg font-bold text-primary">{step.title}</h3>
//             <p className="text-sm text-gray-600 mt-2">{step.text}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AboutHowItWorks;

import React from 'react';
import { assets } from '../../assets/assets';

const steps = [
  {
    icon: assets.start_campaign,
    title: 'Start a Campaign',
    text: 'Upload documents, tell your story, and go live in minutes.',
  },
  {
    icon: assets.share_with_world,
    title: 'Share with the World',
    text: 'Use social media and word-of-mouth to spread awareness.',
  },
  {
    icon: assets.track_donation,
    title: 'Track Donations',
    text: 'Get real-time updates and encouragement from donors.',
  },
  {
    icon: assets.withdraw_funds,
    title: 'Withdraw Funds',
    text: 'Seamlessly withdraw to a hospital or personal account.',
  },
];

const colorSet = ['#FEF6DA', '#FEE0E0', '#F0F5DE', '#E1F5EC'];

const AboutHowItWorks = () => {
  return (
    <div className="mt-16 px-6">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="p-6 rounded-xl shadow-md text-center hover:scale-[1.02] transition"
            style={{ backgroundColor: colorSet[index % colorSet.length] }}
          >
            <img src={step.icon} alt={step.title} className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-primary">{step.title}</h3>
            <p className="text-sm text-gray-700 mt-2">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutHowItWorks;
