import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';


function getDaysLeft(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
}

const Campaign_DetailPage = () => {
    const { campaigns, currency, axios, fetchCampaigns } = useAppContext();
    const { id } = useParams();
    const [thumbnail, setThumbnail] = useState(null);
    const [progress, setProgress] = useState(0);

    const campaign = campaigns.find((item) => item._id === id);

    const toggleApprove = async (id, isApprove) => {
        try {
            const { data } = await axios.post('/api/campaign/approve', { id, isApprove });
            if (data.success) {
                fetchCampaigns();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const campaignProgress = campaign && campaign.goalAmount
        ? Math.min(campaign.collectedAmount / campaign.goalAmount, 1)
        : 0;

    useEffect(() => {
        let anim;
        if (progress < campaignProgress) {
            anim = setTimeout(() => setProgress((p) => {
                const next = p + 0.02;
                return next >= campaignProgress ? campaignProgress : next;
            }), 16);
        }
        return () => clearTimeout(anim);
    }, [progress, campaignProgress]);

    useEffect(() => {
        if (campaign) setThumbnail(campaign.image?.[0] || null);
    }, [campaign]);

    const daysLeft = campaign ? getDaysLeft(campaign.endDate) : 0;

    if (!campaign) return <div className="p-10 text-center">Campaign not found.</div>;

    return (
        <div className="flex justify-center mt-8 mb-16 px-2">
            <div className="bg-white rounded-xl w-5xl ml-8 max-w-5xl p-4 md:p-8">
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-3">
                            {campaign.image.map((image, index) => (
                                <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-200 rounded overflow-hidden cursor-pointer" >
                                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <div className="border border-gray-200 max-w-100 rounded overflow-hidden">
                            <img src={thumbnail} alt="Selected product" />
                        </div>
                    </div>
                    <div className="text-sm w-full md:w-1/2">
                        <div className='flex items-center gap-4'>
                            <h1 className="text-3xl font-medium flex-1">{campaign.title}</h1>
                            <p className="text-xl font-medium text-red-500">Verify</p>
                            <label className="relative items-center cursor-pointer text-gray-900 gap-3">
                                <input onClick={() => toggleApprove(campaign._id, !campaign.isApprove)} checked={campaign.isApprove} type="checkbox" className="sr-only peer" readOnly />
                                <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                            </label>
                        </div>

                        <div className="mt-6">
                            {/* Progress Bar */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-gray-200 w-full h-2 rounded-full overflow-hidden">
                                    <div className="bg-red-500 h-2 rounded-full transition-all duration-700"
                                        style={{ width: `${progress * 100}%` }}></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{Math.round(progress * 100)}%</span>
                            </div>
                            <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1 text-xl">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#64748b" /></svg>
                                    {campaign.donors || 0} Donors
                                </div>
                                <div className="flex items-center gap-1 text-xl">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="2" /><path d="M12 6v6l4 2" stroke="#64748b" strokeWidth="2" /></svg>
                                    {daysLeft} days left
                                </div>
                            </div>
                            <p className="text-2xl font-medium">
                                Goal: {currency}{campaign.goalAmount?.toLocaleString()}
                            </p>
                            <span className="text-gray-500/70">(inclusive of all taxes)</span>
                        </div>
                        <p className="text-base font-medium mt-6">About Campaign</p>
                        <ul className="list-disc ml-4 text-gray-500/70">
                            {campaign.description[0]}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-10">
                    <p className="text-base font-medium mt-6">Our Story</p>
                    <ul className="list-disc ml-4 mt-6 text-gray-500/70">
                        {campaign.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>
                </div>

                {/* ---- Patient Address & Bank Details Section ---- */}
                <div className="mt-10 flex flex-col md:flex-row gap-12">
                    {/* Address */}
                    <div className="flex-1 border rounded-lg p-6 bg-gray-50">
                        <div className="text-xl font-bold mb-3">Patient Address</div>
                        {campaign.address ? (
                            <ul className="text-gray-700 space-y-1">
                                <li><span className="font-semibold">Street:</span> {campaign.address.street}</li>
                                <li><span className="font-semibold">City:</span> {campaign.address.city}</li>
                                <li><span className="font-semibold">Province:</span> {campaign.address.province}</li>
                                <li><span className="font-semibold">Phone:</span> {campaign.address.phone}</li>
                            </ul>
                        ) : (
                            <div className="text-gray-400">No address details</div>
                        )}
                    </div>
                    {/* Bank Account */}
                    <div className="flex-1 border rounded-lg p-6 bg-gray-50">
                        <div className="text-xl font-bold mb-3">Bank Details</div>
                        {campaign.account ? (
                            <ul className="text-gray-700 space-y-1">
                                <li><span className="font-semibold">Account Holder:</span> {campaign.account.fullName}</li>
                                <li><span className="font-semibold">Bank:</span> {campaign.account.bankName}</li>
                                <li><span className="font-semibold">Account Number:</span> {campaign.account.accNumber}</li>
                                <li><span className="font-semibold">Branch:</span> {campaign.account.branch}</li>
                            </ul>
                        ) : (
                            <div className="text-gray-400">No account details</div>
                        )}
                    </div>
                </div>
                {/* ---- End Patient Address & Bank Details ---- */}
            </div>
        </div>
    );
};

export default Campaign_DetailPage;
