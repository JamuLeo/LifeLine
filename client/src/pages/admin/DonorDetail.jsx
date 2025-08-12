import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";

const DonorDetail = () => {
  const { axios, navigate } = useAppContext();
  const { id } = useParams();
  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // Fetch donor
    const fetchDonor = async () => {
      const { data } = await axios.get(`/api/donor/list`);
      if (data.success) {
        setDonor(data.donors.find(d => d._id === id));
      }
    };
    // Fetch this donor's donations
    const fetchDonorDonations = async () => {
      const { data } = await axios.get(`/api/donation/donor/${id}`);
      if (data.success) setDonations(data.donations);
    };
    fetchDonor();
    fetchDonorDonations();
  }, [axios, id]);

  if (!donor) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col items-center p-6 w-full">
      {/* Profile Info */}
      <div className="flex flex-col items-center mb-10">
        <img src={donor.image} alt="Profile" className="w-28 h-28 rounded-full object-cover mb-2 shadow-lg" />
        <div className="text-3xl font-extrabold">{donor.name}</div>
        <div className="text-lg text-gray-500">{donor.email}</div>
      </div>
      {/* Donations */}
      <h2 className="text-2xl font-semibold mb-6">Donations</h2>
      {donations.length === 0 && <div>No donations yet.</div>}

      {/* Donations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {donations.map(donation => (
          <div key={donation._id}
            className="flex gap-4 items-center bg-white border rounded-xl p-5 shadow hover:shadow-xl transition cursor-pointer"
            onClick={() => {
              if (donation.campaign?._id) {
                navigate(`/admin/campaign-list/${donation.campaign._id}`);
                scrollTo(0, 0);
              }
            }}
          >
            {/* Campaign Image */}
            <img
              src={donation.campaign?.image?.[0] || "/default_campaign.jpg"}
              alt={donation.campaign?.title || "Campaign"}
              className="w-20 h-20 object-cover rounded-lg border"
            />
            {/* Donation & Campaign Info */}
            <div className="flex-1">
              <div className="text-lg font-bold text-primary hover:underline">
                {donation.campaign?.title || "No campaign title"}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Amount:</span> LKR <b>{donation.amount?.toLocaleString()}</b>
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Date:</span> {new Date(donation.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Anonymous:</span> {donation.isAnonymous ? "Yes" : "No"}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Message:</span> {donation.message || <span className="text-gray-400">No message</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorDetail;
