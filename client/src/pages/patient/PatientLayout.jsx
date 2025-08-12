import React from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { Link, NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const PatientLayout = () => {

    const { axios, navigate, setIsPatient, setPatient } = useAppContext();

   const user = {
    firstName: 'Patient',
    lastName: 'User',
    imageUrl: assets.profile_icon,
   }

    const sidebarLinks = [
        { name: "Overview", path: "/patient/overview", icon: assets.overview },
        { name: "Create Campaign", path: "/patient", icon: assets.add_icon },
        { name: "Donations", path: "/patient/donations", icon: assets.donate },
        { name: "Request", path: "/patient/My-Request", icon: assets.request },
    ];


const logout = async ()=>{
    try {
        const { data } = await axios.get('/api/patient/logout');
        
        setIsPatient(false);
        setPatient(null);
        if(data.success){
            toast.success(data.message)
            navigate('/')
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        setIsPatient(false);  
        setPatient(null);
        toast.success("Logged out");
        navigate('/');
    }
}


    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
                <Link to={'/'}>
                    <img src={assets.logo} alt="logo" className='coursor-pointer w-34 md:w-38' />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1'>Logout</button>
                </div>
            </div>
            <div className='flex '>
                
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col ">
                    <div className='items-center'>
                        <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' src={user.imageUrl} alt="" />
                        <p className='mt-2 text-base max-md:hidden'>{user.firstName}{" "}{user.lastName}</p>
                    </div>
                    
                    {sidebarLinks.map((item) => (
                        <NavLink to={item.path} key={item.name} end={item.path === "/patient"}
                            className={({isActive})=>`flex items-center py-3 px-4 gap-3 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                    : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            <img src={item.icon} alt="" className='w-7 h-7'/>
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet/>
            </div>
            
        </>
    );
};

export default PatientLayout