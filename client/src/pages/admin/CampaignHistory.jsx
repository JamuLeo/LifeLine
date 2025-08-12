import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "jspdf-autotable";

const CampaignHistory = () => {
  const { axios } = useAppContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("All"); 

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/dashboard-stats');
        if (data.success) setStats(data.stats);
      } catch (e) { }
      setLoading(false);
    };
    fetchDashboardStats();
  }, [axios]);

  // --- FILTER LOGIC ---
  const filteredActivities = (stats?.recentActivities || []).filter(item => {
    const matchesSearch =
      item.campaign?.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.toLowerCase().includes(search.toLowerCase()) ||
      (item.donor?.toLowerCase?.().includes(search.toLowerCase()) ?? false);
    const matchesType =
      userType === "All" ||
      (userType === "Patient" && item.role?.toLowerCase() === "patient") ||
      (userType === "Donor" && item.role?.toLowerCase() === "donor");
    return matchesSearch && matchesType;
  });

  // --- EXPORT TO CSV/EXCEL ---
  const exportToExcel = () => {
    const data = filteredActivities.map(item => ({
      User: item.user,
      Role: item.role,
      Action: item.action,
      Campaign: item.campaign,
      Date: item.date,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "History");
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([buf]), "CampaignHistory.xlsx");
  };

  

  if (loading || !stats)
    return <div className="p-10 text-center text-xl text-gray-400">Loading dashboard...</div>;

  return (
    <div className="p-6 w-5xl max-w-full mx-auto md:p-10">
      <h2 className="font-bold text-lg mb-3">Recent Activities</h2>
      {/* Search/Filter/Export Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by user, donor, campaign..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-primary px-3 py-2 rounded"
        />
        <select
          value={userType}
          onChange={e => setUserType(e.target.value)}
          className="border border-primary px-3 py-2 rounded"
        >
          <option value="All">All User Types</option>
          <option value="Patient">Patient</option>
          <option value="Donor">Donor</option>
        </select>
        <button
          onClick={exportToExcel}
          className="bg-primary hover:bg-primary-dull text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
        
      </div>
      <div className="bg-white border w-full rounded-lg overflow-x-auto">
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
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">No matching activities.</td>
              </tr>
            )}
            {filteredActivities.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{item.user}</td>
                <td className="p-3">{item.role}</td>
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
};

export default CampaignHistory;
