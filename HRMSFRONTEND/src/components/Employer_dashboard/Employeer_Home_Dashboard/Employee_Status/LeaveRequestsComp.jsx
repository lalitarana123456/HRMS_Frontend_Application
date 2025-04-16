import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlinePersonalInjury } from "react-icons/md";



function LeaveRequestsComp() {
  const [leaveData, setLeaveData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/pending-leave-count`,{
          headers: { Authorization: `Bearer ${token}` }
        });
        // console.log("API Response:", response.data); 

        if (response.data) {
          setLeaveData(response.data);
        }
      } catch (error) {
        console.error('Error fetching leave data:', error);
      }
    };

    fetchLeaveData();
  }, []);

  return (
    <div className='bg-white h-96 w-full sm:w-full md:w-[50%] rounded-2xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] p-4'>
      <p className='text-center text-xl font-semibold'>Leave Requests</p>

      <div className='space-y-6 h-40 sm:h-52 md:h-[85%]'>
        <div className='flex justify-between border-b-2 mt-6'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 14c0-3.771 0-5.657 1.172-6.828S6.229 6 10 6h4c3.771 0 5.657 0 6.828 1.172S22 10.229 22 14s0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14Zm14-8c0-1.886 0-2.828-.586-3.414S13.886 2 12 2s-2.828 0-3.414.586S8 4.114 8 6" /><path sstrokeLinecap="round" d="M13.5 14h-3m1.5-1.5v3" /><circle cx="12" cy="14" r="4" /></g></svg>
          <p className='text-base'>Sick Leave</p>
          <p>{leaveData["Sick Leave"] ?? "NA"}</p>
        </div>

        <div className='flex justify-between border-b-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13.375h2v-6.75h-2zM12 16q.425 0 .713-.288T13 15t-.288-.712T12 14t-.712.288T11 15t.288.713T12 16m0 6.8L1.2 12L12 1.2L22.8 12zm0-2.8l8-8l-8-8l-8 8zm0-8" /></svg>
          <p>Emergency Leave</p>
          <p>{leaveData["Emergency Leave"] ?? "0"}</p>
        </div>

        <div className='flex justify-between border-b-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" d="M224 144a64 64 0 1 0-64-64a64.07 64.07 0 0 0 64 64m0-96a32 32 0 1 1-32 32a32.036 32.036 0 0 1 32-32m129.959 203.37c-15.021-16.9-35.063-27.659-62.61-33.506L266.551 160h-88.428L152 342.863V400h56v96h96v-96h80v-48c0-44.972-9.826-77.888-30.041-100.63M352 368h-80v96h-32v-96h-56v-22.863L205.877 192h39.572l23.291 54.344l8.629 1.438c24.5 4.083 41.233 11.979 52.672 24.848C344.817 289.253 352 315.215 352 352Z" /></svg>
          <p>Maternity Leave</p>
          <p>{leaveData["Maternity Leave"] ?? "0"}</p>
        </div>

        <div className='flex justify-between border-b-2'>
          <MdOutlinePersonalInjury />
          <p>Personal Leave</p>
          <p>{leaveData["Personal Leave"] ?? "0"}</p>
        </div>

        <div className='flex justify-between border-b-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M12 2.75a6.25 6.25 0 1 0 0 12.5a6.25 6.25 0 0 0 0-12.5M4.25 9a7.75 7.75 0 1 1 8.5 7.714v1.036h1.75a.75.75 0 0 1 0 1.5h-1.75V22a.75.75 0 1 1-1.5 0v-2.75H9.5a.75.75 0 0 1 0-1.5h1.75v-1.036A7.75 7.75 0 0 1 4.25 9" clipRule="evenodd" /></svg>
          <p>Menstrual Leave</p>
          <p>{leaveData["Menstrual Leave"] ?? "0"}</p>
        </div>

        <div className='flex justify-between border-b-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M17.382 6.001L13.07 17.184l4.574 24.8l12.673.014l4.614-24.796l-4.294-11.19zm14.629-1.988L16.01 4L11 16.992l4.978 26.99l16 .018L37 17.013z" /><path d="M23 17.997V26h2v-8.003h3v-2h-3V13h-2v2.997h-3v2z" /></g></svg>
          <p>Bereavement Leave</p>
          <p>{leaveData["Bereavement Leave"] ?? "0"}</p>
        </div>
      </div>
    </div>
  );
}

export default LeaveRequestsComp;
