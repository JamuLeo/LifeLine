import React, { useState } from "react";


import { assets } from "../assets/assets";

const steps = [
  {
    num: "01",
    label: "Start Your Medical Campaign",
    desc: "No paperwork hassle – just fill in the patient details, upload documents, set your goal, and launch within minutes.",
    secureTitle: "Secure & Easy to Donate:",
    secureDesc: "Supporters can verify your cause with uploaded medical records and donate securely. Whether it’s for surgery, treatment, or recovery, every share counts.",
    img: assets.banner_ab_1,
  },
  {
    num: "02",
    label: "Share with Friends & Family",
    desc: "Let your loved ones become your strength. Share your story on WhatsApp, Facebook, or Instagram, and speak about it in your community.",
    secureTitle: "Secure & Easy to Donate:",
    secureDesc: "Supporters can verify your cause with uploaded medical records and donate securely. Whether it’s for surgery, treatment, or recovery, every share counts.",
    img: assets.banner_ab_2,
  },
  {
    num: "03",
    label: "Track Progress in Real-Time",
    desc: "Stay updated with each donation and encouraging message. Transparency builds trust with your donors.",
    secureTitle: "Secure & Easy to Donate:",
    secureDesc: "Supporters can verify your cause with uploaded medical records and donate securely. Whether it’s for surgery, treatment, or recovery, every share counts.",
    img: assets.banner_ab_3,
  },
  {
    num: "04",
    label: "Withdraw Funds Seamlessly",
    desc: "Receive funds directly into your bank or hospital account with quick and secure disbursements.",
    secureTitle: "Secure & Easy to Donate:",
    secureDesc: "Supporters can verify your cause with uploaded medical records and donate securely. Whether it’s for surgery, treatment, or recovery, every share counts.",
    img: assets.banner_ab_4,
  },
];

const BlogBanner = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className='mt-24 items-start shadow-xl rounded-2xl md:items-center'>
      <section className="min-h-[60vh] flex flex-col items-center rounded-2xl py-6 px-2 border border-gray-300">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-3 tracking-tight">
            Quick Life Line Fundraisers!
          </h1>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            Kickstart your fundraising journey effortlessly with Our Life Line – a trusted medical crowdfunding platform that turns your health crisis into hope.<br />
            Launching a campaign takes just minutes and connects you with donors who care.
          </p>
        </div>

        {/* Featured Step Card */}
        <div
          className="w-full max-w-5xl bg-white border-2 border-gray-400 rounded-xl shadow-md p-4 flex flex-row items-stretch mb-8 transition-all duration-300"
          onMouseLeave={() => setHoveredStep(null)}
        >
          {/* Left */}
          <div className="flex-1 flex flex-col justify-center">
            {!isMobile && hoveredStep !== null ? (
              <div>
                <span className="text-primary font-semibold text-base">{steps[hoveredStep].num}</span>
                <h2 className="font-bold text-xl mt-2 mb-1 text-gray-900">{steps[hoveredStep].label}</h2>
                <p className="text-gray-700 mb-2">{steps[hoveredStep].desc}</p>
                <hr className="my-2 border-gray-200" />
                <div className="flex items-start gap-2">
                  <span>
                    <svg width="22" height="22" fill="none" stroke="#222" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zm0 13l-10-5v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-10 5z" fill="#111" />
                    </svg>
                  </span>
                  <p className="text-gray-900 font-medium text-sm sm:text-base">
                    {steps[hoveredStep].secureTitle}{" "}
                    <span className="font-normal text-gray-600">{steps[hoveredStep].secureDesc}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center px-2">
                <h2 className="text-xl font-semibold text-primary">Start Your Fundraiser Journey</h2>
                <p className="text-gray-600 text-sm mt-2">Hover over each step to learn more.</p>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-gray-100 rounded-md overflow-hidden flex items-center justify-center w-full h-[170px] sm:h-[210px] md:h-[240px]">
              <img
                src={hoveredStep !== null ? steps[hoveredStep].img : assets.banner_ab}
                alt="Step visual"
                className="object-cover w-full h-full rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`border-t-2 pt-2 px-2 cursor-pointer transition ${
                hoveredStep === idx ? "border-primary bg-gray-100" : "border-gray-200"
              }`}
              onMouseEnter={() => !isMobile && setHoveredStep(idx)}
              onFocus={() => !isMobile && setHoveredStep(idx)}
              tabIndex={0}
            >
              <span className="text-primary font-semibold text-base">{step.num}</span>
              <h3 className="font-bold text-base mt-2 mb-1 text-gray-900">{step.label}</h3>
              <p className="text-gray-500 text-xs sm:text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogBanner;
