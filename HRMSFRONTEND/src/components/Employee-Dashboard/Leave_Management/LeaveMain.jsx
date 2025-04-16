import React from 'react';
import { FaPlus } from "react-icons/fa6";
import { HiArrowLeft } from "react-icons/hi2";
import { FiSearch } from "react-icons/fi";
import Holidays from './Holidays';
import LeaveTable from './LeaveTable';
import Policies from './Policies';
import { Link } from 'react-router-dom';
import { GoBellFill } from "react-icons/go";
import { RiMenu5Line } from "react-icons/ri";
import LeaveBalance from './LeaveBalance';
import EditRequest from './EditRequest';
import CancelRequest from './CancelRequest';
import { useState } from "react";
import Modal from './Modal';
import Sidebar from '../Sidebar/Sidebar';
import LeaveInformation from './LeaveInformation';

const LeaveMain = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (type, dataId) => 
  {
    // console.log('Opening modal with type:', type, 'and dataId:', dataId);
    setModalOpen(false);
    setTimeout(() => 
    {
      if (type === "edit") 
      {
        setModalContent(<EditRequest dataId={dataId} />);
      } 
      else if (type === "cancel") 
      {
        setModalContent(<CancelRequest dataId={dataId} />);
      }
      else if (type === "info") 
        {
          setModalContent(<LeaveInformation dataId={dataId} />);
        }
      setModalOpen(true);
    }, 100);
  };

  const closeModal = () => 
  {
    setModalOpen(false);
    setModalContent(null);
  };
 
  return (

    <div className='w-screen h-screen flex'>
        <Sidebar/>
<div
  id="main"
  className="flex-grow lg:flex h-screen bg-[#D5EAE7]">
      
      <div id="leave" className="lg:flex-1 lg:p-6">
        
        <div id="header" className="lg:w-[90%] lg:h-[33px] lg:mx-auto flex justify-between items-center">
          
          <div id="heading" className="lg:w-[40%] lg:h-[40px] lg:text-3xl lg:font-bold lg:font-lato hidden lg:flex lg:items-center text-nowrap">
            Leave Management
          </div>

          <div id="buttons" className="lg:w-[40%] lg:h-[48px] justify-between items-center hidden lg:flex">
            
            <button className="lg:w-[45%] lg:h-[35px] lg:bg-[#D1FAE5] lg:text-xs lg:font-extrabold lg:text-[#00BC5C] lg:rounded-[15px]">
              <LeaveBalance/>
            </button>

            <Link to="/request-leave" className="lg:w-[45%] lg:h-[35px] lg:bg-custom-gradient lg:text-xs lg:font-extrabold lg:text-white lg:rounded-[15px] flex justify-center items-center hover:bg-[linear-gradient(90deg,_#1A3FB7_0%,_#75E6D4_100%)]">
              <FaPlus className='lg:text-white lg:text-lg'/>&nbsp; Request Leave
            </Link>
          
          </div>

          <div 
          id="mobileHeader"
          className='lg:hidden w-screen'>

            <div 
            id="header"
            className='w-[90%] h-[24px] mt-5 flex mx-auto items-center justify-center'>

              {/* <div className='text-2xl'><RiMenu5Line/></div> */}

              <h1 className='font-lato text-xl font-bold'>Leave Management</h1>

              {/* <div className='text-2xl'><GoBellFill/></div> */}
     
            </div>

            <div 
            id="header"
            className='w-[90%] h-[24px] mt-5 flex mx-auto items-center justify-between'>

              <div className='w-[171px] h-[31px] rounded-[15px] bg-[#D1FAE5] text-[10px] font-extrabold text-[#00BC5C] font-lato flex justify-center items-center'>
                <LeaveBalance/>
              </div>

              <Link 
              to="/request-leave" 
              className='w-[131px] h-[31px] rounded-[15px] text-white font-lato text-[10px] font-extrabold flex items-center justify-center bg-custom-gradient'>
                Request Leave
              </Link>
     
            </div>

          </div>

        </div>

        <LeaveTable openModal={openModal} />
      <Modal isOpen={modalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>

          <div 
        id="info-panel"
        className='lg:w-[90%] lg:h-[38%] md:w-[95%] md:h-[38%] md:flex lg:justify-between lg:mt-2 lg:mx-auto md:mx-auto md:flex-col lg:flex-row'>
          {/* <br className='hidden md:flex'/> */}

          <div className="lg:w-[100%] lg:h-[187px] md:w-full md:h-full lg:bg-white lg:rounded-[20px] lg:drop-shadow-lg">
                    <Holidays/>
                    
          </div>
          <br className='hidden md:flex'/>

          {/* <div className='lg:w-[40%] lg:h-[287px] md:w-full md:h-full lg:bg-white lg:rounded-[20px] lg:drop-shadow-lg '>
                    <Policies/>
          </div> */}

        </div>
        </div>
        </div>
        </div>
  )
}

export default LeaveMain