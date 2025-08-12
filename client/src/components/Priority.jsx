import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CampaignCards } from './CampaignCards';  // Named import

const Priority = () => {
  const { campaigns } = useAppContext();
  
  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Emergency</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:grid-cols-3 mt-6'>
        {campaigns
          .filter(campaign => campaign.isApprove && campaign.isEmergency)
          .slice(0, 6)
          .map(campaign => (
            <CampaignCards key={campaign._id} campaign={campaign} />
          ))}
      </div>
    </div>
  );
};

export default Priority;