import React, { useEffect, useState } from 'react';
// import Sidebar from '../Sidebar/Sidebar';
import { MdOutlineCalendarMonth } from "react-icons/md";
import axios from 'axios';
import { FaCircle } from "react-icons/fa";
import {Link} from 'react-router-dom';
import { AiOutlineInfoCircle } from "react-icons/ai";

const LeaveTable = ({openModal}) => {

  const [leave, setLeave] = useState([])
  const [currPage, setCurrPage] = useState(1);
  const recPerPage = 5;
  const lastInd = currPage * recPerPage;
  const firstInd = lastInd - recPerPage;
  const rec = leave.slice(firstInd, lastInd);
  const npages = Math.ceil(leave.length / recPerPage);
  const num = [...Array(npages).keys()].map((n) => n + 1);

  const nextPage = () => 
  {
    if (currPage < npages) 
    {
      setCurrPage(currPage + 1);
    }
  };

  const prevPage = () => 
  {
    if (currPage > 1) 
    {
      setCurrPage(currPage - 1);
    }
  };

  
  const getLeaveData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response.data);
        const leaveData = response.data.leaves || [];
        setLeave(leaveData);
      } catch (error) {
        console.error("Error Fetching API:", error.response || error);
      }
    } else {
      console.log("Token Not Found In Local Storage");
    }
  };

  useEffect(() => {
    getLeaveData();
  }, [])

    const [isExpanded, setIsExpanded] = useState(false);
  
    const toggleExpand = () => {
      setIsExpanded((prev) => !prev);
    };

  const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    return windowWidth;
  };

  const windowWidth = useWindowWidth();

  const first3Records = 3;

  // If it's mobile view show all records, otherwise paginate
  const displayedrec = windowWidth <= 1023 
  ? (isExpanded ? leave : leave.slice(0, first3Records)) 
  : leave.slice((currPage - 1) * recPerPage, currPage * recPerPage);

