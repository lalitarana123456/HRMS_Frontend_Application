import React  from "react";
import { RiArrowUpDownLine } from "react-icons/ri";
export const Duration = () => {
 
 
    return (
    <div className="w-32 flex flex-col gap-2 h-28 bg-[#FFFFFF] rounded-lg shadow-md p-2 absolute left-0">
      <div className="flex gap-2 items-center p-2 border-b-2 justify-center ">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 17v-6" />
            <circle cx="1" cy="1" r="1" fill="currentColor" transform="matrix(1 0 0 -1 11 9)" />
          </g>
        </svg>
        <p className="font-lato font-bold text-sm text-black">Duration</p>
      
      </div>
      <div className="flex flex-col items-center justify-center gap-2" >
      <p className="text-red-500 text-sm">• <span className="font-lato font-medium text-[#979797] text-[12px]">Leave</span></p>
      <p className="text-green-500 text-sm">• <span className="font-lato font-medium text-[#979797] text-[12px]">Half Day</span></p>
      </div>
    </div>
  );
};




export const Sorting = () => {
 
 
  return (
  <div className="w-32 flex flex-col gap-2 h-28 bg-[#FFFFFF] rounded-lg shadow-md p-2 absolute left-0">
    <div className="flex gap-2 items-center p-2 border-b-2 justify-center ">
    <button

                className='w-[50%]  h-[80%] md:h-full m-auto'>
                <RiArrowUpDownLine className='md:text-[30px] mx-auto' />
              </button>
      <p className="font-lato font-bold text-sm text-black">Sorting</p>
    
    </div>
    <div className="flex flex-col items-center justify-center gap-2" >
    <p className="text-green-500 text-sm">• <span className="font-lato font-medium text-[#979797] text-[12px]">Alphabetical sort</span></p>
     </div>
  </div>
);
};


//export default Duration;
