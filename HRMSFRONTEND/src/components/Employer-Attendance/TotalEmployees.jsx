import React, { useEffect, useState } from 'react'
import axios from 'axios'

const TotalEmployees = () => {

  const [totalEmployees, setTotalEmployees] = useState(null);
  const [presentEmployees, setPresentEmployees] = useState(null);

  useEffect(() => {
    const getTotalEmployees = async () =>
    {
      try
      {
        const response = await axios.get('http://localhost:5000/api/v1/administrative/full-attendance/total-employees/present', {
          headers:
          {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        console.log(response.data);
        setTotalEmployees(response.data.totalEmployees);
        setPresentEmployees(response.data.presentEmployees)
      }
      catch(err)
      {
        console.log("Error Fetching Employee Data:", err);
      }
    };
    getTotalEmployees();
  }, []);

  return (
    <div 
    id='total-employees'
    className='lg:w-[32%] w-[32%] rounded-md h-full lg:rounded-[20px] bg-[#CBFFED] lg:drop-shadow-xl  font-lato lg:pl-3 pl-1 flex flex-col justify-center p-2'>
        <h1
        className='font-semibold text-[11px] lg:text-[16px] text-nowrap'>
          Total Employees:
        </h1>
        <p 
        className="lg:text-[20px] text-sm font-bold">
          {totalEmployees !== null ? totalEmployees : 'Loading...'}
          &nbsp;&nbsp;
          <span 
          className='lg:text-xs text-[9px] font-bold text-[#31B369]'>
            Present: {presentEmployees !== null ? presentEmployees : 'Loading...'}
          </span>
        </p>
    </div>
  )
}

export default TotalEmployees