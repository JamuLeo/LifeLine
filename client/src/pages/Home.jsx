import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import MainBanner from '../components/MainBanner';
import Categories from '../components/Categories';
import Priority from '../components/Priority';
import BottomBanner from '../components/BottomBanner';
import NewsLetter from '../components/NewsLetter';
import AchievementBanner from '../components/Achievementbanner';
import BlogBanner from '../components/BlogBanner';
import SlideBar from '../components/SlideBar';
import { CampaignCards, dummyCampaigns } from '../components/CampaignCards';

const Home = () => {
  const { axios } = useAppContext();
  const [campaigns, setCampaigns] = useState(dummyCampaigns);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await axios.get('/api/campaign/list');
        
        if (data?.success) {
          // Transform backend campaigns to match frontend expectations
          const backendCampaigns = data.campaigns.map(campaign => ({
            _id: campaign._id,
            userId: campaign.patientId,
            title: campaign.title,
            description: Array.isArray(campaign.description) 
              ? campaign.description 
              : [campaign.description],
            category: campaign.category,
            goal_amount: campaign.goalAmount,  // Map goalAmount to goal_amount
            collectedAmount: campaign.collectedAmount || 0,
            progress: campaign.collectedAmount / campaign.goalAmount,
            address: typeof campaign.address === 'object' 
              ? campaign.address.city 
              : campaign.address,
            donors: campaign.donors || 0,
            endDate: campaign.endDate,
            image: Array.isArray(campaign.image) ? campaign.image : [campaign.image],
            isApprove: true, // Force approve for display
            isEmergency: campaign.isEmergency || false,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt
          }));

          // Combine with dummy campaigns, removing duplicates by title
          const combinedCampaigns = [
            ...backendCampaigns,
            ...dummyCampaigns.filter(dummy => 
              !data.campaigns.some(api => api.title === dummy.title)
            )
          ];
          
          setCampaigns(combinedCampaigns);
          console.log('Processed campaigns:', combinedCampaigns); // Debug
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        // Fallback to dummy data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [axios]);

  return (
    <div className='mt-10'>
      <MainBanner/>
      <AchievementBanner/>
      <BlogBanner/>
      <Categories/>
      <Priority/>
      
      {/* All Campaigns Section */}
      <div className="mt-16 px-4">
        <div className='flex flex-col items-end w-max mb-6 mx-auto'>
          <p className='text-2xl font-medium uppercase'>All Campaigns</p>
          <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {campaigns
              .filter(campaign => campaign.isApprove)
              .map(campaign => (
                <div key={campaign._id} className="w-full">
                  <CampaignCards campaign={campaign} />
                </div>
              ))}
          </div>
        )}
      </div>

      <SlideBar/>
      <BottomBanner/>
      <NewsLetter/>
    </div>
  );
};

export default Home;