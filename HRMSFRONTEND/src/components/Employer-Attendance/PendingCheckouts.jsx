import React, {useState, useEffect} from 'react'
import axios from 'axios'

const PendingCheckouts = () => {

  const [pendingCheckouts, setPendingCheckouts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPendingCheckouts = async () => 
    {
      try
      {
        const response = await axios.get('http://localhost:5000/api/v1/administrative/full-attendance/pending-checkout/employees', {
          headers:
          {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(response.data);
        setPendingCheckouts(response.data.pendingCheckOutCount);
      }
      catch(err)
      {
        console.error("Error Fetching Pending Checkouts:", err);
        setError("An error occurred while fetching pending checkouts.");
      }
    };
    getPendingCheckouts();
  }, []);

  return (
    <div 
    id='pending-checkouts'
    className='lg:w-[32%] w-[32%] rounded-md h-full lg:rounded-[20px] bg-[#FFEDD3] lg:drop-shadow-xl  font-lato lg:pl-3 pl-1 flex flex-col justify-center p-2'>
        <h1
        className='font-semibold lg:text-[16px] text-[11px] text-nowrap'>
          Pending Checkouts: 
        </h1>
        <p 
        className="lg:text-[20px] text-sm lg:font-bold text-[#DFA000]">
          {pendingCheckouts !== null ? pendingCheckouts : 'Loading...'}
        </p>
    </div>
  )
}

export default PendingCheckouts