import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const CampaignDonations = () => {
  const { axios, navigate } = useAppContext();
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchCampaignsAndDonations = async () => {
      setLoading(true);
      try {
        // 1. Get all campaigns for the logged-in patient
        const { data } = await axios.get("/api/campaign/by-patient");
        if (data.success && Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns);
          // 2. For each campaign, fetch donations
          const allDonations = {};
          await Promise.all(
            data.campaigns.map(async (c) => {
              try {
                const res = await axios.get(`/api/donation/campaign/${c._id}`);
                allDonations[c._id] = res.data.success ? res.data.donations : [];
              } catch {
                allDonations[c._id] = [];
              }
            })
          );
          setDonations(allDonations);
        } else {
          setCampaigns([]);
          setDonations({});
        }
      } catch {
        setCampaigns([]);
        setDonations({});
      }
      setLoading(false);
    };
    fetchCampaignsAndDonations();
  }, [axios]);

  const toggleExpand = (campaignId) =>
    setExpanded((exp) => ({ ...exp, [campaignId]: !exp[campaignId] }));

  if (loading)
    return <div className="p-10 text-center text-lg">Loading...</div>;

  if (!campaigns.length)
    return <div className="p-10 text-center text-gray-400">You haven’t created any campaigns yet.</div>;

  return (
    <div className="no-scrollbar flex flex-1 w-full max-w-full md:ml-10 md:mr-30">
      <div className="w-full mx-auto p-2 sm:p-4 md:py-8 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">My Campaigns & Donations</h1>
        {campaigns.map((campaign) => {
          const percent = Math.round(
            (campaign.collectedAmount / campaign.goalAmount) * 100
          );
          const campaignDonations = donations[campaign._id] || [];
          return (
            <div 
            //onClick={()=> {navigate(`patient/campaign-list/${campaign._id}`); scrollTo(0,0)}} 
              key={campaign._id}
              className="border border-primary/30 p-8 rounded-xl shadow-xl mb-8 bg-white"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1" >
                  <h3 onClick={()=> {navigate(`patient/My-Campaign/${campaign._id}`); scrollTo(0,0)}} key={campaign._id} className="font-semibold text-lg mb-1 cursor-pointer ">{campaign.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{campaign.description?.[0]}</p>
                  <div className="text-sm mb-2">
                    <span className="mr-2">
                      <b>Category:</b> {campaign.category}
                    </span>
                    <span className="mr-2">
                      <b>Status:</b> {campaign.isApprove ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="text-sm mb-2">
                    <b>Goal:</b> LKR {campaign.goalAmount?.toLocaleString()}<br />
                    <b>Collected:</b> LKR {campaign.collectedAmount?.toLocaleString()}
                  </div>
                </div>
                <img
                  src={campaign.image?.[0]}
                  alt="Campaign"
                  className="w-40 h-32 object-cover rounded-lg shadow"
                />
              </div>
              {/* Progress */}
              <div className="mt-4 mb-4">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span>
                    <b>LKR {campaign.collectedAmount?.toLocaleString()}</b> raised of <b>LKR {campaign.goalAmount?.toLocaleString()}</b> goal
                  </span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-primary rounded transition-all"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
              {/* Expand/Collapse for Donations */}
              <div className="flex justify-end mt-2">
                <button
                  className="text-sm px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  onClick={() => toggleExpand(campaign._id)}
                >
                  {expanded[campaign._id] ? "Hide Donations" : "Show Donations"}
                </button>
              </div>
              {expanded[campaign._id] && (
                <div className="mt-6">
                  <div className="font-bold mb-2">Donation History</div>
                  {campaignDonations.length === 0 ? (
                    <div className="text-gray-400 text-sm">No donations yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border mt-1">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-2">Donor</th>
                            <th className="text-left p-2">Amount (LKR)</th>
                            <th className="text-left p-2">Message</th>
                            <th className="text-left p-2">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaignDonations.map((don) => (
                            <tr key={don._id} className="border-t">
                              <td className="p-2">
                                {don.isAnonymous
                                  ? <span className="italic text-gray-500">Anonymous</span>
                                  : don.donorId?.name || "User"}
                              </td>
                              <td className="p-2">{don.amount?.toLocaleString()}</td>
                              <td className="p-2">
                                {don.message ? don.message : <span className="text-gray-400">No message</span>}
                              </td>
                              <td className="p-2">{new Date(don.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignDonations;
