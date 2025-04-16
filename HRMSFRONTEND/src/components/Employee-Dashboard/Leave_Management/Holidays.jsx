import React, { useState, useEffect }from 'react'
import axios from 'axios'

const Holidays = () => {

  const [holiday, setHoliday] = useState([])

  const getHolidayData = async () => 
  {
    const token = localStorage.getItem('token');
    if (token)
    {
      try 
      {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/upcoming/`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response.data);
        if(response.data.success)
        {
          const holidayData = response.data.upcomingLeaves || [];
          setHoliday(holidayData);
          console.log(holidayData);
        }
        else
        {
          console.error("Failed To Fetch Holiday Data:", response.data.message);
        }
      } 
      catch (error) 
      {
        console.error("Error Fetching API:", error.response || error);
      }
    } 
    else 
    {
      console.log("Token Not Found In Local Storage");
    }
  };

  useEffect(() => 
  {
    getHolidayData();
  }, [])

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const twoLeaves = isExpanded ? holiday.length : 2;


  return (
    
    <div>
      
      <div 
      id="upcomingLeaves"
      className='w-[100%] h-[217px] bg-white rounded-[20px] drop-shadow-lg hidden lg:flex lg:flex-col'>

        <div 
        id="heading"
        className='w-full h-[50px] rounded-tr-[20px] rounded-tl-[20px] text-xl font-bold font-lato bg-[#F5FAF9] bg-opacity-88 p-5 shadow-lg'>
          Upcoming Leave and Holidays
        </div>

      <div 
      id="infoBlock"
      className='w-[100%] h-[217px] bg-white drop-shadow-lg rounded-bl-[20px] rounded-br-[20px] overflow-y-scroll'
      style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>

        <div 
        id="info"
        className='w-[296px] h-[108px] m-5'>

            {holiday.length > 0 ? holiday.map((leave, index) => {

              const hasObjectId = leave._id !== undefined;
              const leaveColor = hasObjectId ? "bg-[#D4FFE6] text-[#00903D]" : "bg-[#DFEEFF] text-[#0070FF]";
           
              return(
            <div 
            id={`holiday-${index}`}
            className={`w-full h-1/2 flex-row flex items-center gap-2 m-2`} key={index}>

              <div 
              id="date"
              className={`w-[45px] h-[45px] flex rounded-full justify-center items-center  font-bold font-lato text-md ${leaveColor}`}>
                {new Date(leave.date).getDate()}
              </div>

              <div 
              id="day"
              className='flex-grow flex-col flex'>
                <p className='font-lato font-bold text-md'>{leave.title}</p>
                <p className='font-lato font-medium text-sm'>  
                    {new Date(leave.date).toLocaleDateString('en-US', {
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })}
                </p>
              </div>

            </div>
          )
}) : (
              <p className='font-lato font-bold text-sm text-[#C1C1C1]'>No upcoming holidays or leaves found.</p>
            )}

        </div>

        </div>

      </div>
          
      <div 
      className='lg:hidden w-screen md:w-full bg-[#D5EAE7] '>
          <br />
        <div 
        id="upcomingLeaves"
        className={`w-[94%] md:w-full mx-auto rounded-[11px] bg-[#FFFFFF] p-2 relative drop-shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'h-auto' : 'h-[194px]'
        }`}>
              
          <h1 className='font-lato font-semibold text-xl'>Upcoming Leaves</h1>
              
          <div>
          
            {holiday.length > 0 ? holiday.slice(0, twoLeaves).map((leave, index) => {

              const hasObjectId = leave._id !== undefined;
              const leaveColor = hasObjectId ? "bg-[#D4FFE6] text-[#00903D]" : "bg-[#DFEEFF] text-[#0070FF]";
              
            return(
            <div 
            className='flex items-center justify-between w-full h-[43px] rounded-[5px] mt-4' 
            key={index}>

              <div className='flex justify-center items-center gap-3'>
                
                <span className={`w-[45px] h-[45px] rounded-full font-lato text-lg font-bold flex justify-center items-center 
                  ${leaveColor}`}>
                  {new Date(leave.date).getDate()}
                 </span>
                
                <span className='text-base font-lato font-bold'>{leave.title}</span>
              </div>

              <span className='font-lato text-xs font-medium'>
                {new Date(leave.date).toLocaleDateString('en-US', {
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                    })}
              </span>
            </div>
            )
            }) : (
              <p className='font-lato font-bold text-base text-[#C1C1C1] py-2'>No Upcoming Holidays Or Leaves Found.</p>
            )}

            </div>
          
              <br />
              <button 
              onClick={toggleExpand}
              className='text-[#176CED] font-medium text-xs absolute bottom-3 right-4'>
             {isExpanded ? "View Less" : "View All"}
              </button>

        </div>

      </div>

    </div>
  )
}

export default Holidays