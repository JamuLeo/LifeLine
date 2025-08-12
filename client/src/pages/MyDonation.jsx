import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useUser } from '@clerk/clerk-react'

const MyDonation = () => {
  const [donations, setDonations] = useState([])
  const { axios, currency = "LKR", navigate } = useAppContext()
  const { user, isLoaded, isSignedIn } = useUser()
  const donorId = user?.id

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !donorId) return
    const fetchDonations = async () => {
      try {
        // Use the endpoint with donorId
        const { data } = await axios.get(`/api/donation/donor/${donorId}`)
        setDonations(data.success ? data.donations : [])
      } catch {
        setDonations([])
      }
    }
    fetchDonations()
  }, [isLoaded, isSignedIn, donorId, axios])

  return (
    <div className="mt-16 pb-16 max-w-4xl mx-auto">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Donations</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      {donations.length === 0 && (
        <div className="text-center text-gray-400 text-lg mt-20">No donations yet.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {donations.map((don, idx) => (
          <div
            key={don._id || idx}
            className="bg-white border shadow rounded-xl p-5 flex flex-col gap-3"
          >
            <div
              className="flex gap-4 cursor-pointer"
              onClick={() => navigate(`/donate/${don.campaign.category}/${don.campaign._id}`)}
            >
              <img
                src={don.campaign.image?.[0] || "/default-campaign.png"}
                alt={don.campaign.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex flex-col flex-1">
                <div className="text-lg font-bold text-primary">{don.campaign.title}</div>
                <div className="text-xs text-gray-500">Category: {don.campaign.category}</div>
              </div>
            </div>
            <div>
              <span className="font-bold">{currency}{don.amount?.toLocaleString()}</span>
              <span className="text-xs ml-3 text-gray-400">{new Date(don.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="italic text-gray-700 break-words">
              {don.message ? `"${don.message}"` : <span className="text-gray-400">No message</span>}
            </div>
            {don.isAnonymous && (
              <div className="text-xs text-yellow-700 mt-1">Donated as <b>Anonymous</b></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDonation;
