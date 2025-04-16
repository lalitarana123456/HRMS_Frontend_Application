import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (

    <div
      id="main"
      className="w-screen h-screen flex flex-col sm:flex-row sm:bg-none bg-gradient-to-b from-[#4FC7B1] via-[#4FC7B1] to-[#70FFE5] sm:bg-[#F5F5F5]">

      <div
        id="first"
        className='sm:flex-1 flex sm:justify-center items-center p-4 sm:relative flex-col gap-20 sm:bg-[#F5F5F5]'>

        <div
          id="logo"
          className='flex items-center justify-center sm:w-[205px] sm:h-[49px] sm:gap-2 sm:absolute sm:top-[36px] sm:left-[32px] w-[189px] h-[49px]'>

          <img
            src="./logo.png"
            alt="Logo"
            className="md:w-[50px] md:h-[50px] sm:w-[48px] sm:h-[48px] w-[42px] h-[43px]" />

          <p
            className='md:text-[31.57px] sm:font-bold sm:text-[#063057] font-lato sm:text-2xl text-xl'>My HRMS</p>

        </div>

        <img
          className=' md:w-[520px] md:h-[538px] sm:w-[420px] sm:h-[438px] w-[298px] h-[306px] sm:mt-[161px] sm:absolute sm:bottom-0'
          src="./dodos.png"
          alt="Dodos" />

      </div>

      <div
        id="second"
        className="md:w-[45%]  sm:h-[100%] sm:rounded-tl-[25px] sm:rounded-bl-[25px] sm:bg-gradient-to-b from-[#4FC7B1] via-[#4FC7B1] to-[#70FFE5] relative flex items-center justify-center p-4 my-auto sm:mt-0 overflow-y-hidden">

        <div
          id="welcome"
          className='sm:w-[372px] sm:h-[325px] z-10 flex flex-col m-auto '>

          <div
            className='w-full sm:mb-4 mb-2  sm:pl-8 md:pl-0 pl-0'>

            <p
              className='font-lato md:text-5xl sm:text-4xl text-2xl text-[#063057] font-bold w-[108px] h-[29px] md:w-[372px] sm:w-[330px] sm:h-[40px] md:h-[60px]'>Welcome!</p>

          </div>

          <div
            className='w-full sm:mb-4 mb-9 sm:pl-8 md:pl-0 pl-0'>

            <p
              className='font-lato text-[#5F7080] sm:text-xl sm:w-[320px] sm:h-[100px] md:text-2xl font-normal text-base md:w-[372px] md:h-[132px] w-[307px] h-[66px]'>
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>

          </div>

          <Link
            to={"/Login"}
            className='md:w-[349px] sm:w-[300px] sm:h-[50px] md:h-[59px] bg-white sm:mt-10 md:mt-16 sm:rounded-[8px] md:rounded-[10px] hover:bg-blue-500 bg-custom-gradient md:text-xl sm:text-lg font-bold text-[#063057] hover:text-white flex items-center justify-center  md:py-4 w-[297px] h-[54px] rounded-[29.5px] mx-auto sm:shadow-none shadow-lg'>
            Get Started
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Welcome;

