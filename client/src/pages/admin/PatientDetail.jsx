import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";

const PatientDetail = () => {
  const { axios, navigate } = useAppContext();
  const { id } = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch patient details and their campaigns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch patient info
        const { data: patientRes } = await axios.get(`/api/patient/single/${id}`);
        if (patientRes.success) setPatient(patientRes.patient);

        // Fetch this patient's campaigns
        const { data: campRes } = await axios.get(`/api/campaign/by-patient/${id}`);
        if (campRes.success) setCampaigns(campRes.campaigns);
      } catch (error) {}
      setLoading(false);
    };
    fetchData();
  }, [axios, id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!patient) return <div className="p-10 text-center">Patient not found.</div>;

  return (
    <div className="flex-1 w-full max-w-full md:ml-10 md:mr-30">
      <div className="w-full mx-auto p-2 sm:p-4 md:py-8 md:px-6">
        <div className="flex items-center gap-4 p-4">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center">
            <svg width="60" height="60" viewBox="0 0 48 48">
              <circle cx="24" cy="18" r="10" fill="#111" />
              <ellipse cx="24" cy="39" rx="16" ry="8" fill="#111" />
            </svg>
          </div>
          {/* Dynamic Name and Email */}
          <div>
            <div className="text-5xl font-bold leading-none">{patient.name}</div>
            <div className="text-3xl mt-1 text-black">{patient.email}</div>
          </div>
        </div>

        {campaigns.length === 0
          ? <div className="p-10 text-center">This patient has not created any campaigns yet.</div>
          : campaigns.map((campaign) => {
            const percent = Math.round((campaign.collectedAmount / campaign.goalAmount) * 100);
            return (
              <div onClick={() => { navigate(`/admin/campaign-list/${campaign._id}`); scrollTo(0, 0) }} key={campaign._id} className="border-primary/30 border-1 p-10 rounded-xl shadow-xl mb-6 cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Campaign</h3>
                    <div className="font-bold mt-2">{campaign.title}</div>
                    <p className="text-gray-500 text-sm mb-2">{campaign.description?.[0]}</p>
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
                      LKR {campaign.collectedAmount?.toLocaleString()} raised of LKR {campaign.goalAmount?.toLocaleString()} goal
                    </span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-black rounded transition-all"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PatientDetail;
