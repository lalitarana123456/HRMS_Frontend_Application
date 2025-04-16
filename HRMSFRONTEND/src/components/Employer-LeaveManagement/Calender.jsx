import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday, isSameMonth, isSameDay } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import EmployerSidebar from '../Employer-Sidebar/EmployerSidebar';

const Calender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fixedHolidays, setFixedHolidays] = useState([]);
  const [createdLeave, setCreatedLeave] = useState([])

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const daysInCurrentMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));


  const handleDateClick = (date) => 
  {
    const isDateSelected = selectedDates.some((selectedDate) => isSameDay(selectedDate, date));
    if (isDateSelected) 
    {
      setSelectedDates([]);
    } 
    else
    {
      setSelectedDates([date]);
    }
  };

  const handleCreateUpcomingLeave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Log-In To Create Leave Request");
        return;
      }

      if(!title || !selectedDates.length || !description)
      {
        toast.error("Title, Date And Description Are Required!");
        return;
      }
  
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/upcoming/create`,
      {
        title: title,
        date:  format(selectedDates[0], 'yyyy-MM-dd'),
        description: description
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getCreatedLeaves();
      
      if (response.status === 201) {
        toast.success("Leave Created Successfully!");
        setSelectedDates([]);
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error("Error Creating Leave", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Failed To Create Leave Request. Please Try Again!");
      } else {
        toast.error("Failed To Create Leave Request. Please Try Again!");
      }
    }
  };

  const getYearlyLeaves = async() => 
  {
    try
    {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/upcoming/getFixedPublicLeaves`);
      if(response.data.success)
      {
        setFixedHolidays(response.data.holidays);
      }
      else
      {
        toast.error("Failed To Fetch Yearly Leaves!");
      }
    }
    catch(error)
    {
      console.error("Error Fetching Yearly Leaves", error);
      toast.error("Error Fetching Holidays, Please Try Again Later!");
    }
  };

  const getCreatedLeaves = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/upcoming/upcoming-leaves`);
      console.log("Response Data:", response.data);
      if (Array.isArray(response.data.upcomingLeaves)) {
        const formattedLeaves = response.data.upcomingLeaves.map(leave => ({
          ...leave,
          date: new Date(leave.date),
        }));
        setCreatedLeave(formattedLeaves);
      } else {
        toast.error("Failed To Fetch Upcoming Leaves!");
      }
    } catch (error) {
      console.error("Error Fetching Upcoming Leaves", error);
      toast.error("Error Fetching Upcoming Leaves, Please Try Again Later!");
    }
  };
  
  useEffect(() => {
    getYearlyLeaves();
    getCreatedLeaves();
  }, [])
  
  
  // const handleUpdateLeave = (e) => 
  // {
  //   e.preventDefault();
  //   const updatedLeaveDetails = { ...leaveDetails };
  //   selectedDates.forEach(date => 
  //   {
  //     updatedLeaveDetails[format(date, 'yyyy-MM-dd')] = 
  //     {
  //       title: title,
  //       description: description,
  //       yearlyLeave: false,
  //     };
  //   });
  //   setLeaveDetails(updatedLeaveDetails);
  //   setSelectedDates([]);
  //   setTitle('');
  //   setDescription('');
  // };

  const handleBack = () => 
  {
    setSelectedDates([]);
    setTitle('');
    setDescription('');
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
      className='flex-grow lg:p-10 p-5 flex flex-col gap-6'>

        <h1
        className='font-lato font-bold lg:text-[30px] text-center lg:text-left'>Update Leave</h1>

        <div 
        id="calenderView"
        className='lg:w-[100%] h-[100%] bg-white drop-shadow-lg border lg:rounded-md flex flex-col justify-between rounded-[20px]'>

          <div 
          id="heading"
          className='lg:w-full lg:h-[10%] flex items-center justify-between px-4 lg:mb-0 my-2'>

            <h1 
            className='lg:text-lg text-xs font-bold'>
              Calender View
            </h1>

            <div className="flex items-center justify-between">
              <button onClick={goToPrevMonth} className="lg:text-2xl"><MdOutlineKeyboardArrowLeft/></button>
              <h2 className="lg:text-lg font-bold lg:px-4 px-2 text-xs">
                {format(currentDate, "MMM yyyy")}
              </h2>
              <button onClick={goToNextMonth} className="lg:text-2xl"><MdOutlineKeyboardArrowRight/></button>
            </div>

          </div>

          <div 
          id="calender-info"
          className='flex lg:flex-row flex-col lg:w-full lg:h-[85%] h-full px-5 gap-2'>

            <div 
            id="calender"
            className='lg:w-[70%] lg:h-[82%] h-1/2'>

              <div 
              className='grid grid-cols-7 text-center gap-1 h-full'>

                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div 
                    key={day} 
                    className='font-lato lg:text-[70%] lg:font-medium text-[#8B8B8B] text-center m-auto'>{day}
                    </div>
                  ))}

                {daysInCurrentMonth[0].getDay() > 0 && Array.from({ length: daysInCurrentMonth[0].getDay() }).map((_, index) => (
                  <div key={`empty-${index}`}></div>
                ))}

                {daysInCurrentMonth.map((date) => (
                  <div
                  key={date}
                  onClick={() => handleDateClick(date)}
                  className={`cursor-pointer lg:rounded rounded-[10px] border border-[#A6A6A6] lg:text-left text-[90%] relative lg:pl-0.5 lg:pt-0.5
                    ${isToday(date) ? 'bg-blue-500' : ''}
                    ${isSameMonth(date, currentDate) ? 'text-black' : 'text-gray-400'}
                    hover:bg-cyan-200
                    ${selectedDates.some((selectedDate) => isSameDay(selectedDate, date)) ? 'bg-blue-300' : ''}
                    lg:min-h-[50px] min-h-[40px]
                    ${fixedHolidays.some(holiday => holiday.date === format(date, 'yyyy-MM-dd')) ? 'bg-[#DFEEFF]' : ''}
                    ${createdLeave.some(leave => format(new Date(leave.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) ? 'bg-[#D4FFE6]' : ''}`}>
                  
                  <span className={isSameDay(date, new Date()) ? 'font-bold' : ''}>
                    {format(date, 'd')}
                  </span>

                  {fixedHolidays.some(holiday => holiday.date === format(date, 'yyyy-MM-dd')) && (
                  <div className="text-center text-[50%] w-[90%] mx-auto rounded-md p-1 text-[#0070FF] bg-[#C0DBFF]">
                  {
                    fixedHolidays.find(holiday => holiday.date === format(date, 'yyyy-MM-dd'))?.title || "Holiday"}
                    </div>
                  )}

                  {createdLeave.filter(leave => format(leave.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')).map(leave => (
                    <div key={leave._id || leave.title} className="text-center w-[90%] text-[50%] mx-auto rounded-md p-1 text-[#00903D] bg-[#91FFC0]">
                      {leave.title || "Leave"}
                    </div>
                  ))}
                </div>
              ))}

              </div>

            </div>

              <form 
              id="info"
              className='lg:w-[30%] lg:h-[95%] h-1/2 lg:mt-auto'>

                <div className='lg:w-full h-[80%]  bg-[#F1F7FF] p-3 rounded-[10px]'>

                <span 
                id="date-day"
                className='flex flex-col font-lato lg:font-medium'>
                {selectedDates.length > 0 ? (
                    <span className='flex justify-between'>
                      <span className='lg:text-[95%]'>{format(selectedDates[0], 'd')}</span>
                      <span className='text-[#8B8B8B] lg:text-[85%]'>{format(selectedDates[0], 'EEEE')}</span>
                    </span>
                  
                ) : (
                  <span className='text-[#8B8B8B] text-[80%]'>Select Date</span>
                )}
              </span>


                  <span className='flex flex-col gap-1 text-[80%] my-2'>
                    <h1 className='text-[#575757]'>Leave Title</h1>
                    <input 
                    className='w-full p-1 px-2 rounded-md outline-none border border-[#DADADA]'
                    type="text" 
                    placeholder='Enter Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}/>
                  </span>

                  <span className='flex flex-col gap-1 text-sm my-2'>
                    <h1 className='text-[#575757] text-[90%]'>Description</h1>
                    <textarea 
                    className='w-full p-1 px-2 rounded-md outline-none border border-[#DADADA] resize-none lg:h-32 h-20 overflow-y-auto text-[90%]'
                    type="text" 
                    placeholder='Type Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}/>
                  </span>

                  </div>

                  <div className='flex justify-between w-full lg:h-[20%] h-[13%] items-center'>

                    <button 
                    onClick={handleBack}
                    className='w-[30%] lg:h-[45%] h-[70%] rounded-md bg-[#f2f2f2] border border-[#BDBDBD] font-lato text-[80%] lg:font-semibold'>Back</button>
                    <button 
                    onClick={handleCreateUpcomingLeave}
                    className='lg:w-[60%] lg:h-[45%] w-[40%] h-[70%] rounded-md bg-black text-white border border-[#BDBDBD] font-lato text-[80%] lg:font-semibold'>Update Leave</button>

                  </div>

              </form>

            </div>

        </div>

      </div>
    
    </div>

  )
}

export default Calender