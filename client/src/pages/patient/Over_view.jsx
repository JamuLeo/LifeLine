import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const Over_view = () => {
  const { axios } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalCollected: 0,
    collectedPerDay: [],
    table: [],
  });

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/campaign/overview");
        if (data.success) {
          setStats(data.data);
        }
      } catch {}
      setLoading(false);
    };
    fetchOverview();
  }, [axios]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!stats.table.length) return <div className="p-10 text-center">You haven’t created any campaigns yet.</div>;

  return (
    <div className=" w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-6">
      {/* Summary Rectangles */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-5 flex flex-col items-center shadow">
          <span className="text-lg text-blue-700 font-bold">Total Campaigns</span>
          <span className="text-3xl font-extrabold">{stats.totalCampaigns}</span>
        </div>
        <div className="bg-green-50 border-l-4 border-green-600 rounded-xl p-5 flex flex-col items-center shadow">
          <span className="text-lg text-green-700 font-bold">Total Collected</span>
          <span className="text-3xl font-extrabold">LKR {stats.totalCollected.toLocaleString()}</span>
        </div>
      </div>

      {/* Graph: Collected Amount by Date */}
      <div className="mb-10 bg-white p-4 rounded-xl shadow">
        <div className="font-semibold mb-3 text-lg">Collected Amount (Last 30 Days)</div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={stats.collectedPerDay}>
            <defs>
              <linearGradient id="collected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="amount" stroke="#10b981" fill="url(#collected)" name="Collected" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <div className="font-semibold mb-3 text-lg">My Campaigns</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Goal Amount</th>
              <th className="p-2 text-left">Collected</th>
            </tr>
          </thead>
          <tbody>
            {stats.table.map(c => (
              <tr key={c._id} className="border-t">
                <td className="p-2">
                  <img src={c.image} alt={c.title} className="w-14 h-12 object-cover rounded" />
                </td>
                <td className="p-2 font-bold">{c.title}</td>
                <td className="p-2">{c.category}</td>
                <td className="p-2">LKR {c.goalAmount?.toLocaleString()}</td>
                <td className="p-2 text-green-700">LKR {c.collectedAmount?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Over_view;
