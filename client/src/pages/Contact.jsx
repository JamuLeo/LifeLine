import React, { useRef } from 'react';


import NewsLetter from '../components/NewsLetter';

import ContactInfo from '../components/Contact/ContactInfo';
import ContactForm from '../components/Contact/ContactForm';
import ContactIntro from '../components/Contact/ContactIntro';



const Contact = () => {
  const contactRef = useRef(null);

  return (
    <div className="mt-10">
      <ContactIntro onScrollToForm={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <div ref={contactRef}>
        <ContactForm />
      </div>
      <ContactInfo />
      <NewsLetter />
    </div>
  );
};

export default Contact;
