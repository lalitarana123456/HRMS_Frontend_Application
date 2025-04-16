import React from 'react'

const AvgWorkingHour = () => {
  return (
    <div 
    id='avg-working-hour'
    className='lg:w-[32%] w-[32%] rounded-md  h-full lg:rounded-[20px] bg-[#BDDBFF] lg:drop-shadow-xl  font-lato lg:pl-3 pl-1 flex flex-col justify-center p-2'>
        <h1
        className='font-semibold lg:text-[16px] text-[11px] text-nowrap'>
          Avg. Working Hours: 
        </h1>
        <p 
        className="lg:text-[20px] text-sm lg:font-bold text-[#176CED]">
          8
        </p>
    </div>
  )
}

export default AvgWorkingHour