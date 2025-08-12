import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAppContext } from '../../context/AppContext'

const PatientRequest = () => {
  const { navigate } = useAppContext()
  const [requests, setRequests] = useState([])
  const [sended, setSended] = useState([])
  const [showDetails, setShowDetails] = useState({})
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('Sended')

  
  useEffect(() => {
    const fetchData = async () => {
      const reqRes = await axios.get('/api/donation-request/list')
      setRequests(reqRes.data.success ? reqRes.data.requests : [])
      
      const senRes = await axios.get('/api/sended-amount/all')
      setSended(senRes.data.success ? senRes.data.sended : [])
    }
    fetchData()
  }, [])

  
  const sentSummaryByCampaign = {}
  sended.forEach(item => {
    if (!sentSummaryByCampaign[item.campaign]) {
      sentSummaryByCampaign[item.campaign] = { totalSent: 0 }
    }
    sentSummaryByCampaign[item.campaign].totalSent += item.amount
  })

  
  const campaigns = Object.values(requests.reduce((acc, req) => {
    if (req.campaign && req.campaign._id) {
      acc[req.campaign._id] = req.campaign
    }
    return acc
  }, {}))

  
  const filteredCampaigns = campaigns.filter(c => {
    const campaignRequests = requests.filter(r => r.campaign._id === c._id)
    
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false
    
    if (date && !campaignRequests.some(r => r.createdAt.startsWith(date))) return false
    
    if (filterStatus === 'Rejected' && !campaignRequests.some(r => r.status === 'Rejected')) return false
    if (filterStatus === 'Sended' && !campaignRequests.some(r => r.status === 'Sended')) return false
    return true
  })

  
  const handleReject = async (id) => {
    const adminReply = prompt("Enter reason for rejection:")
    if (!adminReply) return
    const { data } = await axios.post('/api/donation-request/reject', { id, adminReply })
    if (data.success) {
      toast.success("Request rejected")
      setRequests(reqs => reqs.map(r => r._id === id ? { ...r, status: 'Rejected', adminReply } : r))
    } else toast.error(data.message)
  }

  const handleSend = async (id) => {
    const { data } = await axios.post('/api/donation-request/send', { id })
    if (data.success) {
      toast.success(data.message)
      setRequests(reqs => reqs.map(r => r._id === id ? { ...r, status: 'Sended', adminReply: 'Amount will be credited soon' } : r))
    } else toast.error(data.message)
  }

 
  const pendingRequests = requests.filter(r => r.status === 'Pending')

  return (
    <div className="p-6 w-5xl max-w-full mx-auto">
      <h2 className="text-2xl mb-6">Patient Withdrawal Requests</h2>

      {/* --- Section 1: Pending Requests --- */}
      <div className="mb-10">
        <h3 className="text-lg mb-3 font-semibold text-yellow-700">Pending Requests</h3>
        <div className="grid gap-4">
          {pendingRequests.length === 0 && (
            <div className="text-gray-400">No pending requests.</div>
          )}
          {pendingRequests.map(req => {
            const campaign = req.campaign
            const totalSent = sentSummaryByCampaign[campaign?._id]?.totalSent || 0
            const outstanding = (campaign?.collectedAmount || 0) - totalSent
            return (
              <div key={req._id} className="bg-white shadow p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="font-bold text-primary">Campaign: {campaign?.title}</div>
                  <div>Requested Amount: <b>LKR {req.amount}</b></div>
                  <div>Outstanding: <b className="text-blue-700">LKR {outstanding.toLocaleString()}</b></div>
                  <div>Patient: {req.patientId?.name} ({req.patientId?.email})</div>
                  <div>Requested Date: {new Date(req.createdAt).toLocaleDateString()}</div>
                  <div className="italic text-xs text-gray-500">Reason: {req.message}</div>
                </div>
                <div className="flex flex-col gap-2 mt-4 md:mt-0">
                  <button onClick={() => handleSend(req._id)} className="bg-green-500 px-4 py-2 rounded text-white">Send Amount</button>
                  <button onClick={() => handleReject(req._id)} className="bg-red-500 px-4 py-2 rounded text-white">Reject</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* --- Section 2: Sended/Rejected, Campaigns Table, Filter/Search --- */}
      <div>
        <h3 className="text-lg mb-3 font-semibold text-blue-700">All Campaign Payouts</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search campaign..."
            className="border rounded px-3 py-2"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <select className="border rounded px-3 py-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="Sended">Sended</option>
            <option value="Rejected">Rejected</option>
            <option value="">All</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredCampaigns.length === 0 && (
            <div className="text-gray-400">No matching campaigns.</div>
          )}
          {filteredCampaigns.map(campaign => {
            const relatedRequests = requests.filter(r =>
              r.campaign._id === campaign._id &&
              (filterStatus ? r.status === filterStatus : true) &&
              (!date || r.createdAt.startsWith(date))
            )
            if (filterStatus && relatedRequests.length === 0) return null

            const totalSent = sentSummaryByCampaign[campaign._id]?.totalSent || 0
            const outstanding = (campaign.collectedAmount || 0) - totalSent

            return (
              <div key={campaign._id} className="bg-white shadow rounded-xl p-4 flex flex-col">
                <div className="flex items-center gap-6">
                  <img src={campaign.image?.[0]} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                  <div className="flex-1">
                    <div className="font-bold text-lg">{campaign.title}</div>
                    <div>Goal: LKR {campaign.goalAmount?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Outstanding: LKR {outstanding.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Sent: LKR {totalSent.toLocaleString()}</div>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                    onClick={() => setShowDetails(s => ({ ...s, [campaign._id]: !s[campaign._id] }))}
                  >
                    {showDetails[campaign._id] ? 'Show Less' : 'Show More'}
                  </button>
                </div>
                {showDetails[campaign._id] && (
                  <div className="mt-5 border-t pt-4">
                    <h4 className="text-base font-semibold mb-2">Transaction Details</h4>
                    <div className="space-y-3">
                      {relatedRequests
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .map(req => (
                          <div key={req._id} className="border-b pb-2 mb-2">
                            <div><b>Status:</b> <span className={
                              req.status === "Pending" ? "text-yellow-600" :
                              req.status === "Rejected" ? "text-red-600" :
                              "text-green-600"
                            }>{req.status}</span></div>
                            <div><b>Date:</b> {new Date(req.createdAt).toLocaleString()}</div>
                            <div><b>Amount:</b> LKR {req.amount}</div>
                            <div><b>Reason:</b> {req.message}</div>
                            {req.status === 'Rejected' && <div><b>Admin Reply:</b> {req.adminReply}</div>}
                            {req.status === 'Sended' && <div className="text-green-700 text-xs mt-1">{req.adminReply}</div>}
                          </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PatientRequest
