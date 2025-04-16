import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdDashboard, MdKeyboardArrowLeft, MdEventRepeat } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FaUserClock, FaCreditCard,FaIdCard } from "react-icons/fa6";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { RiBillFill, RiMenu5Fill } from "react-icons/ri";
import { IoChevronDownSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { useNavigate, useLocation } from 'react-router-dom';
import { RiTeamFill } from "react-icons/ri";



const EmployerSidebar = () => 
{
  
  const [leaveDropdownOpen, setLeaveDropdownOpen] = useState(false);
  const [payrollDropdownOpen, setPayrollDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const togglePayrollDropdown = () => 
  {
    setPayrollDropdownOpen(!payrollDropdownOpen);
    setLeaveDropdownOpen(false);
  }

  const toggleLeaveDropdown = () =>
  {
    setLeaveDropdownOpen(!leaveDropdownOpen);
    setPayrollDropdownOpen(false);
  }

  const isActive = (path) => location.pathname === path;


  const toggleSidebar = () =>
  {
    setSidebarOpen(!sidebarOpen)
  }

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () =>
  {
    localStorage.removeItem("employeeData")
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (

    <div
    id='main'
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
      id='sidebar'
      className={`lg:w-[244px] bg-[#F5F5F5] lg:rounded-tr-3xl lg:rounded-br-3xl lg:shadow-2xl lg:relative h-screen w-[204px] rounded-tr-[17px] rounded-br-[17px] lg:opacity-100 backdrop-blur-md bg-opacity-40 lg:bg-opacity-100 lg:backdrop-blur-none 
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
        id="sidebarButtons"
        className='lg:w-[80%] lg:h-[50%] mx-auto mb-10'>

          <ul 
          className='flex flex-col lg:gap-0 gap-6 mx-3 lg:pt-[90px] pt-[60px] lg:mx-0'>
          
            <Link 
            to="/Company%20Home"
            className={`flex items-center lg:h-[40px] h-[30px] rounded-[20px] hover:border hover:border-gray-300 text-center transition-all duration-300 px-3
            ${isActive("/Company%20Home") 
            ? 'bg-[#D5EAE7] border-none font-bold' 
            : 'bg-transparent'}`}>
              <span className='flex items-center gap-2 font-lato lg:text-sm text-xs'>
                <MdDashboard className='text-xl'/>
                Dashboard
              </span>
            </Link>

            <Link 
            to="/employerUser"
            className={`flex items-center w-full lg:h-[40px] h-[30px] rounded-[20px] hover:border hover:border-gray-300 text-center transition-all duration-300 px-3
              ${isActive("/employerUser") 
              ? 'bg-[#D5EAE7] border-none font-bold' 
              : 'bg-transparent'}`}>
              <span className='flex items-center gap-2 font-lato lg:text-sm text-xs'>
                <FaUserCircle className='text-xl'/>
                Users
              </span>
            </Link>

            <Link 
            to="/Admin%20Create%20Employee%20ID"
            className={`flex items-center w-full lg:h-[40px] h-[30px] rounded-[20px] hover:border hover:border-gray-300 text-center transition-all duration-300 px-3
              ${isActive("/Admin%20Create%20Employee%20ID") 
              ? 'bg-[#D5EAE7] border-none font-bold' 
              : 'bg-transparent'}`}>
              <span className='flex items-center gap-2 font-lato lg:text-sm text-xs'>
                <FaIdCard className='text-xl'/>
                Create Employee ID
              </span>
            </Link>

            <Link 
            to="/employer-attendance"
            className={`flex items-center w-full lg:h-[40px] h-[30px] rounded-[20px] hover:border hover:border-gray-300 text-center transition-all duration-300 px-3
              ${isActive("/employer-attendance") 
              ? 'bg-[#D5EAE7] border-none font-bold' 
              : 'bg-transparent'}`}>
              <span className='flex items-center gap-2 font-lato lg:text-sm text-xs'>
                <FaUserClock className='text-xl'/>
                Attendance
              </span>
            </Link>

            <Link
            to="/employerPayroll"
            onClick={togglePayrollDropdown}
            className={`flex items-center w-full lg:h-[40px] h-[30px] rounded-[20px] hover:border hover:border-gray-300 text-center transition-all duration-300 justify-between px-3
              ${isActive("/employerPayroll") 
                ? 'bg-[#D5EAE7] border-none font-bold' 
                : 'bg-transparent'}`}>
              <span className='flex items-center gap-2 font-lato lg:text-sm text-xs'>
                <FaCreditCard className='text-xl'/>
                Payroll
              </span>
              <IoChevronDownSharp className={`lg:text-lg text-xs transition-transform duration-300 ${payrollDropdownOpen ? 'rotate-180' : ''}`}/>
            </Link>

            {payrollDropdownOpen && (
                <div className="w-[70%] lg:h-[40px] h-[30px] hover:border-gray-300 hover:border rounded-[20px] transition-all duration-300 ml-auto">
                  <Link to="/employerPayslip" className={`w-full lg:h-[40px] h-[30px] flex items-center pl-2`}>
                    <span className="flex font-lato lg:text-sm text-xs font-normal gap-2">
                      <RiBillFill className="text-xl" />
                      Payslip
                    </span>
                  </Link>
                </div>
              )}

              <Link 
              to="/leave-management"
              onClick={toggleLeaveDropdown}
              className={`flex items-center w-full lg:h-[40px] h-[30px] rounded-[20px] hover:border hover:border-gray-300 text-center transition-all duration-300 justify-between px-3
                ${isActive("/leave-management") 
                ? 'bg-[#D5EAE7] border-none font-bold' 
                : 'bg-transparent'}`}>
                <span className='flex items-center gap-2 font-lato lg:text-sm text-xs text-nowrap'>
                  <FaUserClock className='text-xl' />
                  Leave Management
                </span>
                <IoChevronDownSharp className={`lg:text-lg text-xs transition-transform duration-300 ${leaveDropdownOpen ? 'rotate-180' : ''}`}/>
              </Link>

              {leaveDropdownOpen && (
                  <div className="w-[70%] lg:h-[40px] h-[30px] hover:border-gray-300 hover:border rounded-[20px] transition-all duration-300 ml-auto">
                    <Link to="/leave-calender" className={`w-full lg:h-[40px] h-[30px] flex items-center pl-2`}>
                      <span className="flex font-lato lg:text-sm text-xs font-normal gap-2">
                        <MdEventRepeat className="text-xl" />
                        Update Leave
                      </span>
                    </Link>
                  </div>
              )}

              <Link 
              to="/Employer%20Performence%20Sheet"
              className={`flex items-center lg:h-[40px] h-[30px] rounded-[20px] hover:border hover:border-gray-300 text-center transition-all duration-300 px-3 text-nowrap
                ${isActive("/Employer%20Performence%20Sheet") 
                ? 'bg-[#D5EAE7] border-none font-bold' 
                : 'bg-transparent'}`}>
                <span className='flex items-center gap-2 font-lato lg:text-sm text-xs'>
                  <BiSolidBarChartAlt2 className='text-xl'/>
                  Performance Sheet
                </span>
              </Link>

              <Link 
              to="/team-leaders"
              className={`flex items-center lg:h-[40px] h-[30px] rounded-[20px] hover:border hover:border-gray-300 text-center transition-all duration-300 px-3 text-nowrap
                ${isActive("/team-leaders") 
                ? 'bg-[#D5EAE7] border-none font-bold' 
                : 'bg-transparent'}`}>
                <span className='flex items-center gap-2 font-lato lg:text-sm text-xs'>
                  <RiTeamFill className='text-xl'/>
                  Create Team
                </span>
              </Link>

              <Link 
              to="/employerProfile"
              className={`flex items-center w-full lg:h-[40px] h-[30px] rounded-[20px] hover:border lhover:border-gray-300 text-center transition-all duration-300 px-3
                ${isActive("/employerProfile") 
                  ? 'bg-[#D5EAE7] border-none font-bold' 
                  : 'bg-transparent'}`}>
                <span className='flex items-center gap-2 font-lato lg:text-sm text-xs font-normal'>
                  <FaUserCircle className='text-xl'/>
                  Profile
                </span>
              </Link>

            </ul>

          </div>

        <button 
        onClick={handleLogout} 
        className='lg:h-[10%] bg-[#D5EAE7] mt-auto absolute bottom-0 left-0 w-[204px] lg:rounded-br-3xl h-[61px] lg:w-full rounded-br-[17px]'>
          <span className='lg:w-full lg:h-full flex px-[30%] font-lato font-normal lg:text-base text-sm items-center hover:font-bold'>
            <TbLogout className='lg:w-[24px] lg:h-[24px] mr-2'/>
            Logout
          </span>
        </button>

      </div>

    </div>
  )
}

export default EmployerSidebar