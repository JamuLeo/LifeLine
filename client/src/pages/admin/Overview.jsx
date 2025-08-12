import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { categories } from "../../assets/assets"; 
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Overview() {
  const { axios } = useAppContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/dashboard-stats');
        if (data.success) setStats(data.stats);
      } catch (e) {
        
      }
      setLoading(false);
    };
    fetchDashboardStats();
  }, [axios]);

  if (loading || !stats) {
    return <div className="p-10 text-center text-xl text-gray-400">Loading dashboard...</div>;
  }

  
  const maxAmount = Math.max(
    ...categories.map(cat => {
      const entry = stats.donationsByCategory?.find(x => x.category === cat.path);
      return entry?.amount || 0;
    }),
    1
  );

  return (
    <div className="p-6 md:p-10">
      {/* Title */}
      <h1 className="font-bold text-2xl md:text-3xl mb-6">Admin Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatBox label="Total Campaigns" value={stats.totalCampaigns} />
        <StatBox label="Total Donations" value={`LKR ${stats.totalDonations?.toLocaleString()}`} />
        <StatBox label="Active Users" value={stats.activeUsers} />
        <StatBox label="New Campaigns This Month" value={stats.newCampaignsThisMonth} />
      </div>

      {/* Performance Section */}
      <h2 className="font-bold text-lg mb-3">Campaign Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Donations by Category */}
        <div className="bg-white border rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-lg font-bold">
                LKR {categories.reduce((sum, cat) => {
                  const entry = stats.donationsByCategory?.find(x => x.category === cat.path);
                  return sum + (entry?.amount || 0);
                }, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                Last Year <span className="text-green-600 font-semibold">+15%</span>
              </div>
            </div>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end h-28 gap-4 mt-4">
            {categories.map(cat => {
              const entry = stats.donationsByCategory?.find(x => x.category === cat.path) || { amount: 0 };
              const chartHeight = 96;
              const barHeight = Math.max((entry.amount / maxAmount) * chartHeight, 10);
              return (
                <div key={cat.path} className="flex flex-col items-center">
                  <div
                    className="w-7 rounded transition-all"
                    style={{
                      height: `${barHeight}px`,
                      background: cat.bgColor || "#E5E7EB", 
                    }}
                    title={entry.amount.toLocaleString()}
                  />
                  <div className="text-xs mt-1 text-gray-500 text-center w-14 truncate">{cat.text}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Growth Chart */}
        <div className="bg-white border rounded-lg p-5">
  <div className="flex items-center justify-between mb-2">
    <div>
      <div className="text-lg font-bold">{stats.newCampaignsThisMonth}</div>
      <div className="text-xs text-gray-400">
        Last 6 Months <span className="text-green-600 font-semibold">+10%</span>
      </div>
    </div>
  </div>
  {/* Modern Area Chart */}
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart data={stats.campaignGrowth}>
      <defs>
        <linearGradient id="campaignGrowth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" fontSize={12} />
      <YAxis fontSize={12} allowDecimals={false} />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="count"
        stroke="#3b82f6"
        fill="url(#campaignGrowth)"
        name="Campaigns"
        strokeWidth={2}
        dot={{ r: 4, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
      />
    </AreaChart>
  </ResponsiveContainer>
</div>
      </div>

      {/* Recent Activities */}
      <h2 className="font-bold text-lg mb-3">Recent Activities</h2>
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left p-3 font-semibold">User</th>
              <th className="text-left p-3 font-semibold">Role</th>
              <th className="text-left p-3 font-semibold">Action</th>
              <th className="text-left p-3 font-semibold">Campaign</th>
              <th className="text-left p-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentActivities?.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{item.user}</td>
                <td className="p-3">{item.role || '-'}</td>
                <td className="p-3">{item.action}</td>
                <td className="p-3">{item.campaign}</td>
                <td className="p-3">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Simple stat card
function StatBox({ label, value }) {
  return (
    <div className="bg-gray-100 rounded-lg px-5 py-6 flex flex-col items-start">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="font-bold text-xl md:text-2xl mt-2">{value}</span>
    </div>
  );
}
