import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const MyRequest = () => {
  const { campaigns, patient, axios } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ campaignId: '', amount: '', message: '', maxAmount: 0 });
  const [requests, setRequests] = useState([]);
  const [sended, setSended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({}); 

  
  useEffect(() => {
    if (!patient) return;
    const load = async () => {
      try {
        const [reqRes, sendRes] = await Promise.all([
          axios.get('/api/donation-request/my-requests'),
          axios.get('/api/sended-amount/my')
        ]);
        setRequests(reqRes.data.success ? reqRes.data.requests : []);
        setSended(sendRes.data.success ? sendRes.data.sended : []);
      } catch (err) {
        setRequests([]); setSended([]);
      }
    };
    load();
  }, [axios, patient]);

  // All my campaigns
  const myCampaigns = campaigns.filter(c => c.patientId === patient?._id);

  // Calculate Outstanding (current) for a campaign
  const getOutstanding = (campaignId, collectedAmount) => {
    const totalSent = sended
      .filter(s => s.campaign === campaignId)
      .reduce((sum, s) => sum + s.amount, 0);
    return collectedAmount - totalSent;
  };

  // All requests for a campaign (sorted newest first)
  const requestsFor = campaignId =>
    requests.filter(r => r.campaign._id === campaignId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // All payouts sent for a campaign
  const sentFor = campaignId =>
    sended.filter(s => s.campaign === campaignId);

  // Pending request?
  const getCurrentPendingRequest = campaignId =>
    requests.find(r => r.campaign._id === campaignId && r.status === "Pending");

  // Expand/collapse details
  const toggleExpand = campaignId => setExpanded(e => ({ ...e, [campaignId]: !e[campaignId] }));

  // Open request form
  const openRequestForm = (campaign, outstanding) => {
    setForm({
      campaignId: campaign._id,
      amount: '',
      message: '',
      maxAmount: outstanding
    });
    setShowForm(true);
  };

  // Submit payout request
  const submitRequest = async (e) => {
    e.preventDefault();
    if (Number(form.amount) > Number(form.maxAmount)) {
      toast.error('Amount exceeds current outstanding balance');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/donation-request/add', {
        campaignId: form.campaignId,
        amount: Number(form.amount),
        message: form.message,
      });
      if (data.success) {
        toast.success('Request submitted');
        setShowForm(false);
        // Reload requests
        const reqRes = await axios.get('/api/donation-request/my-requests');
        setRequests(reqRes.data.requests || []);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Error submitting request');
    }
    setLoading(false);
  };

  // Cancel pending request
  const cancelRequest = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/donation-request/cancel', { id });
      if (data.success) {
        toast.success('Request cancelled');
        setRequests(reqs => reqs.filter(r => r._id !== id));
      } else {
        toast.error(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 w-5xl max-w-full mx-auto">
      <h2 className="text-2xl font-bold mb-8">Withdrawal Requests</h2>
      <div className="space-y-10">
        {myCampaigns.length === 0 && (
          <div className="text-gray-400">You have not created any campaigns.</div>
        )}
        {myCampaigns.map(campaign => {
          const pending = getCurrentPendingRequest(campaign._id);
          const outstanding = getOutstanding(campaign._id, campaign.collectedAmount);
          const allRequests = requestsFor(campaign._id);
          return (
            <div key={campaign._id} className="border rounded-xl p-6 bg-white shadow">
              <div className="flex flex-col md:flex-row gap-6">
                <img src={campaign.image?.[0]} alt="" className="w-32 h-32 rounded object-cover border" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">{campaign.title}</div>
                      <div className="text-gray-500 text-sm mb-1">
                        <b>Outstanding:</b> LKR {outstanding.toLocaleString()} &nbsp;
                        <b>Goal:</b> LKR {campaign.goalAmount?.toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="text-xs text-blue-500 underline"
                      onClick={() => toggleExpand(campaign._id)}
                    >
                      {expanded[campaign._id] ? "Show Less" : "Show More"}
                    </button>
                  </div>
                  {!pending ? (
                    <button
                      onClick={() => openRequestForm(campaign, outstanding)}
                      className="bg-primary px-4 py-2 text-white rounded hover:bg-primary-dull transition mt-4"
                      disabled={outstanding < 1}
                    >
                      Request Amount
                    </button>
                  ) : (
                    <div className="flex flex-col items-start mt-4">
                      <span className="text-orange-600 font-bold mb-1">Pending Request: LKR {pending.amount}</span>
                      <span className="text-gray-700 mb-1">Reason: {pending.message}</span>
                      <button
                        disabled={loading}
                        onClick={() => cancelRequest(pending._id)}
                        className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}
                  {/* Show more: Request & Payout History */}
                  {expanded[campaign._id] && (
                    <div className="mt-5 w-full border-t pt-4">
                      <h4 className="text-md font-semibold mb-2">Request History</h4>
                      {allRequests.length === 0 ? (
                        <div className="text-gray-400 text-sm">No requests yet.</div>
                      ) : (
                        <ul className="space-y-3">
                          {allRequests.map(r => (
                            <li key={r._id} className="border-b pb-2">
                              <div>
                                <b>{r.status}</b>: LKR {r.amount}
                                <span className="text-xs text-gray-400 ml-2">{new Date(r.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div>
                                {r.status === "Rejected" && (
                                  <span className="text-red-600 text-xs">
                                    Rejected Reason: {r.adminReply || "No reason provided"}
                                  </span>
                                )}
                                {r.status === "Sended" && (
                                  <span className="text-green-700 text-xs">
                                    Sent: Amount will be credited soon
                                  </span>
                                )}
                                {r.message && (
                                  <div className="text-gray-600 text-xs">Request Reason: {r.message}</div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      <h4 className="text-md font-semibold mt-6 mb-1">Payments Sent</h4>
                      {sentFor(campaign._id).length === 0 ? (
                        <div className="text-gray-400 text-sm">No sent payments yet.</div>
                      ) : (
                        <ul className="space-y-2">
                          {sentFor(campaign._id).map(sa => (
                            <li key={sa._id} className="text-green-700 text-xs flex flex-col">
                              <span>Amount Sent: LKR {sa.amount} </span>
                              <span className="text-gray-400">on {new Date(sa.createdAt).toLocaleDateString()}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Outstanding at the bottom, always recomputed */}
                      <div className="mt-4 text-sm font-bold text-blue-700">
                        Outstanding: LKR {getOutstanding(campaign._id, campaign.collectedAmount).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <form
            className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-5"
            onSubmit={submitRequest}
          >
            <h3 className="text-lg font-bold mb-1">Request Withdrawal</h3>
            <div>
              <label className="font-semibold">Amount (max LKR {form.maxAmount?.toLocaleString()}):</label>
              <input
                type="number"
                min="1"
                max={form.maxAmount}
                required
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Reason:</label>
              <textarea
                required
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                rows={2}
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white font-bold px-5 py-2 rounded hover:bg-primary-dull transition"
              >
                Submit
              </button>
              <button
                type="button"
                disabled={loading}
                className="px-5 py-2 rounded border"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyRequest;
