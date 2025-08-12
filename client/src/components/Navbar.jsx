import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { TicketPlus } from 'lucide-react'

const Navbar = () => {
    const { user, isSignedIn } = useUser();      
    const { openSignIn } = useClerk();
    const { navigate, setSearchQuery, searchQuery } = useAppContext();

    const [open, setOpen] = useState(false);

    
    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/donate");
        }
    }, [searchQuery, navigate]);

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
            {/* Logo */}
            <NavLink to='/' onClick={() => setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="Logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/donate'>Donate</NavLink>
                <NavLink to='/about'>About</NavLink>
                <NavLink to='/contact'>Contact</NavLink>
                <NavLink to='/patient'>Create Campaign</NavLink>

                {/* Search */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input
                        onChange={e => setSearchQuery(e.target.value)}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search Campaign"
                    />
                    <img src={assets.search_icon} alt='Search' className='w-4 h-4' />
                </div>
                {/* Favourites */}
                <div onClick={() => navigate("/favourite")} className="relative cursor-pointer">
                    <img src={assets.favourite_icon} alt='favourite' className='w-6 opacity-80' />
                </div>
                {/* Auth Controls */}
                {!isSignedIn ? (
                    <button
                        onClick={openSignIn}
                        className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
                    >
                        Login
                    </button>
                ) : (
                    // Donor (Clerk)
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action
                                label="My Donation"
                                labelIcon={<TicketPlus width={15} />}
                                onClick={() => navigate('/my-donation')}
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                )}
            </div>

            {/* Mobile Hamburger */}
            <button onClick={() => setOpen(o => !o)} aria-label="Menu" className="sm:hidden">
                <img src={assets.menu_icon} alt='menu' />
            </button>

            {/* Mobile Menu */}
            {open && (
                <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50">
                    <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
                    <NavLink to="/donate" onClick={() => setOpen(false)}>Donate</NavLink>
                    <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
                    <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
                    <NavLink to="/patient" onClick={() => setOpen(false)}>Create Campaign</NavLink>
                    <NavLink to="/favourite" onClick={() => setOpen(false)}>Favourite</NavLink>
                    {isSignedIn && (
                        <NavLink to="/my-donation" onClick={() => setOpen(false)}>My Donation</NavLink>
                    )}
                    {/* Mobile Auth Controls */}
                    {!isSignedIn ? (
                        <button
                            onClick={() => {
                                setOpen(false);
                                openSignIn();
                            }}
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setOpen(false);
                                window.Clerk?.signOut?.(); 
                            }}
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    )
}
export default Navbar
