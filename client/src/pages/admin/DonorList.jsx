import React, { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'

const DonorList = () => {
  const { donors, fetchDonors, navigate } = useAppContext();

  useEffect(() => {
    fetchDonors();
  }, []);

  return (
    <div className="no-scrollbar flex-1 overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Donors</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Profile</th>
                <th className="px-4 py-3 font-semibold truncate">Name</th>
                <th className="px-4 py-3 font-semibold truncate">Email</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {donors.map((donor) => (
                <tr
                  key={donor._id}
                  className="border-t border-gray-500/20 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { navigate(`/admin/donor-details/${donor._id}`); scrollTo(0, 0); }}


                >
                  <td className="px-4 py-3">
                    <img src={donor.image} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="px-4 py-3">{donor.name}</td>
                  <td className="px-4 py-3">{donor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DonorList;
