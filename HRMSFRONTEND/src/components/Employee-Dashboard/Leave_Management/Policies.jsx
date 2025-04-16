import React from 'react'
import { FaCheckCircle } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

const Policies = () => {
  return (
    <div>

          <div 
          id="leavePolicies"
          className='h-[287px] bg-white rounded-[20px] hidden lg:flex lg:flex-col'>

            <div 
            id="heading"
            className='w-full h-[70px] rounded-tr-[20px] rounded-tl-[20px] text-2xl font-bold font-lato bg-[#F5FAF9] bg-opacity-88 p-8 shadow-lg flex justify-between items-center'>
              Leave Policies
              <FaChevronDown/>
            </div>

            <div 
            id="content"
            className='w-[90%] h-[150px] font-semibold text-base font-lato my-8 mx-6 leading-8'>

                <p className='flex items-center gap-2'><FaCheckCircle className='text-[#27AE60]'/>20 days of paid leave per year</p>
                <p className='flex items-center gap-2'><FaCheckCircle className='text-[#27AE60]'/>5 days of sick leave</p>
                <p className='flex items-center gap-2'><FaCheckCircle className='text-[#27AE60]'/>3 days of bereavement leave</p>
                <p className='flex items-center gap-2'><FaCheckCircle className='text-[#27AE60]'/>Maternity and paternity leave as per law</p>
                {/* <div className='mt-6'>
                  <a href="" className='no-underline text-[#2F80ED]'>View Full Policies</a>
                </div> */}

            </div>

          </div>
          
          
          <div className='lg:hidden w-[100%] h-[250px] bg-[#D5EAE7]'>
            <br className='md:hidden'/>
            <div 
            id="policies"
            className='w-[94%] h-[180px] md:w-full md:h-[80%] mx-auto rounded-[11px] bg-[#FFFFFF] p-2 relative drop-shadow-xl font-lato text-base'>
              <h1 className='font-lato font-semibold text-xl pb-3'>Leave Policies</h1>
              <div className='font-lato text-base gap-1 flex flex-col font-medium'>
                <p className='flex items-center gap-2'><FaCheckCircle className='text-[#27AE60]'/>20 days of paid leave per year</p>
                <p className='flex items-center gap-2'><FaCheckCircle className='text-[#27AE60]'/>5 days of sick leave</p>
                <p className='flex items-center gap-2'><FaCheckCircle className='text-[#27AE60]'/>3 days of bereavement leave</p>
                <p className='flex items-center gap-2'><FaCheckCircle className='text-[#27AE60]'/>Maternity and paternity leave as per law</p>
              </div>
            </div>
            </div>

    </div>
  )
}

export default Policies