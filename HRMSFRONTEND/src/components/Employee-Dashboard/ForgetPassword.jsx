import React, { useState } from 'react'
import axios  from 'axios'
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetPassword = () => {

  const navigate = useNavigate()

  const [fpinfo, setFpinfo ] = useState({
    email: '',
  });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    const { email } = fpinfo;

    if(!email)
    {
      toast.warn("Please Enter Your E-Mail!");
      return;
    }

    if (!validateEmail(email)) {
      toast.warn("Please Enter A Valid E-Mail!");
      return;
    }

    console.log({email});

    try
    {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/otp/send-otp`, {
        email: fpinfo.email,
      });

      const {message, error} = response.data
      

      if(message)
      {
        toast.success("OTP Sent On Your E-Mail ID");
        setFpinfo({email: ''});
        navigate('/otp-verification', {state: {email}});
      }
      else if(error)
      {
        toast.error(error);
      }
      else
      {
        toast.error("No Response From The Server!");
      }
    }
    catch (err)
    {
      if(err.response)
      {
        const errorMsg = err.response.data.error || "An Error Occured While Submitting The E-Mail!";
        toast.error(errorMsg);
      }
      else
      {
        toast.error("No Response From The Server!");
      }
      console.error(err);
    }
  };


  const handleInputChange = (e) =>
  {
    setFpinfo({ ...fpinfo, email: e.target.value });
  };

  return (
    <div
    id='main'
    className='w-screen h-screen lg:flex bg-[#F5F5F5] overflow-hidden'>

      <div 
      id="first"
      className='lg:w-[45%] lg:h-screen lg:rounded-tr-[25px] lg:rounded-br-[25px] lg:flex relative w-screen h-screen'
      style={{ background: 'linear-gradient(180deg, rgba(79, 199, 177, 0.78) 12.51%, rgba(112, 255, 229, 0.78) 98.55%)' }}>

      <img 
        className='lg:absolute lg:-rotate-90 lg:-top-10 lg:left-0 w-[280px] h-[282px] -rotate-90  lg:w-[70%] lg:h-[80%]'
        src="/front.png" alt="" /> 

        <div 
        id="forgetPassword"
        className='lg:w-[60%] lg:h-[60%] lg:m-auto z-10 flex flex-col items-center lg:relative absolute lg:inset-0 inset-20'>
        
          <h1 className='lg:w-[294px] lg:h-[49px] font-lato lg:text-3xl font-semibold lg:mb-5 w-[140px] h-[18px] text-base mb-7 flex justify-center'>
            Forgot Password?
          </h1>

          <h5 className='lg:w-[363px] lg:h-[55px] font-normal lg:text-base font-lato lg:mb-16 w-[295px] h-[39px] text-[10px] text-center lg:text-left mb-8'>
          Don’t worry! It happens. Please enter the phone number we will send the OTP in this phone number.
          </h5>

        <form 
        className='lg:w-[100%]'
        onSubmit={handleSubmit}>


            <h5 className='lg:w-[126px] lg:h-[22px] font-lato font-normal lg:text-base mb-1 w-[120px] h-[13px] text-[10px]'>Enter The E-Mail ID: </h5>

            <input 
            type="email" 
            placeholder='Enter The E-Mail ID' className='lg:w-[100%] lg:h-[25%] font-lato lg:text-[15px] placeholder-gray-500 placeholder-opacity-100 lg:mb-28 rounded-[8px] outline-none p-1 w-[305px] h-[47px] text-[9px] mb-10'
            value={fpinfo.email}
            onChange={handleInputChange}/>

            <button
            className='bg-custom-gradient lg:w-[70%] lg:h-[20%] font-lato text-white font-bold lg:text-xl lg:mx-11 border border-white rounded-[10px] flex justify-center items-center w-[170px] h-[50px] text-xs mx-auto hover:bg-[linear-gradient(90deg,_#1A3FB7_0%,_#75E6D4_100%)]' 
            type='submit'>Continue</button>
        
        </form>

        </div>

        <img 
        className='w-[352px] h-[329px] md:w-[452px] md:h-[429px]  lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 z-20'
        src="./dod.png" alt="" />

        <img 
        className='absolute bottom-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 md:left-1/2 md:transform md:-translate-x-1/2 lg:w-[80%] lg:h-[70%]'
        src="./Plants.png" alt="" />

      </div>

      <div 
      id="second"
      className='lg:flex-grow lg:relative hidden md:block'>

        <img 
        className='lg:w-[70%] lg:h-[80%] lg:absolute lg:bottom-2 lg:right-8'
        src="./dod.png" alt="" />

      </div>

    </div>
  )
}

export default ForgetPassword