// const displayedRecords = isExpanded ? rec : rec.slice(0, 3);
  
  return (
    
    <div
  id="main"
  className="lg:flex bg-[#D5EAE7]">
      
      {/* <Sidebar /> */}
      
      <div id="leave" className="lg:flex-1 lg:p-2">

        <div id="table" className="lg:w-[91%] lg:h-[277px] lg:mx-auto hidden lg:flex lg:flex-col">
          
          <table className="w-full border-collapse border border-gray-200 rounded-3xl drop-shadow-lg overflow-hidden ">
            
            <thead className="bg-[#F5F9F9]">
              
              <tr className="h-10">
                
                <th className="text-center text-sm font-bold text-[#686868]">
                  <div className="flex justify-center gap-2 items-center">
                    <MdOutlineCalendarMonth className='text-xl'/> Leave History
                  </div>
                </th>
                
                <th className="text-center text-sm font-bold text-[#686868]">
                  <div className="flex justify-center gap-2 items-center">
                    <MdOutlineCalendarMonth className='text-xl'/> Leave Type
                  </div>
                </th>
                
                <th className="text-center text-sm font-bold text-[#686868]">
                  <div className="flex justify-center gap-2 items-center">
                    <MdOutlineCalendarMonth className='text-xl'/> Status
                  </div>
                </th>
                
                <th className="text-center text-sm font-bold text-[#686868]">
                  <div className="flex justify-center gap-2 items-center">
                    <MdOutlineCalendarMonth className='text-xl'/> Reason
                  </div>
                </th>
                
                <th className="text-center text-sm font-bold text-[#686868]">
                  <div className="flex justify-center gap-2 items-center">
                    <MdOutlineCalendarMonth className='text-xl'/> Action
                  </div>
                </th>
              
              </tr>
            
            </thead>

            <tbody>
              
              {rec.length > 0 ?  (
              rec.map((data, index) => (
                <tr key={index} className="bg-white border-b border-gray-300 h-10">
                  
                  <td className="text-center text-xs font-bold text-[#9C9C9C] py-3">{data.startDate} - {data.endDate}</td>
                  
                  <td className="text-center text-xs font-bold text-[#9C9C9C] py-3">{data.paidOrUnpaidType}</td>
                  
                  <td className="text-center text-xs font-bold py-3 relative">
                      <span
                        className={`px-5 border-[1px] rounded-full 
                          ${data.status === "Approved" ? 'border-[#009A57] text-[#009A57]' : ''} 
                          ${data.status === "Pending" ? 'border-[#FFB700] text-[#FFB700]' : ''}
                          ${data.status === "Rejected" ? 'border-[#D9432F] text-[#D9432F]' : ''}`}
                      >
                        {data.status}
                      </span>
                      <span className='absolute right-1 bottom-1 text-lg text-[#919191]'>
                        {data.status === "Rejected" && (
                          <button
                          onClick={(e) => {
                            e.preventDefault();
                            openModal('info', data._id);
                            }}><AiOutlineInfoCircle/></button>
                        )}
                      </span>
                  </td>
                  
                  <td className="text-center text-xs font-bold text-[#9C9C9C] py-3">{data.leaveType}</td>

                  <td className="text-center text-xs font-bold py-3">

                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (data.status === "Approved") {
                        openModal('edit', data._id);
                      } else if (data.status === "Pending") {
                        openModal('cancel', data._id);
                      }
                      else if(data.status === "Rejected") {
                        openModal('edit', data._id);
                      }
                    }}
                    className=
                    {`
                      ${data.status === "Approved" ? 'text-[#176CED]' : ''} 
                      ${data.status === "Pending" ? 'text-[#D9432F]' : ''}
                      ${data.status === "Rejected" ? 'text-[#176CED]' : ''} 
                    `}
                    aria-disabled={data.status !== "Approved" && data.status !== "Pending"}>
                    {data.status === "Approved" ? "Edit" : data.status === "Pending" ? "Cancel Request" : data.status === "Rejected" ? "Edit" : null}
                  </Link>

                  </td>
                  
              </tr>

            ))
        ) : (
          <tr>
            <td colSpan="5" className="font-lato font-bold text-xs text-[#C1C1C1] text-center py-4">
              No Leave Records Found.
            </td>
          </tr>
        )}

            </tbody>
          
          </table>

          <nav className='flex justify-center my-2 text-xs'>
          <button onClick={prevPage} disabled={currPage === 1} className='px-4 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50'>Prev</button>
          {num.map((n) => (
            <button
              key={n}
              onClick={() => setCurrPage(n)}
              className={`px-4 py-2 mx-1 rounded ${currPage === n ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {n}
            </button>
          ))}
          <button onClick={nextPage} disabled={currPage === npages} className='px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50'>Next</button>
        </nav>
        
        </div>

        <div 
        id='responsive-view'
        className='lg:hidden w-[100%] bg-[#D5EAE7]'>
            <div 
            id="leaveHistory"
            className={`w-[94%] mx-auto mt-5 rounded-[11px] bg-[#FFFFFF] p-2 relative drop-shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? 'h-auto' : 'h-[250px]'
            }`}>
              
              <h1 className='font-lato font-semibold text-xl'>Leave History</h1>

                <div className='leading-7 mt-3'>

                {displayedrec.length > 0 ? (
                displayedrec.map((data, index) => (
                    <div key={data.id || index} className="flex flex-col mb-2">
                      <span className="flex justify-between">
                        <p className="text-base font-normal">{data.startDate} - {data.endDate}</p>
                        <p className="text-base font-bold text-[#CFCFCF] flex items-center gap-2">
                        <span>
                          <FaCircle 
                            className={`text-[8px] ${
                              data.status === 'Approved' ? 'text-[#009A57]' :
                              data.status === 'Pending' ? 'text-[#FFB700]' :
                              data.status === 'Rejected' ? 'text-[#D9432F]' :
                              'text-[#CFCFCF]'
                            }`}
                          />
                        </span>
                        {data.status}
                        <span className='text-lg text-[#919191]'>
                          {data.status === "Rejected" && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                openModal('info', data._id);
                              }}
                            >
                              <AiOutlineInfoCircle />
                            </button>
                          )}
                        </span>
                      </p>
                      </span>
                      <span className="flex justify-between">
                        <p className="text-sm font-normal text-[#999999]">{data.paidOrUnpaidType}&nbsp;:&nbsp;{data.leaveType}</p>
                        <p className='text-xs'>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (data.status === "Approved") {
                              openModal('edit', data._id);
                            } else if (data.status === "Pending") {
                              openModal('cancel', data._id);
                            }
                            else if (data.status === "Rejected") {
                              openModal('edit', data._id);
                            }
                          }}
                          className=
                          {`
                            ${data.status === "Approved" ? 'text-[#176CED]' : ''} 
                            ${data.status === "Pending" ? 'text-[#D9432F]' : ''}
                            ${data.status === "Rejected" ? 'text-[#176CED]' : ''}
                          `}
                          aria-disabled={data.status !== "Approved" && data.status !== "Pending" && data.status !== "Rejected"}
                        >
                          {data.status === "Approved" ? "Edit" : data.status === "Pending" ? "Cancel Request" : data.status === "Rejected" ? "Edit" : null}
                        </Link>
                        </p>
                    </span>
                    </div>
                  ))
                  ) : (
                    <p className="font-lato font-bold text-base text-[#C1C1C1]">No Leave Records Found.</p>
                  )}
                
                </div>
                <br />
                <button 
                onClick={toggleExpand}
            
                className='text-[#176CED] font-medium text-xs absolute bottom-3 right-4'>
                  {isExpanded ? 'View Less' : 'View More'}
                </button>
            
            </div>
      </div>

            {/* <div className='lg:hidden w-screen bg-[#D6EBE7]'>
          <div 
            id="availableLeaves"
            className='w-[94%] h-[178px] mx-auto mt-5 rounded-[11px] bg-[#FFFFFF] p-2 relative drop-shadow-xl'>

              <h1 className='font-lato font-semibold text-xl'>Available Leaves</h1>

              <div className='flex flex-col font-lato font-medium text-base mt-3 leading-9'>
                <div className='flex justify-between'><p>Annual Leaves </p><span className='font-semibold'>10 Days</span></div>
                <div className='flex justify-between'><p>Sick Leaves</p><span className='font-semibold'>5 Days</span></div>
              </div>

              <a href="" className='text-[#176CED] font-medium text-xs absolute bottom-3 right-4'>Edit</a>
          
            </div>
            </div> */}

        </div>
       
    </div>
  );
};

export default LeaveTable;