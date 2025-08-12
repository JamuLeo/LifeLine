import React from 'react';

const AboutAudience = () => {
  const audience = [
    {
      title: 'Patients & Families',
      desc: 'Raise funds for treatments and emergencies with dignity and speed.',
    },
    {
      title: 'Local & Global Donors',
      desc: 'Support verified causes and make direct impact across borders.',
    },
    {
      title: 'Healthcare Providers',
      desc: 'Ensure timely payments and improve patient admission rates.',
    },
    {
      title: 'NGOs & Communities',
      desc: 'Partner for verified outreach while we handle the tech and compliance.',
    },
  ];

  return (
    <div className="mt-16 px-6">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Who We Serve</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto">
        {audience.map((a, idx) => (
          <div key={idx} className="bg-white border-l-4 border-primary p-8 shadow-md rounded-lg">
            <h3 className="font-bold text-lg text-primary">{a.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutAudience;
