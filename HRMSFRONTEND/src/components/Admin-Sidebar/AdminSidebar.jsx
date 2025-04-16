import React from 'react';
import { MdOutlineDashboard } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { TbSquarePlus2 } from "react-icons/tb";
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/adminLogin');
  };

  const isActive = (path) => location.pathname === path;

  return (
    
    <div 
    id="main" 
    className="h-screen sm:w-[248px] sm:rounded-tr-[20px] sm:rounded-br-[20px] bg-[#D9D9D91A] sm:relative">

      <div 
      id="logo" 
      className="sm:w-[200px] sm:h-[65px] flex items-center mx-auto justify-center gap-2">
        
        <img 
        className="sm:w-[40.59px] sm:h-[45.09px]" 
        src="./logo.png" 
        alt="Logo" />

        <span 
        className="font-chonburi font-normal text-[16px] leading-[16.8px]">
          THE ASSIGNER
        </span>

      </div>

      <div 
      id="sidebarButtons">
        
        <ul 
        className="flex flex-col sm:gap-1 sm:pt-[40px]">

          <Link
          to="/admin-dashboard"
          className={`sm:w-full sm:h-[49px] sm:rounded-tr-[10px] sm:rounded-br-[10px] 
          ${isActive('/admin-dashboard') 
            ? 'bg-[#55D1D966] font-semibold border-2 border-white shadow-md' 
            : 'hover:bg-[#55D1D966] font-normal'}`}>

            <span 
            className="sm:w-full sm:h-full font-roboto flex items-center sm:pl-9 sm:text-2xl">
              
              <MdOutlineDashboard className="sm:w-[24px] sm:h-[24px] sm:mr-2" />
              Dashboard
            
            </span>
          
          </Link>


          <Link
          to="/Admin Create Employee ID"
          className={`sm:w-full sm:h-[49px] sm:rounded-tr-[10px] sm:rounded-br-[10px] 
          ${isActive('/Admin Create Employee ID') 
            ? 'bg-[#55D1D966] font-semibold border-2 border-white shadow-md' 
            : 'hover:bg-[#55D1D966] font-normal'}`}>

            <span 
            className="sm:w-full sm:h-full font-roboto flex items-center sm:pl-9 sm:text-2xl">
              
              <TbSquarePlus2 className="sm:w-[24px] sm:h-[24px] sm:mr-2 -rotate-90" />
              Create ID

            </span>

          </Link>

        </ul>

      </div>

      <button
      onClick={handleLogout}
      className="sm:h-[70px] bg-[#55D1D966] sm:absolute sm:bottom-0 sm:w-[248px] sm:rounded-br-3xl hidden md:block">

        <span 
        className="sm:w-[77.36] sm:h-[23.33px] flex px-[30%]">
          
          <TbLogout className="sm:w-[24px] sm:h-[24px] sm:mr-2 font-normal font-roboto text-2xl" />
          Logout

        </span>

      </button>


    </div>
  );
};

export default AdminSidebar;