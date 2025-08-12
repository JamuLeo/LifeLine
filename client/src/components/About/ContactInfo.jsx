import React from 'react';
import { FiPhone, FiMapPin, FiMail } from 'react-icons/fi';

const ContactInfo = () => {
  return (
    <div className="bg-gray-50 mt-16 px-6 py-10 text-center rounded-lg shadow-inner">
      <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-primary)] mb-4">Need to reach us directly?</h2>
      <div className="text-gray-700 text-sm space-y-3">
        <p className="flex justify-center items-center gap-2">
          <FiMail className="text-[var(--color-button)]" />
          <strong>Email:</strong> <a href="mailto:support@lifeline.lk" className="underline">support@lifeline.lk</a>
        </p>
        <p className="flex justify-center items-center gap-2">
          <FiPhone className="text-[var(--color-button)]" />
          <strong>Phone:</strong> +94 71 123 4567 (Mon–Fri, 9 AM – 5 PM)
        </p>
        <p className="flex justify-center items-center gap-2">
          <FiMapPin className="text-[var(--color-button)]" />
          <strong>Address:</strong> LifeLine.lk, No. 101, Galle Road, Colombo 03, Sri Lanka
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
