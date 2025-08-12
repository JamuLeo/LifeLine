import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserRequest = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get('/api/contact-request/all');
        if (data.success) setRequests(data.requests);
      } catch {
        setRequests([]);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Contact Form Submissions</h2>
      <div className="overflow-x-auto flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className=" border border-gray-200 rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Message</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5">No requests found.</td>
              </tr>
            ) : (
              requests.map((req, idx) => (
                <tr key={req._id || idx}>
                  <td className="px-3 py-2">{req.name}</td>
                  <td className="px-3 py-2">{req.email}</td>
                  <td className="px-3 py-2">{req.subject}</td>
                  <td className="px-3 py-2">{req.message}</td>
                  <td className="px-3 py-2">{new Date(req.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserRequest;
