import React, { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { FaUserClock } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { HiCreditCard } from "react-icons/hi";
import { MdOutlineBarChart } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { RiMenu5Fill } from "react-icons/ri";
import { Link, useNavigate, useLocation } from 'react-router-dom';


const Sidebar = () => 
{
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () =>
  {
    setSidebarOpen(!sidebarOpen)
    
  }

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () =>
  {
    localStorage.removeItem("token");
    localStorage.removeItem("employeeData");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    
    <div 
    id="main"
    className='h-screen'>

      {!sidebarOpen && (
      <button
        id='openSidebar'
        onClick={toggleSidebar}
        className='lg:hidden text-2xl absolute top-5 left-5'>
        <RiMenu5Fill />
      </button>
      )}

      <div 
      id="sidebar"
      className={`lg:w-[100%] bg-[#F5F5F5] lg:rounded-tr-3xl lg:rounded-br-3xl lg:shadow-2xl lg:relative h-screen w-[204px] rounded-tr-[17px] rounded-br-[17px] lg:opacity-100 backdrop-blur-md bg-opacity-40 lg:bg-opacity-100 lg:backdrop-blur-none
      ${sidebarOpen ? 'block' : 'hidden'} lg:block fixed z-40`}>

        <button 
        id='collapse'
        onClick={toggleSidebar}
        className='lg:hidden ml-44 mt-5 text-2xl'><MdKeyboardArrowLeft/></button>

        <div 
        id="heading"
        className='flex lg:w-[189px] lg:h-[49px] gap-2 lg:mx-auto lg:pt-[50px] w-[194px] h-[43px] mx-6 pt-[20px]'>

          <img 
          className='w-[42px] h-[43px] '
          src="./logo.png" 
          alt="Logo" />

          <h1 
          className='lg:w-[145px] lg:h-[38px] lg:text-[30px] font-bold text-[24px] lg:my-0 my-1'>
            My HRMS
          </h1>

        </div>

        <div
        id='sidebarButtons'>

          <ul className='flex flex-col lg:gap-1 gap-3 mx-3 lg:pt-[90px] pt-[60px]'>

            <Link 
            to="/dashboard"
            className={`lg:w-full lg:h-[40px] rounded-[15px] lg:pl-5 w-[180px] h-[35px] flex items-center 
            ${isActive('/dashboard') 
            ? 'bg-[#D5EAE7] font-bold' 
            : 'hover:bg-[#D5EAE7]'}`}>
              <span className='lg:w-[141.36px] lg:h-[23.33px] w-[141.36px] h-[23.33px] flex items-center lg:text-sm text-md font-lato lg:pl-0 pl-2'>
                <MdDashboard className='w-[24px] h-[24px] mr-2'/>
                Dashboard
              </span>
            </Link>

            <Link to="/leave"
            className={`lg:w-full lg:h-[40px] rounded-[15px] lg:pl-5 w-[180px] h-[35px] flex items-center
            ${isActive("/leave") 
            ? 'bg-[#D5EAE7] font-bold' 
            : 'hover:bg-[#D5EAE7]'}`}>
              <span className='lg:w-[188px] lg:h-[24px] w-[188px] h-[24px] lg:text-sm text-md   flex items-center font-lato lg:pl-0 pl-2'>
                <FaUserClock className='w-[24px] h-[24px] mr-2'/>
                Leave Management
              </span>
            </Link>
            
            <Link 
            to="/Employee Performence Sheet Details"
            className={`lg:w-full lg:h-[40px] rounded-[15px] lg:pl-5 w-[180px] h-[35px] flex items-center
            ${isActive("/PerformenceSheet") 
            ? 'bg-[#D5EAE7] font-bold' 
            : 'hover:bg-[#D5EAE7]'}`}>
              <span className='lg:w-[185px] lg:h-[24px] lg:text-sm text-md flex items-center font-lato lg:pl-0 pl-2'>
                <MdOutlineBarChart className='w-[24px] h-[24px] mr-2'/>
                Performance Sheet
              </span>
            </Link>
            
            <Link 
            to="/payroll"
            className={`lg:w-full lg:h-[40px] rounded-[15px] lg:pl-5 w-[180px] h-[35px] flex items-center 
            ${isActive('/payroll') 
            ? 'bg-[#D5EAE7] font-bold' 
            : 'hover:bg-[#D5EAE7]'}`}>
              <span className='flex items-center lg:text-sm text-md lg:w-[172px] lg:h-[24.11px] font-lato lg:pl-0 pl-2'>
                <HiCreditCard className='w-[24px] h-[24px] mr-2'/>
                Payroll & Payslips
              </span>
            </Link>
            
            <Link 
            to="/User-Profile" 
            className={`lg:w-full lg:h-[40px] rounded-[15px] lg:pl-5 w-[180px] h-[35px] flex items-center
            ${isActive("/User-Profile") 
            ? 'bg-[#D5EAE7] font-bold' 
            : 'hover:bg-[#D5EAE7]'}`}>
              <span className='flex items-center lg:text-sm text-md lg:w-[137px] lg:h-[24.89px] font-lato lg:pl-0 pl-2'>
                <FaUserCircle className='w-[24px] h-[24px] mr-2'/>
                My Profile
              </span>
            </Link>
          
          </ul>

        </div>

        <button 
        onClick={handleLogout} 
        className='lg:h-[10%] bg-[#D5EAE7] mt-auto absolute bottom-0 left-0 w-[204px] lg:rounded-br-3xl h-[61px] lg:w-full rounded-br-[17px]'>
          <span className='lg:w-full lg:h-full flex px-[30%] font-lato font-normal text-base items-center hover:font-bold'>
            <TbLogout className='lg:w-[24px] lg:h-[24px] mr-2'/>
            Logout
          </span>
        </button>

    </div>

  </div>
  );
};

export default Sidebar;