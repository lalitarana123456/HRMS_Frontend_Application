import React, {useState} from 'react'
import EmployerSidebar from '../Employer-Sidebar/EmployerSidebar'
import TotalEmployees from './TotalEmployees'
import PendingCheckouts from './PendingCheckouts'
import AvgWorkingHour from './AvgWorkingHour'
import AttendanceGraph from './AttendanceGraph'
import Calender from './Calender'
import UpcomingEvents from './UpcomingEvents'
import AttendanceTable from './AttendanceTable'

const EmployerAttendance = () => {
  const [selectionDate, setSelectionDate] = useState(null);
  const handleDateSelection = (date) => {
    setSelectionDate(date);
  };


  return (
    
    <div 
    id='main' 
    className='lg:w-screen h-screen flex bg-[#D5EBE7] lg:overflow-x-hidden'>
      
      <EmployerSidebar/>
      <div className='w-full overflow-y-auto lg:p-10 p-5'>

        <div>
          <h1 className='lg:text-3xl lg:mb-3 font-bold text-center lg:text-left my-2'>Attendance</h1>
          <h5 className='lg:text-sm text-[#4F7A94] font-normal hidden md:block'>Stay updated on your team's attendance!</h5>
        </div>
        
        <div className='lg:w-[100%] lg:h-[100%] mt-10 flex justify-between'>

          <div 
          className='lg:w-[72%] w-[100%] lg:h-[100%] h-full flex lg:justify-between flex-col lg:gap-0'>

            <div className='w-[100%] lg:h-[25%] flex justify-between lg:mb-0 mb-6'>
              <TotalEmployees/>
              <PendingCheckouts/>
              <AvgWorkingHour/>
            </div>

            <div className='w-[100%] h-[70%] flex lg:gap-0 gap-7 flex-col'>
              <div className='flex lg:h-[50%] h-[50%] gap-2 lg:hidden'>
                <div className='w-[50%] h-[100%] lg:hidden'><Calender onDateSelection={handleDateSelection}/></div>
                <div className='w-[50%] h-[100%] lg:hidden'><UpcomingEvents/></div>
              </div>
              <div className='w-full lg:h-full h-[50%]'><AttendanceGraph/></div>
            </div>

          </div>

          <div className='lg:w-[27%] lg:h-[100%] lg:flex justify-between flex-col hidden md:block'>
            <div className='w-full h-full lg:flex justify-between flex-col md:hidden'>
              <div className='h-[49%]'><Calender onDateSelection={handleDateSelection}/></div>
              <div className='h-[49%]'><UpcomingEvents/></div>
            </div>

          </div>

        </div>

        <div className='mt-10 '>
          <AttendanceTable  selectionDate={selectionDate} />
        </div>

      </div>
    </div>

  )
}

export default EmployerAttendance