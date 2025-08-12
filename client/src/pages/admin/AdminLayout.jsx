import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { Link, NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const { axios, navigate,setIsAdmin } = useAppContext();
  const [openDropdown, setOpenDropdown] = useState(null);

  const sidebarLinks = [
    { name: "Overview", path: "/admin", icon: assets.overview },
    { name: "Campaign List", path: "/admin/campaign-list", icon: assets.product_list_icon },
    { name: "Campaign History", path: "/admin/campaign-history", icon: assets.history },
    {
      name: "Users",
      icon: assets.user,
      children: [
        { name: "Patient", path: "/admin/patient-details" },
        { name: "Donar", path: "/admin/donar-details" }
      ]
    },
    {
      name: "Request",
      icon: assets.request,
      children: [
        { name: "User Request", path: "/admin/user-request" },
        { name: "Patient Request", path: "/admin/patient-request" }
      ]
    },
    { name: "Donations", path: "/admin/donations-history", icon: assets.donate },
  ];

  const logout = async () => {
    try {
        const { data } = await axios.get('/api/admin/logout');
        if (data.success) {
            setIsAdmin(false);
            toast.success(data.message);
            navigate('/'); 
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};


  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <Link to={'/'}>
          <img src={assets.logo} alt="logo" className='coursor-pointer w-34 md:w-38' />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button onClick={logout} className='border rounded-full text-sm px-4 py-1'>Logout</button>
        </div>
      </div>
      <div className='flex '>
        
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
          {sidebarLinks.map((item, idx) => (
            <div key={item.name}>
              {!item.children ? (
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 gap-3
                    ${isActive
                      ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                      : "hover:bg-gray-100/90 border-white"
                    }`
                  }
                >
                  <img src={item.icon} alt="" className='w-7 h-7' />
                  <p className="md:block hidden text-center">{item.name}</p>
                </NavLink>
              ) : (
                <div>
                  <button
                    className={`
                      flex items-center py-3 px-4 gap-3 w-full
                      focus:outline-none hover:bg-gray-100/90
                      ${openDropdown === idx ? "bg-primary/10 text-primary" : ""}
                    `}
                    onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                    onMouseEnter={() => setOpenDropdown(idx)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    type="button"
                  >
                    <img src={item.icon} alt="" className='w-7 h-7' />
                    <p className="md:block hidden text-center">{item.name}</p>
                    <svg
                      className={`ml-auto transition-transform ${openDropdown === idx ? 'rotate-90' : 'rotate-0'}`}
                      width="14" height="14" viewBox="0 0 20 20"
                    >
                      <path d="M6 8l4 4 4-4" stroke="#6B7280" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                  {/* Inline Dropdown */}
                  <div
                    className={`flex flex-col overflow-hidden transition-all duration-300 ${
                      openDropdown === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                    onMouseEnter={() => setOpenDropdown(idx)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.children.map(child => (
                      <NavLink
                        to={child.path}
                        key={child.name}
                        className={({ isActive }) =>
                          `pl-14 py-2 text-sm transition
                          ${isActive ? "text-primary font-semibold bg-primary/5" : "text-gray-700 hover:bg-primary/10"}`
                        }
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default AdminLayout;
