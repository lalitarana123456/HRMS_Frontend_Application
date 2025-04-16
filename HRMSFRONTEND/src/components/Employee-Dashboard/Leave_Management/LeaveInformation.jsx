import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from 'axios';

const LeaveInformation = ({dataId}) => {

  // const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(true);
  const [leaveDetails, setLeaveDetails] = useState(null);

  const closePopup = () => 
    {
      setIsVisible(false);
      // navigate("/leave")
    };
  
    const handleClick = (e) => 
    {
      if (e.target.id === 'main') 
      {
        closePopup();
      }
    };

    const getLeaveInformation = async () => {
      try {
        const token = localStorage.getItem('token');
        // console.log("Token:", token);
    
        if (!token) {
          console.error("Authentication token is missing.");
        }
    
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/leaveDetails/${dataId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        setLeaveDetails(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(() => {
      if(dataId){
        getLeaveInformation();
      }
    }, [dataId]);
    
  if (!isVisible || !leaveDetails) return null;

  return (
    <div
    id='main'
    onClick={handleClick}
    className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50'>

    
      <div 
      id="infoCard"
      className='lg:w-[30%] lg:h-[70%] bg-white rounded-[20px] lg:px-10 lg:py-8 flex flex-col gap-5 relative w-[90%] h-[50%] md:w-[50%] md:h-[40%] px-5 py-4'
      onClick={(e) => e.stopPropagation()} 
      >
        
        <AiOutlineInfoCircle className='text-xl absolute lg:top-3 lg:left-3 top-1 left-1'/>

        <div 
        id="user"
        className='w-full h-[20%] flex items-center gap-5'>

          <img 
          src="/Ellipse.png" 
          alt=""
          className='w-[60px] h-[60px] border border-black rounded-full' />

          <span>

            <h1 
            id='userName'
            className='font-lato lg:text-2xl text-xl font-semibold lg:font-bold text-black'>{leaveDetails.name}</h1>

            <div 
            id="designation"
            className='font-lato lg:text-base text-sm lg:font-medium text-[#444444]'>{leaveDetails.designation}</div>

          </span>

        </div>

        <div 
        id="leaveInfo"
        className='lg:w-full h-[20%] flex flex-row justify-between'>

        <div className='justify-between font-lato lg:text-sm text-xs font-bold'>
          <span><p className='text-[#898989]'>Leave Type</p>{leaveDetails.leaveType}</span>
          <span><p className='text-[#898989]'>Start Date</p>{leaveDetails.startDate}</span>
        </div>

        <div className='justify-between font-lato lg:text-sm text-xs font-bold'>
          <span><p className='text-[#898989]'>Duration</p>{leaveDetails.days}</span>
          <span><p className='text-[#898989]'>End Date</p>{leaveDetails.endDate}</span>
        </div>

        </div>

        <div 
        id="description"
        className='lg:w-full h-[20%] font-lato lg:text-sm text-xs font-bold'>
          <p className='text-[#898989] lg:mb-1'>Leave Description</p>
          <p className='text-wrap text-justify overflow-y-auto w-full h-[80%]'
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {leaveDetails.leaveDescription}
          </p>
        </div>

        <div 
        id="reason"
        className=' class="lg:w-full h-[20%] lg:text-sm text-xs font-lato font-bold border-l-8 border-[#FF0000] outline-none pl-1 bg-gradient-to-r from-[#FFE7E4] to-[#FFFFFF] overflow-y-auto resize-none'
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <p>{leaveDetails.rejectionReason}</p>
        </div>

      </div>

    </div>
  )
}

export default LeaveInformation