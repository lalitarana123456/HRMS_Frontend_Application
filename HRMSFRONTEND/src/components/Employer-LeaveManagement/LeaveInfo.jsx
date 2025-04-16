import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LeaveInfo = () => {

  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(true);
  const [textareaVisible, setTextareaVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleClose = () =>
  {
    setIsVisible(false);
    navigate("/leave-management")
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
  }

  const handleReject = () => {
    if(!textareaVisible)
    {
      setTextareaVisible(true);
    }
    else
    {
      if(reason.trim() === '')
      {
        alert("Please Provide A Reason For Rejection!");
        return
      }
      alert("Leave Request Cancelled");
      setIsFormSubmitted(true);
      handleClose();
    }
  };

  const handleApprove = () => {
    alert("Leave Has Been Approved!")
    setIsFormSubmitted(true);
    handleClose();
  }

  if (!isVisible) return null;

  return (
    <div
    id='main'
    onClick={handleClose}
    className='lg:w-screen lg:h-screen bg-black opacity-85 flex justify-center items-center'>

      <div 
      id="infoCard"
      className='lg:w-[35%] lg:h-[90%] bg-white lg:rounded-[20px] lg:px-10 lg:py-8 flex flex-col gap-5'
      onClick={(e) => e.stopPropagation()} 
      >

        <div 
        id="user"
        className='lg:w-full lg:h-[10%] flex items-center gap-5'>

          <img 
          src="" 
          alt=""
          className='lg:w-[60px] lg:h-[60px] border border-black rounded-full' />

          <span>

            <h1 
            id='userName'
            className='font-lato lg:text-2xl lg:font-bold text-black'>Sara Doe</h1>

            <div 
            id="designation"
            className='font-lato lg:text-base lg:font-medium text-[#444444]'>UI/UX Designer</div>

          </span>

        </div>

        <div 
        id="leaveInfo"
        className='lg:w-full lg:h-[15%] flex flex-row justify-between'>

        <div className='justify-between font-lato lg:text-sm lg:font-bold'>
          <span><p className='text-[#898989]'>Leave Type</p>Family Vacation</span>
          <span><p className='text-[#898989]'>Start Date</p>Jan 6, 2025</span>
        </div>

        <div className='justify-between font-lato lg:text-sm lg:font-bold'>
          <span><p className='text-[#898989]'>Duration</p>1 Day</span>
          <span><p className='text-[#898989]'>End Date</p>Jan 6, 2025</span>
        </div>

        </div>

        <div 
        id="description"
        className='lg:w-full lg:h-[20%] font-lato lg:text-sm lg:font-bold'>
          <p className='text-[#898989] lg:mb-1'>Leave Description</p>
          <p className='text-wrap text-justify overflow-y-auto w-full h-[80%]'
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            Taking a Family vacation to a nearby place, will be available via email for urgent matters.
          </p>
        </div>

        <div 
        id="attachments"
        className='lg:w-full h-[20%]'>

          <h1 className='font-lato lg:text-sm lg:text-[#898989] lg:font-bold mb-2'>Attachments</h1>

          <div 
          className='lg:w-full lg:h-[80%] overflow-y-auto flex flex-col gap-2'
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>

            <span className='flex gap-1 bg-[#F0F0F0] px-2 w-full h-[50%] items-center rounded-[8px] mx-auto'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" stroke="#D9432F" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke-width="1.5" d="M7.792 21.25h8.416a3.5 3.5 0 0 0 3.5-3.5v-5.53a3.5 3.5 0 0 0-1.024-2.475l-5.969-5.97A3.5 3.5 0 0 0 10.24 2.75H7.792a3.5 3.5 0 0 0-3.5 3.5v11.5a3.5 3.5 0 0 0 3.5 3.5" />
                  <path stroke-width="1.5" d="M11.688 3.11v5.66a2 2 0 0 0 2 2h5.662" />
                  <path d="M7.25 16.5v-1m0 0v-2h1a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1zm4 1v-3h.5a1.5 1.5 0 0 1 0 3zm4 0v-1.25m1.5-1.75h-1.5v1.75m0 0h1.5" />
                </g>
              </svg>
              <p className='font-lato lg:font-medium lg:text-sm'>Travel Itinrary.pdf</p>
              <button className='ml-auto'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#0195FF" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-8 4v-5h2v3h12v-3h2v5z" />
                </svg>
              </button>
            </span>

            <span className='flex gap-1 bg-[#F0F0F0] px-2 w-full h-[50%] items-center rounded-[8px] mx-auto'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#3BC597" d="M20 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2m-2 0H6v6.38l2.19-2.19l5.23 5.23l1-1a1.59 1.59 0 0 1 2.11.11L18 16zm-5 3.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0" />
            </svg>
              <p className='font-lato lg:font-medium lg:text-sm'>Booking Confirmation.jpg</p>
              <button className='ml-auto'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#0195FF" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-8 4v-5h2v3h12v-3h2v5z" />
                </svg>
              </button>
            </span>

          </div>

        </div>

        <form 
        onSubmit={handleFormSubmit}
        className='lg:w-full lg:h-[35%] flex flex-col gap-3'>

          {textareaVisible && (

          <div className='lg:w-full lg:h-[40%%]' >

            <h1
            className='font-lato lg:font-bold lg:text-sm text-[#898989]'>
              Reason For Rejection:
            </h1>

            <textarea
            placeholder="Type Reason Here."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            class="lg:w-full lg:h-[80%] lg:text-sm font-lato lg:font-bold border-l-8 border-[#FF0000] outline-none pl-1 bg-gradient-to-r from-[#FFE7E4] to-[#FFFFFF] overflow-y-auto resize-none"
            style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
          ></textarea>

          </div>
           )}

          <div 
          className='lg:w-full lg:h-[60%] flex justify-center items-center gap-4'>

            <button 
            onClick={handleReject}
            className='bg-[#D9432F] lg:w-[40%] lg:h-[40px] lg:rounded-[5px] text-white font-lato lg:text-sm lg:font-bold flex items-center justify-center gap-2'>
              <svg 
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
              </svg>
              <p>Reject</p>
            </button>

            <button 
            onClick={handleApprove}
            className='bg-[#009A57] lg:w-[40%] lg:h-[40px] lg:rounded-[5px] text-white font-lato lg:text-sm lg:font-bold flex items-center justify-center gap-2'>
              <svg 
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z" />
              </svg>
              <p>Accept</p>
            </button>

          </div>

        </form>


      </div>

    </div>
  )
}

export default LeaveInfo