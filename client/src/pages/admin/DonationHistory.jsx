import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";


const isCampaignClosed = (endDate) => {
  return new Date(endDate) < new Date();
};

const DonationHistory = () => {
  const { navigate } = useAppContext();
  const [campaigns, setCampaigns] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sended, setSended] = useState([]);
  const [donations, setDonations] = useState({}); 
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [search, setSearch] = useState("");
  const [filterClosed, setFilterClosed] = useState(""); 
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const [cRes, rRes, sRes] = await Promise.all([
        axios.get("/api/campaign/list"),
        axios.get("/api/donation-request/list"),
        axios.get("/api/sended-amount/all"),
      ]);
      setCampaigns(cRes.data.success ? cRes.data.campaigns : []);
      setRequests(rRes.data.success ? rRes.data.requests : []);
      setSended(sRes.data.success ? sRes.data.sended : []);
      setLoading(false);
    };
    fetchData();
  }, []);

  
  const loadDonations = async (campaignId) => {
    if (donations[campaignId]) return; 
    try {
      const { data } = await axios.get(`/api/donation/campaign/${campaignId}`);
      setDonations((d) => ({ ...d, [campaignId]: data.success ? data.donations : [] }));
    } catch {
      setDonations((d) => ({ ...d, [campaignId]: [] }));
    }
  };

  
  const getOutstanding = (c) => {
    const totalSent = sended
      .filter((s) => s.campaign === c._id)
      .reduce((sum, s) => sum + s.amount, 0);
    return c.collectedAmount - totalSent;
  };

  
  const getAmountWillBeCredited = (c) => {
    
    const creditedIds = new Set(
      sended.filter((s) => s.campaign === c._id).map((s) => String(s.donationRequestId))
    );
    return requests
      .filter((r) => r.campaign._id === c._id && r.status === "Sended" && !creditedIds.has(String(r._id)))
      .reduce((sum, r) => sum + r.amount, 0);
  };

  
  const filteredCampaigns = campaigns.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterClosed === "closed" && !isCampaignClosed(c.endDate)) return false;
    if (filterClosed === "ongoing" && isCampaignClosed(c.endDate)) return false;
    return true;
  });

  
  const handleCredit = async (campaign) => {
    
    toast.success("All pending payouts for this campaign marked as credited!");
    
  };

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Campaigns Donation History</h2>
      {selectedCampaign && (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <div className="flex gap-6">
            <img
              src={selectedCampaign.image?.[0]}
              alt=""
              className="w-40 h-40 rounded-lg object-cover border"
            />
            <div className="flex-1 space-y-2">
              <div className="text-xl font-bold">{selectedCampaign.title}</div>
              <div className="text-sm text-gray-500">
                <b>Category:</b> {selectedCampaign.category} &nbsp;
                <b>Status:</b>{" "}
                {isCampaignClosed(selectedCampaign.endDate) ? (
                  <span className="text-red-500">Closed</span>
                ) : (
                  <span className="text-green-600">Ongoing</span>
                )}
              </div>
              <div>
                <b>Goal:</b> MWK {selectedCampaign.goalAmount.toLocaleString()}<br />
                <b>Collected:</b> MWK {selectedCampaign.collectedAmount.toLocaleString()}<br />
                <b>Outstanding:</b> MWK {getOutstanding(selectedCampaign).toLocaleString()}<br />
              </div>
              <div className="text-gray-600 mb-2">
                <b>Account:</b> <br />
                {selectedCampaign.account && (
                  <>
                    <span>
                      {selectedCampaign.account.fullName}, {selectedCampaign.account.bankName}
                    </span>
                    <br />
                    <span>
                      A/C: {selectedCampaign.account.accNumber}, {selectedCampaign.account.branch}
                    </span>
                  </>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="border px-5 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-lg">Donations</h3>
            <button
              onClick={() => loadDonations(selectedCampaign._id)}
              className="mb-2 underline text-primary"
            >
              {donations[selectedCampaign._id] ? "Reload Donations" : "Load Donations"}
            </button>
            {donations[selectedCampaign._id] ? (
              <table className="w-full border rounded">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Donor</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Message</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations[selectedCampaign._id].length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-gray-400 p-4 text-center">
                        No donations yet.
                      </td>
                    </tr>
                  ) : (
                    donations[selectedCampaign._id].map((d) => (
                      <tr key={d._id}>
                        <td className="p-2">{d.donorId?.name || "Anonymous"}</td>
                        <td className="p-2">{d.donorId?.email || "-"}</td>
                        <td className="p-2">LKR {d.amount.toLocaleString()}</td>
                        <td className="p-2">{d.message || "-"}</td>
                        <td className="p-2">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-400">Click above to load donation history...</div>
            )}
          </div>
        </div>
      )}
      {/* Main Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search campaign..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <select
            className="border px-3 py-2 rounded"
            value={filterClosed}
            onChange={(e) => setFilterClosed(e.target.value)}
          >
            <option value="">All</option>
            <option value="closed">Closed</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>
        <table className="w-full border rounded text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Goal</th>
              <th className="p-2">Collected</th>
              <th className="p-2">Outstanding</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-400">Loading...</td>
              </tr>
            )}
            {filteredCampaigns.length === 0 && !loading && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-400">
                  No matching campaigns found.
                </td>
              </tr>
            )}
            {filteredCampaigns.map((c) => (
              <tr key={c._id} className="hover:bg-blue-50 transition">
                <td className="p-2 text-center">
                  <img
                    src={c.image?.[0]}
                    alt=""
                    className="w-12 h-12 object-cover rounded cursor-pointer border mx-auto"
                    onClick={() => {
                      setSelectedCampaign(c);
                      loadDonations(c._id);
                    }}
                  />
                </td>
                <td className="p-2">{c.title}</td>
                <td className="p-2">LKR {c.goalAmount.toLocaleString()}</td>
                <td className="p-2">LKR {c.collectedAmount.toLocaleString()}</td>
                <td className="p-2 font-bold text-blue-700">
                  LKR {getOutstanding(c).toLocaleString()}
                </td>
                
                <td className="p-2">
                  {isCampaignClosed(c.endDate) ? (
                    <span className="bg-red-100 px-2 py-1 rounded text-xs text-red-600">
                      Closed
                    </span>
                  ) : (
                    <span className="bg-green-100 px-2 py-1 rounded text-xs text-green-700">
                      Ongoing
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationHistory;
