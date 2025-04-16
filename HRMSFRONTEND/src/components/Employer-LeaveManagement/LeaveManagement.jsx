import React, { useState, useEffect } from 'react';
import { IoSearchOutline, IoFilterOutline, IoCheckmarkSharp, IoClose } from 'react-icons/io5';
import { RiArrowUpDownLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import EmployerSidebar from '../Employer-Sidebar/EmployerSidebar';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";



const LeaveMgmt = () => {
  const [showModal, setShowModal] = useState(false);
  const [textareaVisible, setTextareaVisible] = useState(false);
  const [reason, setReason] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [leaveDetails, setLeaveDetails] = useState(null);
  
  const [searchQuery, setsearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [isChecked, setIsChecked] = 
  useState({
      UIUX: false,
      FrontEnd: false,
      BackEnd: false,
      HR: false,
      SocialMedia: false,
      Finance: false,
      Research: false
    }
  );

  const [isFilter, setIsFilter] = useState(false);

  const filterToggle = () => 
  {
    setIsFilter(!isFilter)
  }

  const handleToggle = () => 
  {
    setIsOpen(!isOpen);
    console.log(!isOpen);
  }

  
  const handleChecked = (option) => 
  {
    setIsChecked((prev) => 
    {
      const updatedState = { ...prev, [option]: !prev[option] };
      const selectedDesignations = Object.keys(updatedState).filter((key) => updatedState[key]);
      setSelectedDesignation(selectedDesignations.length ? selectedDesignations : null);
      setCurrPage(1);
      return updatedState;
    });
  };
  

  const filteredLeaves = pendingLeaves.filter((pendingLeave) => 
  {
    const matchesSearch = searchQuery.length >= 1
      ? pendingLeave.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pendingLeave.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pendingLeave.designation.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
  
    const matchesDesignation = selectedDesignation
    ? selectedDesignation.some((designation) => pendingLeave.designation.toLowerCase().includes(designation.toLowerCase()))
    : true;
    return matchesSearch && matchesDesignation;
  });
  

  const recPerPage = 5;
  const lastInd = currPage * recPerPage;
  const firstInd = lastInd - recPerPage;
  const rec = filteredLeaves.slice(firstInd, lastInd);
  const npages = Math.ceil(filteredLeaves.length / recPerPage);
  const num = [...Array(npages).keys()].map((n) => n + 1);

  const nextPage = () => 
  {
    if (currPage < npages) {
      setCurrPage(currPage + 1);
    }
  };

  const prevPage = () => 
  {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    }
  };

  const getPendingLeaves = async () =>
  {
    try
    {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/administrative/leaves/pending-leaves`, {
        headers: 
        {
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
        }
      });
      console.log(response.data)
      setPendingLeaves(response.data || []);
    }
    catch(error)
    {
      console.error("Error Fetching Pending Leaves: ", error);
      if (error.response) 
      {
        console.error("Server responded with error: ", error.response.data);
        toast.error(`Error: ${error.response.data.message}`);
      } else 
      {
          toast.error("Failed To Fetch Pending Leave Requests!");
      }
    }
  };

  const getLeaveDetails = async(leaveObjectId) =>
  {
    try
    {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/administrative/leaves/leave-details/${leaveObjectId}`, {
        headers:{
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // toast.success("Leave Details Fetched Successfully!");
      setLeaveDetails(response.data);
    }
    catch(error)
    {
      console.log("Error Fetching Leave Details:", error);
      toast.error("Failed To Fetch Leave Details");
    }
  }

  useEffect(() =>{
    getPendingLeaves();
  }, [])

  const handleViewDetails = (leaveObjectId) => {
    getLeaveDetails(leaveObjectId);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setTextareaVisible(false);
    setLeaveDetails(null);
  };

  const handleApproveOrReject = async (status, leaveOjectId) => {
    if(status === 'Rejected')
    {
      setTextareaVisible(true);
    }

    if (status === 'Rejected' && !reason) {
      toast.warn('Please provide a reason for rejection.');
      return;
    }
  
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/status/${leaveOjectId}`,
        {
          status: status,
          rejectionReason: status === 'Rejected' ? reason : undefined,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      toast.success(response.data.message);
      // console.log('Response:', response.data);
      setReason(null);
      setTextareaVisible(false)
      setShowModal(false);
      getPendingLeaves();
    } catch (error) {
      console.error(`Error While Updating leave Request:`, error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed To Update Leave Request!';
      toast.error(errorMessage);
    }
  };

  const leaveDocumentDownload = async(index) =>
  {
    try
    {
      console.log("index:", index);

      const url = `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/administrative/leaves/document/download/${leaveDetails.employeeId}/${leaveDetails.leaveOjectId}/${index}`;

    console.log("URL:", url);

      const response = await axios.get(url, {
        headers:{
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob'
      }
    );
    if(response.status === 200)
    {
      const blob = response.data;

      const contentType = response.headers['content-type'];
      const fileExtension = contentType.split('/')[1] || 'bin';

      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);

      const filename = `file-${index}.${fileExtension}`;

      link.href = url;
      link.setAttribute('download', filename);
      link.click();

      window.URL.revokeObjectURL(url);

      toast.success("File Downloaded Successfully!");
    }
    else
    {
      toast.error("Failed To Download File!");
    }
    }
    catch(error)
    {
      console.error("Error During File Download: ", error);
      toast.error("Error During File Download!");
    }
  }

  const [sortModalVisible, setSortModalVisible] = useState(false);

  const handleSort = () => {
    const sortedLeaves = [...pendingLeaves].sort((a, b) => a.fullName.localeCompare(b.fullName));
    setPendingLeaves(sortedLeaves);
    setSortModalVisible(false);
  };
  
  return (

    <div 
    id='main' 
    className='w-screen h-screen flex bg-[#D5EBE7]'>

      <div 
      id='sidebar'>
        <EmployerSidebar/>
      </div>

      <div id='content' 
      className='lg:p-10 flex flex-col gap-6 flex-grow'>
        
        <h1 
        className='font-lato font-bold lg:text-[30px] lg:text-left text-center pt-5 lg:pt-0'>
          Leave Management
        </h1>

        <div 
        id='functionalities' 
        className='flex flex-row justify-between items-center w-full px-4'>

          <div 
          id='searchBar' 
          className='flex w-[70%] lg:h-full h-[80%] bg-white items-center p-2 rounded-xl'>
            <IoSearchOutline className='text-lg mr-2' />
            <input type='search' 
            placeholder='Search Employee by Name, ID or Designation' 
            className='w-full outline-none lg:text-[100%] text-[60%]' 
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)} />
          </div>

          <div 
          id='sort-filter' 
          className='flex w-[20%] lg:bg-[#F9F9F9] lg:rounded-xl lg:gap-0 gap-1'>

            <button 
            id='filter' 
            onClick={filterToggle}
            className='w-[50%] lg:h-full h-[70%] m-auto rounded-md bg-[#F9F9F9]'>
              <IoFilterOutline className='text-xl mx-auto m-1' />
            </button>

            <div className='border-l h-10'></div>

            <button 
            id='sort' 
            onClick={() => setSortModalVisible(!sortModalVisible)}
            className='w-[50%] lg:h-full h-[70%] m-auto bg-[#F9F9F9] rounded-md'>
              <RiArrowUpDownLine className='text-xl mx-auto m-1' />
            </button>

          </div>

        </div>

        {sortModalVisible && (
        <div className="absolute z-50 bg-[#FFFFFF] lg:w-[15%] w-[30%] lg:right-5 lg:top-40 right-2 top-28">
          <p className='lg:h-10 h-7 flex items-center justify-center bg-[#F1F7FF] font-bold lg:text-lg text-[60%]'>Sort</p>
          <button 
          onClick={handleSort} 
          className="w-full p-2 text-black font-lato font-medium lg:text-sm text-[50%]">
            Alphabetically A-Z
          </button>
        </div>
      )}

        {isFilter && (

          <div 
          className='absolute z-50 bg-[#FFFFFF] lg:w-[20%] w-[40%] lg:right-56 lg:top-40 right-20 top-28'>

              <p 
              className='font-lato font-bold lg:text-lg text-[60%] flex items-center justify-center m-auto leading-[24px] w-full lg:h-10 h-7 text-center bg-[#F1F7FF]'>
                Filter by Department
              </p>

              <div 
              className='flex flex-col gap-1 shadow-lg h-[50%] p-1'>

                <div 
                className={`relative  lg:h-[40%]   
                ${isOpen ? "rounded-lg" : "rounded-none"} w-[90%] m-auto`}>

                  <div 
                  className={`flex lg:p-2 h-6 px-2 lg:h-10 
                  ${isOpen ? "rounded-t-lg" : "rounded-lg"} w-full 
                  ${isOpen ? "bg-custom-gradient" : "bg-[#FFFFFF]"} border-[#EDEDED] border`}>

                    <button
                    onClick={handleToggle}
                    className={`w-full  lg:text-sm text-[50%] text-left font-medium  
                    ${isOpen ? "text-white" : "text-[#6B6B6B]"}`}  >
                      IT - Team
                    </button>

                    <svg
                    onClick={handleToggle}
                    className={`cursor-pointer transition-transform 
                    ${isOpen ? "rotate-180" : "rotate-0"}`}
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" />
                    </svg>

                  </div>

                  {(isOpen &&
                    
                    <div className='gap-1 flex flex-col  rounded-b-lg justify-center p-2 bg-[#FFFFFF]  shadow-lg lg:text-sm text-[50%]'>
                    
                      {["Front-End", "Back-End", "UI/UX"].map((designation) => (

                        <div key={designation} className='w-full flex justify-between'>

                          <label>{designation}</label>
                          <input
                          type='radio'
                          className={`md:w-3 md:h-5 ${isChecked[designation] ? "accent-black" : "accent-gray-50"} cursor-pointer`}
                          onClick={() => handleChecked(designation)}
                          checked={isChecked[designation]}/>
                          
                        </div>

                      ))}

                    </div>
                  )}

                  </div>

                  <div className='flex flex-col gap-1 w-[90%] m-auto h-[90%]'>

                    {["HR", "Social Media", "Finance", "Research"].map((dept) => (

                      <div
                      key={dept}
                      className={`flex w-full lg:h-10 h-6 rounded-lg justify-between p-2 items-center cursor-pointer 
                      ${isChecked[dept] ? "bg-custom-gradient" : "bg-[#FFFFFF] "} border border-[#EDEDED]`}>

                        <p className='font-lato font-medium lg:text-sm text-[50%] leading-6'>{dept}</p>

                        <input
                        type='radio'
                        className={`md:w-5 md:h-6 ${isChecked[dept] ? "accent-black" : "accent-gray-50"} cursor-pointer`}
                        onClick={() => handleChecked(dept)}
                        checked={isChecked[dept]}/>

                      </div>

                    ))}

                  </div>

                </div>

              </div>
          )}

        <div 
        id='table' 
        className='lg:w-[100%] lg:h-[277px] lg:mx-auto mx-2 flex flex-col'>

          <table 
          className='border-collapse lg:border border-gray-200 lg:rounded-[15px] rounded-lg drop-shadow-lg overflow-hidden bg-white rounded-b-none border-0'>
            
            <thead 
            className='bg-[#F5F9F9]'>
              
              <tr 
              className='font-lato lg:text-sm text-[8px] lg:font-bold h-14'>
                
                <th>
                  <span 
                  className='flex items-center justify-center lg:gap-2 lg:flex-row flex-col'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3  lg:w-6 lg:h-6" viewBox="0 0 24 24">
                      <path fill="#090a32" d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2S7.5 4.019 7.5 6.5M20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1z" />
                    </svg>
                    Name
                  </span>
                </th>

                <th>
                  <span className='flex items-center justify-center lg:gap-2 lg:flex-row flex-col text-nowrap'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3  lg:w-6 lg:h-6" viewBox="0 0 24 24">
                    <path fill="#090a32" d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2M8.715 8c1.151 0 2 .849 2 2s-.849 2-2 2s-2-.849-2-2s.848-2 2-2m3.715 8H5v-.465c0-1.373 1.676-2.785 3.715-2.785s3.715 1.412 3.715 2.785zM19 15h-4v-2h4zm0-4h-5V9h5z" />
                  </svg>
                    Employee ID
                  </span>
                </th>

                <th>
                  <span className='flex items-center justify-center lg:gap-2 lg:flex-row flex-col'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3  lg:w-6 lg:h-6" viewBox="0 0 24 24">
                    <path fill="#090a32" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z" />
                  </svg>
                  Leave Type
                  </span>
                </th>

                <th>
                  <span className='flex items-center justify-center lg:gap-2 lg:flex-row flex-col text-nowrap'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2 h-2  lg:w-4 lg:h-4" viewBox="0 0 1024 1024">
                    <path fill="#090a32" d="m960 95.888l-256.224.001V32.113c0-17.68-14.32-32-32-32s-32 14.32-32 32v63.76h-256v-63.76c0-17.68-14.32-32-32-32s-32 14.32-32 32v63.76H64c-35.344 0-64 28.656-64 64v800c0 35.343 28.656 64 64 64h896c35.344 0 64-28.657 64-64v-800c0-35.329-28.656-63.985-64-63.985m0 863.985H64v-800h255.776v32.24c0 17.679 14.32 32 32 32s32-14.321 32-32v-32.224h256v32.24c0 17.68 14.32 32 32 32s32-14.32 32-32v-32.24H960zM736 511.888h64c17.664 0 32-14.336 32-32v-64c0-17.664-14.336-32-32-32h-64c-17.664 0-32 14.336-32 32v64c0 17.664 14.336 32 32 32m0 255.984h64c17.664 0 32-14.32 32-32v-64c0-17.664-14.336-32-32-32h-64c-17.664 0-32 14.336-32 32v64c0 17.696 14.336 32 32 32m-192-128h-64c-17.664 0-32 14.336-32 32v64c0 17.68 14.336 32 32 32h64c17.664 0 32-14.32 32-32v-64c0-17.648-14.336-32-32-32m0-255.984h-64c-17.664 0-32 14.336-32 32v64c0 17.664 14.336 32 32 32h64c17.664 0 32-14.336 32-32v-64c0-17.68-14.336-32-32-32m-256 0h-64c-17.664 0-32 14.336-32 32v64c0 17.664 14.336 32 32 32h64c17.664 0 32-14.336 32-32v-64c0-17.68-14.336-32-32-32m0 255.984h-64c-17.664 0-32 14.336-32 32v64c0 17.68 14.336 32 32 32h64c17.664 0 32-14.32 32-32v-64c0-17.648-14.336-32-32-32" />
                  </svg>
                    No. of Days
                  </span>
                </th>

                <th>
                  <span className='flex items-center justify-center lg:gap-2 lg:flex-row flex-col'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3  lg:w-6 lg:h-6" viewBox="0 0 24 24">
                    <path fill="#090a32" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z" />
                  </svg>
                    Designation
                  </span>
                </th>

                <th>
                  <span className='flex items-center justify-center lg:gap-2 lg:flex-row flex-col'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3  lg:w-6 lg:h-6" viewBox="0 0 24 24">
                    <path fill="#090a32" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z" />
                  </svg>
                    Confirmation
                  </span>
                </th>

                <th>
                  <span className='flex items-center justify-center lg:gap-2 lg:flex-row flex-col'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3  lg:w-6 lg:h-6" viewBox="0 0 24 24">
                    <path fill="#090a32" d="m21.6 23l-3.075-3.05q-.45.275-.962.413T16.5 20.5q-1.65 0-2.825-1.175T12.5 16.5t1.175-2.825T16.5 12.5t2.825 1.175T20.5 16.5q0 .575-.15 1.088t-.425.962L23 21.6zM5.5 20.5q-1.65 0-2.825-1.175T1.5 16.5t1.175-2.825T5.5 12.5t2.825 1.175T9.5 16.5t-1.175 2.825T5.5 20.5m0-2q.825 0 1.412-.587T7.5 16.5t-.587-1.412T5.5 14.5t-1.412.588T3.5 16.5t.588 1.413T5.5 18.5m11 0q.825 0 1.413-.587T18.5 16.5t-.587-1.412T16.5 14.5t-1.412.588T14.5 16.5t.588 1.413t1.412.587m-11-9q-1.65 0-2.825-1.175T1.5 5.5t1.175-2.825T5.5 1.5t2.825 1.175T9.5 5.5T8.325 8.325T5.5 9.5m11 0q-1.65 0-2.825-1.175T12.5 5.5t1.175-2.825T16.5 1.5t2.825 1.175T20.5 5.5t-1.175 2.825T16.5 9.5m-11-2q.825 0 1.413-.587T7.5 5.5t-.587-1.412T5.5 3.5t-1.412.588T3.5 5.5t.588 1.413T5.5 7.5m11 0q.825 0 1.413-.587T18.5 5.5t-.587-1.412T16.5 3.5t-1.412.588T14.5 5.5t.588 1.413T16.5 7.5m0-2" />
                  </svg>
                    Action
                  </span>
                </th>

              </tr>

            </thead>

            <tbody className='flex-shrink'>

              {rec.length > 0 ?  (
                rec.map((pendingLeave, index) => (
                
                <tr 
                className='lg:border-b font-lato lg:text-base lg:font-bold lg:text-[#9C9C9C] text-center h-14 text-[8px] border-y-4 lg:border-y-0 lg:border-gray-300 border-[#D5EAE7]'
                key={index}>

                  <td 
                  className=''>
                    <span className='flex items-center flex-col lg:flex-row'>
                      <img 
                      src={pendingLeave.profilePhoto} 
                      alt='' 
                      className='lg:w-[40px] lg:h-[40px] w-[20px] h-[20px] rounded-full border border-black lg:m-2' />
                      {pendingLeave.fullName}
                    </span>
                  </td>

                  <td>{pendingLeave.employeeId}</td>

                  <td>{pendingLeave.leaveType}</td>

                  <td>{pendingLeave.noOfDays}</td>

                  <td>{pendingLeave.designation}</td>

                  <td>
                    <span className='flex justify-center gap-2'>
                      <button 
                      onClick={() => handleViewDetails(pendingLeave.leaveObjectId)}
                      className='lg:w-[32px] w-[16px] h-[16px] lg:h-[32px] rounded-[5px] bg-[#009A57]'>
                        <IoCheckmarkSharp className='lg:text-xl text-[10px] text-white m-auto' />
                      </button>
                      <button
                      onClick={() => handleViewDetails(pendingLeave.leaveObjectId)} 
                      className='lg:w-[32px] w-[16px] h-[16px] lg:h-[32px] rounded-[5px] bg-[#D9432F]'>
                        <IoClose className='lg:text-xl text-white m-auto' />
                      </button>
                    </span>
                  </td>

                  <td>
                    {/* <button
                      onClick={() => handleViewDetails(pendingLeave.leaveObjectId)}
                      className='border lg:px-5 px-2  lg:py-1 lg:text-sm text-[9px]'
                      style={{
                        borderRadius: '0.375rem',
                        borderImageSource: 'linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)',
                        borderImageSlice: 1,
                      }}>
                      View
                    </button> */}

                        <div
                          className="p-[1px] lg:rounded-lg rounded-md"
                          style={{
                            background: "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)",
                          }}
                        >
                          <button 
                          onClick={() => handleViewDetails(pendingLeave.leaveObjectId)}
                          className="w-full lg:py-1 lg:px-0 px-1 text-gray-600 lg:text-sm text-[8px] font-medium bg-white lg:rounded-lg rounded-md hover:text-gray-800 transition-all duration-300">
                            View
                          </button>
                        </div>

                  </td>

                </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="font-lato font-bold text-xs text-[#C1C1C1] text-center py-4">
                              No Pending Leaves!
                            </td>
                          </tr>
                        )}

            </tbody>

          </table>

          <nav className='flex justify-center text-[50%] lg:text-[100%] my-4'>
                    <button onClick={prevPage} disabled={currPage === 1} className='px-4 py-1 mx-1 disabled:opacity-50'><FaAngleLeft/></button>
                    {num.map((n) => (
                      <button
                        key={n}
                        onClick={() => setCurrPage(n)}
                        className={`lg:px-4 px-2 lg:py-2 py-1 mx-1 rounded-full ${currPage === n ? 'bg-[#E8EDF2]' : ''}`}
                      >
                        {n}
                      </button>
                    ))}
                    <button onClick={nextPage} disabled={currPage === npages} className='px-4 py-2 mx-1  disabled:opacity-50'><FaAngleRight/></button>
                  </nav>
        </div>

      </div>

      {showModal && leaveDetails &&(

        <div
        id='modal-overlay'
        onClick={closeModal}
        className='w-screen h-screen fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50'>
      
          <div
          id='infoCard'
          className='lg:w-[35%] w-[90%]  md:w-[55%] bg-white rounded-[10px] lg:rounded-[20px] lg:px-10 lg:py-8 p-4 flex flex-col lg:gap-5'
          onClick={(e) => e.stopPropagation()}>

            <div 
            id='user' 
            className='w-full h-[15%] flex items-center gap-5'>

              <img 
              src={leaveDetails.profilePhoto}
              alt='' 
              className='lg:w-[60px] lg:h-[60px] w-[40px] h-[40px] border border-black rounded-full' />
              
              <span>

                <h1 
                id='userName' 
                className='font-lato lg:text-2xl text-md font-bold text-black'>
                  {leaveDetails.name}
                </h1>

                <div 
                id='designation' 
                className='font-lato lg:text-base text-xs font-medium text-[#444444]'>
                  {leaveDetails.designation}
                </div>

              </span>

            </div>

            <div 
            id='leaveInfo' 
            className='w-full lg:h-[25%] h-[20%] flex flex-row justify-between'>

                <div 
                className='justify-between font-lato lg:text-sm text-xs font-bold'>

                  <span><p className='text-[#898989]'>Leave Type</p>{leaveDetails.leaveType}</span>
                  <span><p className='text-[#898989]'>Start Date</p>{leaveDetails.startDate}</span>

                </div>

                <div 
                className='justify-between font-lato lg:text-sm text-xs font-bold'>

                  <span><p className='text-[#898989]'>Duration</p>{leaveDetails.days}</span>
                  <span><p className='text-[#898989]'>End Date</p>{leaveDetails.endDate}</span>

                </div>
            
            </div>

            <div 
            id="description"
            className='w-full lg:h-[20%] h-[20%] font-lato lg:text-sm text-xs font-bold'>

              <p 
              className='text-[#898989] mb-1'>Leave Description</p>

              <p 
              className='text-wrap text-justify overflow-y-auto w-full h-[80%]'
              style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                {leaveDetails.leaveDescription}
              </p>

            </div>

            <div 
            id="attachments"
            className='w-full lg:h-[20%] h-[20%]'>

              <h1 
              className='font-lato lg:text-sm text-xs text-[#898989] font-bold mb-2'>Attachments</h1>

                <div 
                className='w-full h-[80%] overflow-y-auto flex flex-col gap-2'
                style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>

                  {leaveDetails.files && leaveDetails.files.length > 0 ? (
                    leaveDetails.files.map((file, index) => (

                    <span 
                    key={index}
                    className='flex gap-1 bg-[#F0F0F0] px-2 w-full h-[50%] items-center rounded-[8px] mx-auto justify-between'>
                      <p className='font-lato font-medium lg:text-xs text-[10px] text-nowrap overflow-hidden text-ellipsis w-[95%]'>{file.split("/").pop()}</p>
                      <button 
                      onClick={() => leaveDocumentDownload(index)}
                      className='ml-auto w-[5%]'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3  lg:w-6 lg:h-6" viewBox="0 0 24 24">
                          <path fill="#0195FF" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-8 4v-5h2v3h12v-3h2v5z" />
                        </svg>
                      </button>
                    </span>
                      ))
                    ) : (
                      <span className='font-lato font-bold lg:text-xs text-[9px] text-[#C1C1C1] text-center py-4'>No attachments</span>
                    )}

                </div>

            </div>

          <div 
          className='w-full flex flex-col gap-3'>

            {textareaVisible && (

            <div 
            className='w-full h-[40%%]' >

              <h1
              className='font-lato font-bold lg:text-sm text-xs text-[#898989]'>
                Reason For Rejection:
              </h1>

              <textarea
              placeholder="Type Reason Here."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-[50px] lg:text-sm text-xs font-lato font-bold border-l-8 border-[#FF0000] outline-none pl-1 bg-gradient-to-r from-[#FFE7E4] to-[#FFFFFF] overflow-y-auto resize-none"
              style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
            ></textarea>

            </div>
            )}

            <div 
            className='w-full lg:h-[60%] flex justify-center items-center gap-4 lg:mt-0 mt-4'>

              <button 
              onClick={() => handleApproveOrReject('Rejected', leaveDetails.leaveOjectId)}
              className='bg-[#D9432F] lg:w-[40%] w-[30%] h-[25px] lg:h-[40px] rounded-[5px] text-white font-lato lg:text-sm text-xs font-bold flex items-center justify-center gap-2'>
                <svg 
                xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 lg:w-6 lg:h-6" viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
                </svg>
                <p>Reject</p>
              </button>

              <button 
              onClick={() => handleApproveOrReject('Approved', leaveDetails.leaveOjectId)}
              className='bg-[#009A57] lg:w-[40%] w-[30%] h-[25px] lg:h-[40px] rounded-[5px] text-white font-lato lg:text-sm text-xs font-bold flex items-center justify-center gap-2'>
                <svg 
                xmlns="http://www.w3.org/2000/svg" className="w-4 h-4  lg:w-6 lg:h-6" viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z" />
                </svg>
                <p>Accept</p>
              </button>

            </div>

          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default LeaveMgmt;

