import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval, isSameDay, startOfWeek } from 'date-fns';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Calender = ({ onDateSelection }) => 
{
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectionDate, setSelectionDate] = useState(null);
  const [time, setTime] = useState(new Date());
  const [isCalenderVisible, setIsCalenderVisible] = useState(false);
  const calenderRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [isAddEventMode, setIsAddEventMode] = useState(false);

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const startOfCurrentMonthWeek = startOfWeek(startOfCurrentMonth, { weekStartsOn: 0 });

  const daysOfMonth = eachDayOfInterval
  ({
    start: startOfCurrentMonthWeek,
    end: endOfCurrentMonth,
  });


  const formatTime = (date) => 
  {
    return format(date, 'hh:mm:ss a');
  };


  useEffect(() => 
  {
    const interval = setInterval(() => 
    {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => 
    {
      if (calenderRef.current && !calenderRef.current.contains(e.target)) 
      {
        setIsCalenderVisible(false);
      }
    };
    if (isCalenderVisible) 
    {
      document.addEventListener('mousedown', handleClickOutside);
    } 
    else 
    {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalenderVisible]);

  const handleMonthChange = (direction) => 
  {
    if (direction === 'next') 
    {
      setCurrentDate(addMonths(currentDate, 1));
    } 
    else if (direction === 'prev') 
    {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleDateClick = (date) => 
  {
    setSelectionDate(date);
    setIsModalOpen(true);
  };

  const handleViewCalenderClick = () => 
  {
    setIsCalenderVisible(true);
  };

  const handleModalClose = () => 
  {
    setIsModalOpen(false);
    setIsAddEventMode(false);
    setEventTitle('');
    setEventDescription('');
  };

  const handleShowAttendance = () => {
    if (selectionDate) 
    {
      onDateSelection(selectionDate);
      setIsModalOpen(false);
    } else 
    {
      toast.error("Please select a date.");
    }
  };

  const handleAddEventClick = () => 
  {
    setIsAddEventMode(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDescription.trim()) {
      toast.error("Enter Title And Description!");
      return;
    }
    const eventData = {
      title: eventTitle,
      description: eventDescription,
      date: format(selectionDate, 'yyyy-MM-dd'),
    };
    try 
    {
      const response = await axios.post("http://localhost:5000/api/v1/upcomingevent/events", eventData);
      if (response.data.success) {
        toast.success("Event Created Successfully!");
        handleModalClose();
      } else {
        toast.error(response.data.message || "Failed To Create Event!");
      }
    } catch (error) { 
      console.error("Error Occured While Creating Event:", error);
  
      if (error.response) {
        console.error("Error Response:", error.response.data);
        toast.error("Error Creating Event: " + (error.response.data?.message || error.message));
      } else {
        console.error("Unknown Error:", error.message);
        toast.error("An Unknown Error Occurred!");
      }
    }
  };
        

  return (
    <div>
      
      {!isCalenderVisible && (
        
        <div
        className="w-[100%] h-[90%] bg-[#FFFCFC] lg:rounded-[16px] rounded-[10px] lg:drop-shadow-lg p-2">
          
          <div 
          className="w-full bg-blue-300 rounded-md p-1 mb-[2px] lg:mb-3 border-[#A6A6A6] border-[1px]">
            
            <div 
            className="flex justify-between items-center w-full px-1 lg:text-lg text-[9px] font-semibold">
              
              <span>
                {format(time, 'MMM yyyy')}
              </span>

              <span className='text-[#676767]'>
                {format(time, 'EEEE')}
              </span>

            </div>

            <div 
            className="flex justify-center w-full lg:text-6xl p-7 lg:p-7 md:p-11 md:text-6xl text-3xl text-[#0072FF]">

              {format(time, 'd')}

            </div>
            <div className='w-[95%] mx-auto border-[1px] lg:rounded-[9px] rounded-md p-0.5 font-semibold lg:py-1 text-center border-[#AAAAAA] bg-white text-xs lg:text-sm'>{formatTime(time)}</div>
          </div>

          <button
          className="w-full lg:p-2 bg-[#60A5FA] text-white rounded-md p-1 h-full text-[9px] lg:text-sm"
          onClick={handleViewCalenderClick}>
            View Calender
          </button>

        </div>
      )}

      {isCalenderVisible && (

        <div 
        ref={calenderRef} 
        className="lg:w-full lg:h-full bg-[#FFFCFC] rounded-lg lg:rounded-[16px] lg:drop-shadow-lg p-1 flex flex-col">

          <div className="text-center lg:w-full">

            <div 
            className="flex justify-between items-center px-3 lg:my-2 my-3">
              
              <button 
              className="lg:text-lg text-xs font-semibold text-gray-700 hover:text-gray-900" 
              onClick={() => handleMonthChange('prev')}>
                <FaAngleLeft/>
              </button>
              
              <span className="lg:text-lg text-xs font-bold text-gray-800">
                {format(currentDate, 'MMM yyyy')}
              </span>

              <button 
              className="lg:text-lg text-xs font-semibold text-gray-700 hover:text-gray-900" 
              onClick={() => handleMonthChange('next')}>
                <FaAngleRight/>
              </button>

            </div>

          </div>

          <div 
          className="grid grid-cols-7 lg:gap-0.5 gap-1 lg:px-4 px-1 lg:text-xs text-[10px] lg:w-full lg:mb-7 mb-3 md:gap-1 md:mb-2">
            <div className="text-center font-semibold">Sun</div>
            <div className="text-center font-semibold">Mon</div>
            <div className="text-center font-semibold">Tue</div>
            <div className="text-center font-semibold">Wed</div>
            <div className="text-center font-semibold">Thu</div>
            <div className="text-center font-semibold">Fri</div>
            <div className="text-center font-semibold">Sat</div>

            {daysOfMonth.map((day, index) => (
              
              <div
              key={index}
              className={`cursor-pointer md:w-[28px] md:h-[28px] lg:pl-1 lg:pt-1 pl-0.5 pt-0.5 lg:rounded-md rounded-sm border border-[#A6A6A6] font-lato text-[9px]  lg:text-xs text-black
                ${day < startOfCurrentMonth || day > endOfCurrentMonth ? 'border-none bg-inherit' : ''} 
                ${isSameDay(day, selectionDate) ? 'bg-blue-500 font-bold' : 'hover:bg-blue-100'}
                ${isSameDay(day, new Date()) ? 'bg-[#D6E8FF] text-[#0072FF] font-extrabold' : ''} `}
              onClick={() => day >= startOfCurrentMonth && day <= endOfCurrentMonth && handleDateClick(day)}>
              {day >= startOfCurrentMonth && day <= endOfCurrentMonth ? format(day, 'd') : ''}
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div 
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">

          <div 
          className="bg-white p-6 rounded-md w-[300px] lg:w-[400px]">

            <h2 
            className="text-lg font-semibold mb-4">Choose An Option</h2>

            <div 
            className="flex justify-between">

              <button
              className="text-blue-500"
              onClick={handleAddEventClick}>Add Event</button>

              <button
              className="text-blue-500"
              onClick={handleShowAttendance}>Show Attendance</button>

              <button 
              type="button" 
              className="text-gray-700" 
              onClick={handleModalClose}>Cancel</button>

            </div>

          </div>

        </div>
      )}

      {isAddEventMode && (

        <div 
        className="fixed inset-0 flex justify-center items-center z-50">

          <div 
          className="bg-white p-6 rounded-md w-[300px] lg:w-[400px]">

            <h2 
            className="text-lg font-semibold mb-4">
              Add Event
            </h2>

            <form 
            onSubmit={handleCreateEvent}>

              <div 
              className="mb-4">

                <label 
                className="block text-sm font-medium text-gray-700">Title</label>
                <input
                id="title"
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required/>

              </div>

              <div className="mb-4">

                <label 
                className="block text-sm font-medium text-gray-700">Description</label>

                <textarea
                id="description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-none"
                required
                ></textarea>

              </div>

              <div className="flex justify-between">
                <button type="button" className="text-gray-700" onClick={handleModalClose}>Cancel</button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Save</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calender;
