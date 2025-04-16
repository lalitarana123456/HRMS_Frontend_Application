import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveBalance = () => {

  const [leaveBalance, setLeaveBalance] = useState(null);

  const getLeaveBalance = async () => 
  {
    const token = localStorage.getItem('token');
    if (token)
    {
      try 
      {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/leaveBalance`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);

        const remainingLeaves = response.data.leaveBalance || 0;
        setLeaveBalance(remainingLeaves);
      } 
      catch (error) 
      {
        console.error('Error Fetching API:', error.response || error);
      }
    } 
    else 
    {
      console.log('Token Not Found In Local Storage');
    }
  };

  useEffect(() => {
    getLeaveBalance();
  }, []);
  

  return (
    <p>
      {leaveBalance !== null ? `${leaveBalance} Paid Leaves Remaining!` : 'No Paid Leaves Available!'}
    </p>
  );
};

export default LeaveBalance;

