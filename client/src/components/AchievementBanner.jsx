import React from 'react'
import { assets } from '../assets/assets'

const AchievementBanner = () => {
    return (
        <div className='mt-24 items-start md:items-center'>
            <div className="flex md:flex-row flex-col border border-primary/50 rounded-lg  justify-between gap-5 text-sm  bg-white p-8">
                <div className="space-y-4 md:max-w-75">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-500/10 w-max p-2.5 rounded">
                            <img src={assets.ab_image2} alt="" className='w-[22px] h-[22px]' />
                        </div>
                        <h3 className="text-base font-medium text-gray-800">5,200+ Lives Touched</h3>
                    </div>
                    <p className="text-gray-500">Humanity thrives on kindness, empathy, and the belief that every life matters.</p>
                </div>
                <div className="space-y-4 md:max-w-75">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-500/10 w-max p-2.5 rounded">
                            <img src={assets.ab_image3} alt="" className='w-[22px] h-[22px]' />
                        </div>
                        <h3 className="text-base font-medium text-gray-800"> 250 Million+ KWACHA Raised</h3>
                    </div>
                    <p className="text-gray-500">Humanity thrives on kindness and empathy, showing compassion and respect for all. Unity and solidarity bring us together, 
						while generosity and love inspire hope and equality for everyone.</p>
                </div>
                <div className="space-y-4 md:max-w-75">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-500/10 w-max p-2.5 rounded">
                            <img src={assets.ab_image1} alt="" className='w-[22px] h-[22px]' />
                        </div>
                        <h3 className="text-base font-medium text-gray-800">20,000+ Verified Donors</h3>
                    </div>
                    <p className="text-gray-500">We strive to serve with dedication and honesty, putting the needs of others first. Our commitment is to act with integrity and compassion in every step we take.</p>
                </div>
            </div>
        </div>
    )
}

export default AchievementBanner