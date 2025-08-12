import React, { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'

const PatientList = () => {
    const { patients, fetchPatients, navigate } = useAppContext();

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div className="no-scrollbar flex-1 overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Patients</h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Name</th>
                                <th className="px-4 py-3 font-semibold truncate">Email</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {patients.map((patient) => (
                                <tr key={patient._id} className="border-t border-gray-500/20">
                                    <td onClick={()=> {navigate(`/admin/patient-details/${patient._id}`); scrollTo(0,0)}} className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate cursor-pointer">
                                        <span className="truncate max-sm:hidden w-full">{patient.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{patient.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default PatientList;
