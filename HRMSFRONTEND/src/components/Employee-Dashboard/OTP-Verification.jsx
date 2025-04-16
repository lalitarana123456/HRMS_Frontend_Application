import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OTPVerification = () => {

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const location = useLocation();
  const email = location.state ?. email || '';
  const [remainingTime, setRemainingTime] = useState(120);

  const navigate = useNavigate()

  const handleChange = (e, index) =>
  {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
  

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if(value && index < otp.length - 1)
    {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const getRemainingOTPTime = async () =>
  {
    try
    {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/otp/otp-timer`, {
        email,
      });
      // const {remainingTime, message, error} = response.data;

      if(response.data.error)
      {
        setError(response.data.error);
      }
      else
      {
        setRemainingTime(response.data.remainingTime);
      }
    }
    catch(err)
    {
      console.error("Error Fetching OTP Time", err);
      // setError("failed To Fetch OTP Timer!");
    }
  };

  useEffect(() =>
  {
    getRemainingOTPTime();
  }, [email]);

  useEffect(() => {
    if(remainingTime > 0)
    {
      const timerInterval = setInterval(() =>
      {
        setRemainingTime(prevTime => {
          if(prevTime <= 1)
          {
            clearInterval(timerInterval);
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [remainingTime]);

  const formatTime = (time) =>
  {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; 
  }

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if(enteredOtp.length !== 4 || /[^0-9]/.test(enteredOtp))
    {
      setError("Please Enter The Whole OTP!");
      return
    }

    try
    {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/otp/verify-otp`, 
      {
        email, 
        otp: enteredOtp,
      });
      
      const {message, error} = response.data;

      if(message)
      {
        toast.success("OTP Verified Successfully!");
        setError("");
        setOtp(["", "", "", ""]);
        navigate("/reset-password", {state:{email}})
      }
      else if(error)
      {
        setError(error);
      }
      else
      {
        setError("Invalid OTP, Please Try Again!");
      }
    }
    catch(err)
    {
      console.log(err);
      setError("Please Enter The Correct OTP.");
    }
  };

  const handleResendOtp = async () =>
  {
    try
    {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/otp/send-otp`, {
        email,
      });

      const {message, error} = response.data;
      if(message)
      {
        toast.success("OTP Has Been Sent To Your E-Mail ID.");
        setOtp(["", "", "", ""]);
        setError("");
        setRemainingTime(120);

      }
      else if(error)
      {
        setError(error);
      }
      else
      {
        setError("Failed To Resend OTP!")
      }
    }
    catch(err)
    {
      console.error("Error Resending OTP: ", err);
      // setError("Failed To Resend OTP.");
    }
  };

  const handleKeyDown = (e, index) => 
  {
    if (e.key === 'Backspace' && !otp[index] && index > 0) 
      {
      document.getElementById(`otp-input-${index - 1}`).focus();
      }
  };

  return (
    <div 
    id='main'
    className='h-screen w-screen flex lg:flex-row lg:bg-[#F5F5F5] overflow-hidden'>

      <div 
      id="first"
      className='lg:w-[55%] lg:h-screen hidden md:block lg:relative'>

        <img 
        className='lg:w-[70%] lg:h-[80%] lg:ml-3 md:hidden lg:block lg:absolute lg:bottom-0'
        src="./otp.png" 
        alt="" />

      </div>

      <div 
      id="second"
      className='lg:w-[45%] h-screen lg:rounded-tl-[25px] lg:rounded-bl-[25px] flex relative w-screen lg:flex-row flex-col lg:justify-normal justify-between'
      style={{ background: 'linear-gradient(180deg, rgba(79, 199, 177, 0.78) 12.51%, rgba(112, 255, 229, 0.78) 98.55%)' }}>

        <img 
        className='absolute lg:top-0 lg:rotate-0 lg:right-0 w-[280px] h-[282px] -rotate-90 lg:w-[70%] lg:h-[80%]'
        src="/front.png" alt="" />

        <form 
        onSubmit={handleSubmit}
        className='lg:w-[50%] lg:h-[60%] lg:m-auto z-10 flex flex-col items-center justify-between w-[60%] h-[35%] mx-auto mt-24'
        action="">

          <span className='flex flex-col items-center'>
            <h1 className='font-extrabold font-lato lg:text-3xl lg:mb-2 mb-4 text-lg'>OTP VERIFICATION</h1>
            <h5 className='font-lato lg:font-normal lg:text-xs text-[10px]'>Enter The OTP Sent To: 
              <span className='font-semibold'>&nbsp;{email}</span>
            </h5>
          </span>

          <span className='flex flex-col items-center'>

            <span className='grid grid-cols-4 mb-6 gap-2'>
              {otp.map((digit, index) => 
              (
                <input
                key={index}
                type='text'
                id={`otp-input-${index}`}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                autoFocus={index === 0}
                inputMode='numeric'
                className='lg:w-[66px] lg:h-[60px] w-[49px] h-[48px] lg:mx-auto text-center text-lg border rounded-md font-lato outline-none bg-[#F6F6F6]'
                style={{ boxShadow: 'inset 2px 2px 4px 0px rgba(0, 0, 0, 0.12)' }}/>
              ))}
            </span>

            {error && <p className='text-red-500 text-xs mb-4'>{error}</p>}

            <h5 className='font-medium lg:text-xs font-lato text-[10px] lg:mb-4 mb-2'>{formatTime(remainingTime)}</h5>

          </span>

          <span className='lg:w-[100%]'>

          <button
          type="submit"
          className='lg:w-[100%] lg:h-[50px] w-[129px] h-[50px] rounded-[10px] bg-custom-gradient border border-white font-bold lg:text-xl font-lato text-white lg:rounded-[10px] text-xs hover:bg-[linear-gradient(90deg,_#1A3FB7_0%,_#75E6D4_100%)]'>
          Submit
        </button>

          </span>

        </form>

        <h5 className='lg:font-medium lg:text-xs font-lato text-[10px] font-normal lg:top-[64%] lg:right-[35%] top-[37%] right-[32%] md:right-[41%] absolute text-nowrap z-50'>Not Received The OTP? &nbsp;
            <button 
            onClick={handleResendOtp}
            className='font-extrabold'>Resend</button>
          </h5>

        <img 
        className='w-[338px] h-[350px] md:w-[438px] md:h-[460px] lg:hidden mx-auto'
        src="./otp.png" 
        alt="" />

      </div>

    </div>
  )
}

export default OTPVerification