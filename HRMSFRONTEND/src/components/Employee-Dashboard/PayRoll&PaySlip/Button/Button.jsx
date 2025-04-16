import React from 'react'

const Button = () => {
  return (
    <>
    <div className='md:gap-4 gap-2 flex'>
        <button className=' shadow-xl w-20 h-5  md:w-32 md:h-11 rounded-2xl border bg-[#F0FFFC] text-[10px] md:text-sm text-center font-extrabold'>
            Export
          </button>
          <button className=' shadow-xl w-20 h-5  md:w-32 md:h-11 rounded-2xl border text-[10px] bg-custom-gradient text-[#FFFFFF] md:text-sm text-center font-extrabold'>
            Pay Slips
          </button>
          </div>
    </>
  )
}
//
export default Button


export const Apply=({backGround,name,text,border,onClick})=>{

return(
  <div className='w-full h-10 flex justify-center items-center'>
    <button

    onClick={onClick}
    
     className={`w-[50%] md:w-full h-10 py-2 rounded-lg font-lato text-[16px] font-medium leading-[19.36px] ${border} ${text} ${backGround}`}>{name}</button>
  </div>
)

}