import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

import { CampaignCards } from '../components/CampaignCards'  
import Categories from '../components/Categories'

const AllCampaign = () => {

    const {campaigns, searchQuery } = useAppContext()
    const [filteredCampaigns, setFilteredCampaigns] = useState([])

    useEffect(()=>{
      if(searchQuery.length > 0){
        setFilteredCampaigns(campaigns.filter(
          campaign => campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      }else{
        setFilteredCampaigns(campaigns)
      }
    },[campaigns,searchQuery])

  return (
    <div>
      <Categories/>
      <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>All Campaign</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:grid-cols-3 mt-6'>
        {filteredCampaigns.filter((campaign)=> campaign.isApprove).map((campaign,index)=>(
          <CampaignCards key={index} campaign={campaign}/>
        ))}
      </div>
    </div>
    </div>
    
  )
}

export default AllCampaign