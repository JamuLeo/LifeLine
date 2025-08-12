import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import ReactDOM from 'react-dom';

// Delete Confirmation Modal Component
const DeleteModal = ({ show, title, onCancel, onConfirm, isDeleting }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Prevent scrollbar shift
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [show]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with click handler to close */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCancel}
      ></div>
      
      {/* Modal container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all duration-300 w-full max-w-md mx-4">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-t-xl">
          <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
        </div>
        
        {/* Modal body */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete <span className="font-semibold">"{title}"</span>? This action cannot be undone.
          </p>
        </div>
        
        {/* Modal footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 flex items-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : 'Delete Campaign'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const CampaignList = () => {
    const { campaigns, currency, axios, fetchCampaigns, navigate } = useAppContext();
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        campaignId: null,
        campaignTitle: ''
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Toggle emergency status
    const toggleEmergency = async (id, isEmergency) => {
        try {
            const { data } = await axios.put('/api/campaign/emergency', { id, isEmergency });
            if (data.success) {
                await fetchCampaigns();
                toast.success(data.message);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Toggle approval status
    const toggleApprove = async (id, isApprove) => {
        try {
            const { data } = await axios.put('/api/campaign/approve', { id, isApprove });
            if (data.success) {
                await fetchCampaigns();
                toast.success(data.message);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Open delete confirmation modal
    const openDeleteModal = (campaignId, campaignTitle) => {
        setDeleteModal({
            show: true,
            campaignId,
            campaignTitle
        });
    };

    // Close delete modal
    const closeDeleteModal = () => {
        if (!isDeleting) {
            setDeleteModal({
                show: false,
                campaignId: null,
                campaignTitle: ''
            });
        }
    };

    // Delete campaign
    const handleDeleteCampaign = async () => {
        setIsDeleting(true);
        try {
            const { data } = await axios.delete(`/api/campaign/delete/${deleteModal.campaignId}`);
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to delete campaign');
            }

            await fetchCampaigns();
            toast.success('Campaign deleted successfully');
            closeDeleteModal();
        } catch (error) {
            console.error('Delete error:', error);
            const errorMessage = error.response?.data?.message || 
                              error.message || 
                              'Failed to delete campaign. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Delete Confirmation Modal */}
            <DeleteModal
                show={deleteModal.show}
                title={deleteModal.campaignTitle}
                onCancel={closeDeleteModal}
                onConfirm={handleDeleteCampaign}
                isDeleting={isDeleting}
            />

            <div className="w-full p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Campaigns</h2>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Campaign</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Goal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Emergency</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {campaigns.map((campaign) => (
                                    <tr 
                                        key={campaign._id} 
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/admin/campaign-list/${campaign._id}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                                                    <img 
                                                        className="h-full w-full object-cover" 
                                                        src={campaign.image?.[0] || '/placeholder-campaign.jpg'} 
                                                        alt={campaign.title} 
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-campaign.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {campaign.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(campaign.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                                                {campaign.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                            {currency}{campaign.goalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer" 
                                                    checked={campaign.isApprove}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleApprove(campaign._id, e.target.checked);
                                                    }}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-green-600 transition-all"></div>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer" 
                                                    checked={campaign.isEmergency}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleEmergency(campaign._id, e.target.checked);
                                                    }}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-blue-600 transition-all"></div>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteModal(campaign._id, campaign.title);
                                                    }}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    title="Delete campaign"
                                                    aria-label="Delete campaign"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignList;