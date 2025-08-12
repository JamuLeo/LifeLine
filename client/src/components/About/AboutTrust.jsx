import React from 'react';

const AboutTrust = () => {
  const features = [
    { title: 'Verified Campaigns', desc: 'Admins check and approve every campaign manually.' },
    { title: 'Real-Time Tracking', desc: 'Live updates powered by Socket.IO and Firebase.' },
    { title: 'Secure Auth', desc: 'Google/Firebase login with role-based access.' },
    { title: 'Transparent Logs', desc: 'Every action is logged for audit and compliance.' },
  ];

  return (
    <div className="mt-16 px-6">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Built with Trust & Transparency</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="p-5 rounded-lg shadow-xl bg-gray-50 hover:bg-white">
            <h3 className="text-primary font-bold text-lg">{f.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutTrust;
