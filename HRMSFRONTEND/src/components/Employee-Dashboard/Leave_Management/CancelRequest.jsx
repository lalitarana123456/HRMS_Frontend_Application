import React, { useState } from 'react';
import { RiCloseLargeFill } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CancelRequest = ({dataId}) => {
  const [action, setAction] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const confirmation = (e) => 
  {
    e.preventDefault();
    handleDeleteRequest();
    // setAction('confirmation');
  };

  const closePopup = () => 
  {
    setIsVisible(false);
    navigate("/leave");
  };

  const handleClick = (e) => 
  {
    if (e.target.id === 'main') 
    {
      closePopup();
    }
  };

  const handleDeleteRequest = async () => 
  {
    const token = localStorage.getItem('token');
    if (!token) 
    {
      toast.error("You Are Not Authorized, Please Log-In!");
      return;
    }

    try 
    {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/cancel?leaveId=${dataId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { message, error } = response.data;
      if (message) 
      {
        toast.success(message || "Leave Request Cancelled Successfully!");
        // setAction('confirmation')
        // navigate("/leave");
        closePopup();
      } 
      else 
      {
        toast.error(error)
      }
    } 
    catch (err) 
    {
      console.error("Error deleting leave request:", err.response || err);
      if (err.response) 
      {
        toast.error(`Error: ${err.response.data.error}`);
      } 
      else 
      {
        toast.error("An unexpected error occurred!");
      }
    }
  };

  return (

    isVisible && (
      <div 
      id="main"
      onClick={handleClick}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
        
        {action === null && (
          <form
          onSubmit={(e) => e.preventDefault()}
          className="lg:w-[30%] lg:h-[35%] w-[90%] h-[25%] rounded-3xl flex justify-center lg:gap-28 gap-14 lg:p-8 bg-white items-center flex-col relative md:w-[50%] md:h-[20%]">
            
            <h1 
            className="rounded-3xl font-lato font-medium lg:text-lg text-lg px-1">
              Are You Sure?
            </h1>

            <button
            className="absolute lg:top-4 lg:right-15 top-7 right-9"
            onClick={closePopup}>
              <RiCloseLargeFill />
            </button>

            <div 
            className="flex gap-32">
              
              <button
              type="button"
              onClick={confirmation} 
              className="border-2 border-[#009A57] lg:px-6 px-5 lg:py-2 py-1 rounded-2xl lg:text-base text-[10px] text-[#009A57]">
                Yes
              </button>

              <button
              type="button"
              onClick={closePopup}
              className="border-2 border-[#D9432F] lg:px-6 px-5 lg:py-2 py-1 rounded-2xl lg:text-base text-[10px] text-[#D9432F]">
                No
              </button>

            </div>

          </form>
        )}

        {/* {action === 'confirmation' && (
          
          <div className="lg:w-[30%] lg:h-[15%] w-[90%] h-[5%] rounded-3xl flex justify-center gap-28 p-8 bg-white items-center">
            
            <p className="font-lato lg:text-2xl text-lg">
              Your Request Has Been Cancelled!
            </p>

          </div>

        )} */}

      </div>
    )

  );
};
export default CancelRequest;



