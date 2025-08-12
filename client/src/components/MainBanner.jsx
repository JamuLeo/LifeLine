import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative'>
        <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block'/>
        <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden'/>
        <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24' >
            <h1 className='text-3xl text-white md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-155 leading-tight lg:leading-15'>Give Hope. Fund Healing.!</h1>
            <h5 className=' text-center text-white md:text-left  md:max-w-95 lg:max-w-125 leading-tight '>Support medical campaigns and help patients access life-saving treatment. Every donation makes a difference.</h5>
        
            <div className='flex items-center mt-6 font-medium'>
                <Link to={"/donate"} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-button hover:bg-button-dull transition rounded text-white cursor-pointer'>
                Donate Now
                <img className='md:hidden transition group-focus:translate-x-1' src={assets.white_arrow_icon} alt="arrow" /></Link>

                <Link to={"/donate"} className='group hidden md:flex text-white items-center gap-2 px-9 py-3 cursor-pointer'>
                Start a Campaign
                <img className='transition group-hover:translate-x-1 ' src={assets.orange_arrow_icon} alt="arrow" /></Link>
            </div>
        </div>
    </div>
  )
}

export default MainBanner