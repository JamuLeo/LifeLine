import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import { categories } from '../assets/assets'
import { CampaignCards } from '../components/CampaignCards'

const CampaignCategory = () => {
    const { campaigns } = useAppContext()
    const { category } = useParams()

    // Find the category object that matches the URL param 'category'
    const searchCategory = categories.find(
        (item) => item.path.toLowerCase() === category
    )

    // Filter campaigns whose category matches the category text (case insensitive)
    const filteredCampaigns = campaigns.filter(
        (campaign) => campaign.category.toLowerCase() === searchCategory?.text.toLowerCase()
    )

    return (
        <div className='mt-16'> 
            {searchCategory && (
                <div className='flex flex-col items-end w-max'>
                    <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
                    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
                </div>
            )}
            {filteredCampaigns.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:grid-cols-3 mt-6'>
                    {filteredCampaigns.map((campaign) => (
                        <CampaignCards key={campaign._id} campaign={campaign} />
                    ))}
                </div>
            ) : (
                <div className='flex items-center justify-center h-[60vh]'>
                    <p className='text-2xl font-medium text-primary'>No Campaign found in this category.</p>
                </div>
            )}
        </div>
    )
}

export default CampaignCategory
