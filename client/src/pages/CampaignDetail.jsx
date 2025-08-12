import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";

// Dummy data for illustration (replace with real data)
const campaignData = {
  category: "Medical",
  title: "Ethan's Cancer Treatment",
  summary:
    "Ethan, a 10-year-old boy, is battling leukemia and needs urgent treatment. His family is seeking financial assistance to cover the costs of chemotherapy, radiation, and supportive care. Your support can help save Ethan’s life.",
  image:
    "https://cdn.pixabay.com/photo/2017/01/31/13/14/avatar-2026510_1280.png", // Replace with your campaign image
  raised: 60000,
  goal: 100000,
  about:
    "Ethan is a bright and energetic 10-year-old boy who loves playing soccer and spending time with his friends. In early 2023, he was diagnosed with leukemia, a type of blood cancer. The diagnosis has turned his world upside down, and he now faces a long and challenging journey of treatment.",
  plan:
    "Ethan’s treatment plan includes multiple rounds of chemotherapy, radiation therapy, and supportive care to manage side effects. The estimated cost of his treatment is $100,000, which includes hospital stays, medications, and follow-up appointments. His family is struggling to meet these expenses and needs your help.",
  updates: [
    {
      title: "Treatment Started",
      date: "July 15, 2023",
    },
    {
      title: "Fundraising Campaign Launched",
      date: "June 1, 2023",
    },
  ],
  donations: [
    {
      name: "Sophia Carter",
      date: "July 20, 2023",
      amount: "$100",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "David Lee",
      date: "July 18, 2023",
      amount: "$50",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Anonymous",
      date: "July 15, 2023",
      amount: "$200",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    {
      name: "Emily Clark",
      date: "July 12, 2023",
      amount: "$75",
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    },
    {
      name: "Michael Brown",
      date: "July 10, 2023",
      amount: "$150",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    },
  ],
};

const CampaignDetail = () => {
  const percent = Math.round((campaignData.raised / campaignData.goal) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 text-black">
      {/* Breadcrumb */}
      <nav className="text-sm mb-2 text-gray-400">
        <Link to="/" className="hover:underline">
          {campaignData.category}
        </Link>
        <span> / </span>
        <span className="text-black">{campaignData.title}</span>
      </nav>

      {/* Title and Summary */}
      <h1 className="font-bold text-2xl md:text-3xl mb-2">{campaignData.title}</h1>
      <p className="text-gray-700 mb-4">
        {campaignData.summary}
      </p>

      {/* Image */}
      <div className="w-full flex justify-center my-4">
        <img
          src={campaignData.image}
          alt={campaignData.title}
          className="rounded-lg object-contain max-h-[320px] mx-auto"
          style={{ minWidth: 250 }}
        />
      </div>

      {/* Progress & Donate */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm mb-1">
          <span>
            ${campaignData.raised.toLocaleString()} raised of ${campaignData.goal.toLocaleString()} goal
          </span>
          <span>{percent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-black rounded transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button className="bg-blue-600 text-white rounded-md px-6 py-2 font-medium shadow hover:bg-blue-700 transition">
            Donate Now
          </button>
          <button className="bg-gray-100 text-black rounded-md px-6 py-2 font-medium shadow hover:bg-gray-200 transition flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 12v1a9 9 0 0018 0v-1" strokeLinecap="round"/>
              <path d="M12 19v-7m0 0l-3 3m3-3l3 3" strokeLinecap="round"/>
            </svg>
            Share
          </button>
        </div>
      </div>

      {/* About Ethan */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-1">About Ethan</h2>
        <p className="text-gray-700">{campaignData.about}</p>
      </div>

      {/* Treatment Plan */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-1">Treatment Plan</h2>
        <p className="text-gray-700">{campaignData.plan}</p>
      </div>

      {/* Updates */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3">Updates</h2>
        <ul className="space-y-2 border-l border-gray-200 pl-4">
          {campaignData.updates.map((u, i) => (
            <li key={i} className="relative pl-4">
              <span className="absolute left-0 top-0 block w-2 h-2 rounded-full bg-black mt-2" />
              <div className="font-semibold">{u.title}</div>
              <div className="text-xs text-gray-400">{u.date}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Donations */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3">Donations</h2>
        <ul className="divide-y divide-gray-100">
          {campaignData.donations.map((d, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img
                  src={d.avatar}
                  alt={d.name}
                  className="w-9 h-9 rounded-full object-cover border"
                />
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-gray-400">{d.date}</div>
                </div>
              </div>
              <span className="font-medium text-gray-900">{d.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CampaignDetail;


