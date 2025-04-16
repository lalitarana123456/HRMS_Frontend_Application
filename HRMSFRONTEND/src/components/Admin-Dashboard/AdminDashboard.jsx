import React, { useState, useEffect } from 'react'
import { IoMdSearch } from "react-icons/io";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { BiSolidCircle } from "react-icons/bi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../Admin-Sidebar/AdminSidebar';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {

  const [selectedButton, setSelectedButton] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // const handleButtonClick = (buttonName) => {
  //   setSelectedButton(buttonName);
  // };
  const handleButtonClick = (button) => {
    setSelectedButton(button);
    if (button === 'Employee') {
      navigate('/Admin Create Employee ID'); // Navigate to the Employee page
    }  if (button === 'Company') {
      navigate('/Admin Create Company ID'); // Navigate to the Company page
    }
  };

  const navigate = useNavigate()
  const ChangeRoute = (id) => {
    navigate(`/adminEdit/${id}`);
  }

  // const dashboardData = [
  //   {
  //     name: "Sachin",
  //     email: "SachinSachin10@gmail.com",
  //     phone: "+91  151557306311",
  //     employeeID: "369144",
  //     password: "22012000",
  //     action: "Online"
  //   },
  //   {
  //     name: "Anjali",
  //     email: "SachinSachin10@gmail.com",
  //     phone: "+91  151557306311",
  //     employeeID: "369144",
  //     password: "22012000",
  //     action: "Offline"
  //   },
  // ]

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [isSortedAsc, setIsSortedAsc] = useState(true);

