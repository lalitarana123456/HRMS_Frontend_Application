import React, {useState} from 'react'
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setsuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 
  const email = location.state?.email || '';

  const handleSubmit = async (e) =>
  {
    e.preventDefault();

    if(!newPassword || !confirmPassword)
    {
      setError("Please Fill All The Fields!");
      return
    }

    if(newPassword !== confirmPassword)
    {
      setError("Enter Same Password In Both The Fields!");
      return;
    }

    try
    {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employee/reset-password`,
        {
          email, newPassword, confirmPassword,
        }
      );

      if (response.data.message)
      {
        setsuccessMessage(response.data.message);
        setError("");
        toast.success("Paswword Reset Successfully!");
        navigate('/login')
      }
    }
    catch(err)
    {
      console.error("Error While Re-setting The Passsword:", err);
      const errorMsg = err.response?.data?.message || "Failed To Reset Password!"
      setError(errorMsg);
      setsuccessMessage("");
    }
  };

  const passwordVisibility = () => 
  {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div
    id='main'
    className='w-screen h-screen lg:flex lg:bg-[#F5F5F5]'>

      <div 
      id="first"
      className='lg:w-[50%] lg:h-screen lg:rounded-tr-[25px] lg:rounded-br-[25px] lg:flex relative w-screen h-screen overflow-clip'
      style={{ background: 'linear-gradient(180deg, rgba(79, 199, 177, 0.78) 12.51%, rgba(112, 255, 229, 0.78) 98.55%)' }}>

        <img 
        className='lg:absolute lg:-rotate-90 lg:-top-40 lg:left-0 w-[280px] h-[282px] -rotate-90  lg:w-[70%] lg:h-[80%]'
        src="./front.png" alt="" />  

        <img 
        className='absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-[70%] lg:h-[80%] md:w-[558px] md:h-[594px] bottom-0 left-1/2 -translate-x-1/2'
        src="./reset.png" alt="" />  

      </div>

      <div 
      id="second"
      className='lg:w-[50%] lg:h-screen lg:relative flex'>

        <form 
        className='lg:w-[60%] lg:h-[70%]  m-auto flex items-center flex-col justify-between absolute inset-1 bottom-1/2 w-[289px] h-[335px] lg:inset-0'
        onSubmit={handleSubmit}>

          <h1 className='lg:w-[286px] lg:h-[40px] font-lato lg:font-semibold lg:text-2xl text-lg font-semibold mt-10 text-center'>RESET PASSWORD</h1>

          <div className='w-full'>
            
            <h5 className='lg:text-base lg:font-semibold font-lato lg:mb-2 mb-1 text-[10px]'>Enter Password:</h5>

            <input 
            type="password" 
            className='w-full lg:h-[40px] rounded-[8px] p-2 mb-8 outline-none h-[47px] lg:text-base text-[9px]' 
            placeholder='Enter Password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} />
          
            <h5 className='lg:text-base lg:font-semibold font-lato lg:mb-2 mb-1 text-[10px]'>Re-Enter Password:</h5>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className='w-full lg:h-[40px] h-[47px] rounded-[8px] p-2 outline-none lg:text-base text-[9px] font-normal '
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={passwordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {showPassword ? <IoMdEyeOff/> : <IoEye/>}
              </button>
            </div>

          </div>

          {error && (
            <p className="text-red-500 lg:text-lg text-xs mb-4">{error}</p>
          )}
          {successMessage && (
            <p className="text-green-500 lg:text-lg text-xs mb-4">
              {successMessage}
            </p>
          )}

          <button
            className='bg-custom-gradient lg:w-[70%] lg:h-[10%] font-lato text-white font-bold lg:text-xl mx-11 border border-white rounded-[10px] w-[161px] h-[50px] text-xs flex items-center justify-center hover:bg-[linear-gradient(90deg,_#1A3FB7_0%,_#75E6D4_100%)]' 
            type='submit'>Submit</button>
          
        </form>
  
      </div>

    </div>
  )
}
export default ResetPassword