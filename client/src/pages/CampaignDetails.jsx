import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { CampaignCards } from '../components/CampaignCards'
import { useClerk, useUser } from '@clerk/clerk-react';
import toast from "react-hot-toast";

function getDaysLeft(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : 0;
}

const CampaignDetails = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const { campaigns, navigate, axios, currency = "LKR" } = useAppContext();
  const { id } = useParams();
  const [relatedCampaigns, setRelatedCampaigns] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [progress, setProgress] = useState(0);
  const [donations, setDonations] = useState([]);

  const campaign = campaigns.find((item) => item._id === id);

  const campaignProgress = campaign?.goalAmount && campaign?.collectedAmount
    ? Math.min(campaign.collectedAmount / campaign.goalAmount, 1)
    : 0;

  useEffect(() => {
    // Fetch campaign donations
    const fetchDonations = async () => {
      try {
        const { data } = await axios.get(`/api/donation/campaign/${campaign?._id}`);
        if (data.success) setDonations(data.donations);
      } catch (err) {
        setDonations([]);
      }
    };
    if (campaign) fetchDonations();
  }, [campaign, axios]);

  useEffect(() => {
    let anim;
    if (progress < campaignProgress) {
      anim = setTimeout(() => setProgress((p) => {
        const next = p + 0.02;
        return next >= campaignProgress ? campaignProgress : next;
      }), 16);
    }
    return () => clearTimeout(anim);
  }, [progress, campaignProgress]);

  useEffect(() => {
    if (campaigns.length > 0 && campaign) {
      let campaignsCopy = campaigns.slice();
      campaignsCopy = campaignsCopy.filter((item) => campaign.category === item.category && item._id !== campaign._id);
      setRelatedCampaigns(campaignsCopy.slice(0, 5));
    }
  }, [campaigns, campaign]);

  useEffect(() => {
    setThumbnail(campaign?.image && campaign.image[0] ? campaign.image[0] : null)
  }, [campaign]);

  if (!campaign) return null;

  const daysLeft = getDaysLeft(campaign.endDate);

  return (
    <div className="mt-12">
      <p>
        <Link to={"/"}>Home</Link> /
        <Link to={"/donate"}> Campaigns</Link> /
        <Link to={`/donate/${campaign.category.toLowerCase()}`}> {campaign.category}</Link> /
        <span className="text-primary"> {campaign.title}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {campaign.image && campaign.image.map((image, index) => (
              <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
            <img src={thumbnail} alt="Selected product" />
          </div>
        </div>

        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium flex items-center gap-2">
            {campaign.title}
            {campaign.isEmergency && (
              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">Emergency</span>
            )}
          </h1>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gray-200 w-full h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-2 rounded-full transition-all duration-700" style={{ width: `${progress * 100}%` }}></div>
              </div>
              <span className="text-xs font-semibold text-gray-600">{Math.round(progress * 100)}%</span>
            </div>

            <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
              <div className="flex items-center gap-1 text-xl">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#64748b" /></svg>
                {campaign.donors || 0} Donors
              </div>
              <div className="flex items-center gap-1 text-xl">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="2" /><path d="M12 6v6l4 2" stroke="#64748b" strokeWidth="2" /></svg>
                {daysLeft} days left
              </div>
            </div>

            <p className="text-2xl font-medium">Goal: {currency}{campaign.goalAmount?.toLocaleString()}</p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className="text-base font-medium mt-6">About Campaign</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {campaign.description[0]}
          </ul>

          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => {
                if (!isSignedIn) {
                  toast.error("Please log in as a donor to continue");
                  openSignIn();
                  return;
                }
                navigate(`donate/pay/${campaign._id}`);
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white rounded-xl shadow-xl hover:bg-primary-dull transition"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-10">
        <p className="text-base font-medium mt-6">Our Story</p>
        <ul className="list-disc ml-4 mt-6 text-gray-500/70">
          {campaign.description.map((desc, index) => (
            <li key={index}>{desc}</li>
          ))}
        </ul>
      </div>

      {/* ---- Patient Address & Bank Details Section ---- */}
      <div className="mt-10 flex flex-col md:flex-row gap-12">
        {/* Address */}
        <div className="flex-1 border rounded-lg p-6 bg-gray-50">
          <div className="text-xl font-bold mb-3">Patient Address</div>
          {campaign.address ? (
            <ul className="text-gray-700 space-y-1">
              <li><span className="font-semibold">Street:</span> {campaign.address.street}</li>
              <li><span className="font-semibold">City:</span> {campaign.address.city}</li>
              <li><span className="font-semibold">Province:</span> {campaign.address.province}</li>
              <li><span className="font-semibold">Phone:</span> {campaign.address.phone}</li>
            </ul>
          ) : (
            <div className="text-gray-400">No address details</div>
          )}
        </div>
        {/* Bank Account */}
        <div className="flex-1 border rounded-lg p-6 bg-gray-50">
          <div className="text-xl font-bold mb-3">Bank Details</div>
          {campaign.account ? (
            <ul className="text-gray-700 space-y-1">
              <li><span className="font-semibold">Account Holder:</span> {campaign.account.fullName}</li>
              <li><span className="font-semibold">Bank:</span> {campaign.account.bankName}</li>
              <li><span className="font-semibold">Account Number:</span> {campaign.account.accNumber}</li>
              <li><span className="font-semibold">Branch:</span> {campaign.account.branch}</li>
            </ul>
          ) : (
            <div className="text-gray-400">No account details</div>
          )}
        </div>
      </div>
      {/* ---- End Patient Address & Bank Details ---- */}

      {/* ---------- Supporters/Donors Section ------------- */}
      {donations.length > 0 && (
        <div className="flex flex-col items-center mt-16 w-full">
          <div className="flex flex-col items-center w-max">
            <p className="text-3xl font-medium">Supporters</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>
          <div className="mt-8 w-full  grid grid-cols-1 md:grid-cols-2 gap-6">
            {donations.map((donation, idx) => (
              <div
                key={donation._id || idx}
                className="flex items-center gap-5 p-4 mb-3 bg-white shadow rounded-lg"
              >
                <img
                  src={
                    donation.isAnonymous
                      ? "/anonymous-user.png"
                      : donation.donorId?.image || "/default-user.png"
                  }
                  alt="Supporter"
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-lg">
                    {donation.isAnonymous
                      ? "Anonymous Donor"
                      : donation.donorId?.name || "Supporter"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Donated: <span className="font-bold text-primary">
                      LKR {donation.amount?.toLocaleString()}
                    </span>
                  </span>
                  <span className="mt-2 text-gray-700 italic break-words">
                    {donation.message
                      ? `"${donation.message}"`
                      : <span className="text-gray-400">No message</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------- Related Campaign------------------ */}
      <div className=" flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Campaign</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:grid-cols-3 mt-6">
          {relatedCampaigns.filter((item) => item.isApprove).map((related, idx) => (
            <CampaignCards key={idx} campaign={related} />
          ))}
        </div>
        <button onClick={() => { navigate('/donate'); scrollTo(0, 0) }} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">See more</button>
      </div>
    </div>
  );
};

export default CampaignDetails;