const handleSort = () => {
  const sortedData = [...filteredEmployees].sort((a, b) =>
    isSortedAsc ? a.fullName.localeCompare(b.fullName) : b.fullName.localeCompare(a.fullName)
  );
  setFilteredEmployees(sortedData);
  setIsSortedAsc(!isSortedAsc); 
  // setCurrPage(1); 
};


  const getAllEmployees = async () => {
    const token = localStorage.getItem('token');


    if (token) {

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/admin/`,

          {
            headers: {
              Authorization: `Bearer ${token}`,

            },
          }

        );
     //   console.log(response.data);
        const employeeData = response.data.data || [];
        setEmployees(employeeData);
      }
      catch (error) {
        toast.error("Error Fetching API:", error.response || error);
      }
    } else {
      // console.log("Token not found in local storage");
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

 

  const handleSearch = () => {
    const filteredData = employees.filter((employee) => {
      return (
        employee.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.contactNumber?.includes(searchQuery) ||
        employee.employeeId?.includes(searchQuery)
      );
    });
    setFilteredEmployees(filteredData);
  };
  useEffect(() => {
    handleSearch();
  }, [searchQuery, employees]);
  

  return (
  // <div className='flex gap-10'>
  // <AdminSidebar/>
  <div
      id='main'
      className='w-screen bg-[#FFFCFE]  h-screen flex sm:overflow-x-hidden'>

      {/* <div
        id="Sidebar"
        className='sm:h-screen sm:w-[248px] border border-black bg-[#D9D9D91A] rounded-tr-[20px] rounded-br-[20px]'></div> */}

        <div><AdminSidebar/></div>

      <div
        id="dashboard"
        className='sm:w-[calc(100%-248px)] flex sm:flex-col'>

        <div
          id="header"
          className='sm:h-[35%] flex items-center'>

          <div className='sm:w-[95%] sm:h-[80%] mx-auto flex flex-col justify-around'>

            <div
              id="headerOne"
              className='sm:w-full sm:h-[62px] flex justify-between mx-auto'>

              <h1 className='sm:w-[321px] sm:h-[42px] font-roboto sm:font-bold sm:text-4xl my-auto'>Admin's Dashboard</h1>

              <span className='sm:h-full sm:w-[380px] flex justify-between'>

                <button
                  className={`w-44 h-16 my-auto border-black rounded-lg font-roboto sm:text-3xl 
                ${selectedButton === 'Employee' ? 'border-2 font-bold' : 'border font-normal'}`}
                  onClick={() => handleButtonClick('Employee')}>
                  Employee
                </button>

                <button
                  className={`w-44 h-16 my-auto border-black rounded-lg font-roboto sm:text-3xl
                ${selectedButton === 'Company' ? 'border-2 font-bold' : 'border font-normal'}`}
                  onClick={() => handleButtonClick('Company')}>
                  Company
                </button>

              </span>

            </div>

            <div
              id="searchBar"
              className='sm:w-[563px] sm:h-[47px] sm:border-2 border-[#0000000D] rounded-[10px] flex items-center justify-center'>

              <div className='sm:w-[543px] sm:h-[30px] flex items-center'>

                <IoMdSearch className='sm:w-[22px] sm:h-[22px] text-[#575757]' />

                <input
                  className='rounded h-full flex-grow sm:pl-2 font-roboto sm:text-2xl sm:font-normal outline-none'
                  type="search" 
                  placeholder='Search'
                  value={searchQuery}
                  onChange={handleSearchChange} />

                <button 
                onClick={handleSort}
                ><HiOutlineAdjustmentsHorizontal className='sm:w-[30px] sm:h-[30px] text-[#575757]' /></button>

              </div>

            </div>

          </div>

        </div>

        <div
          id="content"
          className='sm:h-[75%] sm:w-full overflow-y-auto'>

        <table className="border-collapse border font-inter w-full table-fixed">
          <thead>
            <tr className="h-20 sm:font-medium sm:text-2xl">
              <th className="border border-gray-300 p-2 w-[150px]">Name</th>
              <th className="border border-gray-300 p-2 w-[210px]">E-Mail ID</th>
              <th className="border border-gray-300 p-2 w-[120px]">Phone No</th>
              <th className="border border-gray-300 p-2 w-[120px]">Employee ID</th>
              {/* <th className="border border-gray-300 p-2 w-[200px]">Password</th> */}
              <th className="border border-gray-300 p-2 w-[100px]">Action</th>
              <th className="border border-gray-300 p-2 w-[100px]">Edit Profile</th>
            </tr>
          </thead>
          <tbody>
          {filteredEmployees.map((employee, _id) => (

                <tr
                  key={_id}
                  className='bg-white border border-gray-300 h-20 font-inter sm:font-normal sm:text-base'>

              <td className="flex items-center gap-2 sm:text-xl sm:font-medium h-20 pl-2 whitespace-normal break-words justify-center">
                {/* <img 
                src=""
                alt="" 
                className='sm:w-[50px] sm:h-[50px] border-2 border-black rounded-full'/> */}
                {/* { employee.name || employee.firstName + " " + employee.lastName } */}
              {employee.fullName}
              </td>

              <td 
              className="border-l border-gray-300 pl-3 whitespace-normal break-words">
                {employee.email}
              </td>

              <td 
              className="border-l border-gray-300 pl-3">
                {employee.contactNumber}
              </td>
              <td 
              className="border-l border-gray-300 pl-3 whitespace-normal break-words">
                {employee.employeeId}
              </td>

              {/* <td 
              className="border-l border-gray-300 pl-3 whitespace-normal break-words">
                {employee.password}
              </td> */}

              <td 
              className="border-l border-gray-300 pl-3">
                <span className='flex items-center gap-2 h-full'>
                  <BiSolidCircle className={`sm:text-xs sm:border-2 sm:border-[#D9D9D980] sm:rounded-full ${employee.status === "online" ? "text-green-500" : "text-red-500"}`}/>
                  {employee.status}
                </span>
              </td>

              <td 
              className="border-l border-gray-300">
                <button 
                 onClick={() => ChangeRoute(employee._id)}
                className='sm:w-[95px] sm:h-[40px] bg-[#BA439666] sm:rounded-[10px] border border-white shadow-xl font-inter sm:text-lg font-normal mx-auto flex items-center justify-center'>Edit</button>
              </td>
        
            </tr>
          ))}
          </tbody>
        </table>
        </div>

      </div>

    </div>
    // </div>
  )
}

export default AdminDashboard