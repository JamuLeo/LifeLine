import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { CampaignCards } from '../components/CampaignCards'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'

const Favorite = () => {
  const { campaigns, searchQuery } = useAppContext()
  const { user, isSignedIn } = useUser()
  const [favCampaigns, setFavCampaigns] = useState([])

  useEffect(() => {
    // Fetch favourites for logged-in donor
    const fetchFavourites = async () => {
      if (!isSignedIn || !user?.id) {
        setFavCampaigns([])
        return
      }
      try {
        const { data } = await axios.get(`/api/favourite/${user.id}`)
        if (data.success) {
          // data.favourites is array of {donorId, campaign}
          setFavCampaigns(data.favourites.map(fav => fav.campaign))
        } else {
          setFavCampaigns([])
        }
      } catch {
        setFavCampaigns([])
      }
    }
    fetchFavourites()
  }, [isSignedIn, user])

  // Optionally, apply search filter
  const displayedCampaigns = searchQuery.length > 0
    ? favCampaigns.filter(campaign =>
        (campaign.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : favCampaigns

  return (
    <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>Favourite</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:grid-cols-3 mt-6'>
        {displayedCampaigns.filter(campaign => campaign.isApprove).map((campaign, index) => (
          <CampaignCards key={campaign._id || index} campaign={campaign}/>
        ))}
      </div>
    </div>
  )
}

export default Favorite
