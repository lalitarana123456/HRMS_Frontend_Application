
import React, { useEffect, useState } from 'react'
import EmployerSidebar from '../Employer-Sidebar/EmployerSidebar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const EmployerEdit = () => {
  const[companyDetail,setCompanyDetail]=useState([])
  const token = localStorage.getItem("token");
 
 
 
 
 
 
 
 
  const fetch= async()=>{
 
 if(token){
  try{

const res=await axios.get("http://localhost:5000/api/v1/companyProfile",
{
headers: {
  Authorization: `Bearer ${token}`,
},
})

console.log(res.data?.existingCompanyAdmin);
 setCompanyDetail(res.data?.existingCompanyAdmin);


  }

  catch{}
}
 }
 
 useEffect(()=>{
fetch();
 },[])
 
 const navigate=useNavigate();


  return (
    <div className='w-screen h-screen flex bg-[#D5EAE7] '>
    <EmployerSidebar/>
<div className='w-full  overflow-x-auto'>
   <div className='m-10'>
   
    <div className='flex justify-between   items-center'>
        {/* profile */}
        <p className='font-lato font-bold text-[40px] leading-[48px]'>Profile</p>
        <div className='  flex justify-center items-center w-24 h-8  border rounded-xl border-[#A29F9F] '>

        <button
  
  onClick={()=>navigate("/employerProfile")}
  className="flex items-center gap-2 font-lato font-extrabold text-sm"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    className="text-current"
  >
    <path
      fill="currentColor"
      d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z"
    />
  </svg>
 Edit
</button>

          
        </div>
    </div>
    <div className='bg-[#FFFFFF] rounded-3xl h-80 w-full mt-5 gap-10  p-10 flex justify-between '>
        {/* logo */}
        <div className='flex justify-between gap-10'>
<div className='w-52 h-72'>
  {/* img */}
<img 
 src={companyDetail.logo}
 className='w-56 h-52'
/>
</div>
<div className='flex flex-col gap-5'>
{/* nane */}
<div>
  <p className='font-lato font-bold text-3xl text-[#002446]'>{companyDetail.Name}</p>
  <p className='font-lato font-medium text-[20px] text-[#707070]'>{companyDetail.industryType}</p>

</div>
<div>
  <p className='font-lato font-medium text-[20px] text-[#707070]'>Owner name </p>
  <p className='font-lato font-medium text-[20px] text-[#000000]'>{companyDetail.ownerName}</p>

</div>
<div>
  <p className='font-lato font-medium text-[20px] text-[#707070]'>Established on </p>
  <p className='font-lato font-medium text-[20px] text-[#000000]'>{companyDetail.establishedOn} </p>

</div>
</div>


        </div>

        <div>
  {/* adr */}
  <div>
  <p className='font-lato font-medium text-[20px] text-[#707070]'>Address Details</p>
  <p className='font-lato p-2 font-medium text-[20px] text-[#000000] border border-[#DADADA] rounded-xl h-44 w-80'>{companyDetail.address}</p>

</div>
</div>

    </div>
    <div className='bg-[#FFFFFF] rounded-3xl h-96 w-full mt-5 gap-10  p-10 flex flex-col '>
        {/* contact */}
        <div>
          {/* information */}
          <p className='font-lato font-bold text-3xl text-[#002446]'>Contact Information</p>
        </div>
        <div className='flex justify-between w-4/5 '>
          {/* email */}
          <div className=''>
<p className='font-lato font-normal text-[20px] leading-6 text-[#606060]'>
Domain e-mail address </p>
<p className='font-lato font-normal text-[20px] leading-6 text-[#06193F]'>
{companyDetail.domainEmail} </p>
          </div>
          <div className=''>
<p className='font-lato font-normal text-[20px] leading-6 text-[#606060]'>
Personal Email address </p>
<p className='font-lato font-normal text-[20px] leading-6 text-[#06193F]'>
{companyDetail.personalEmail} </p>
          </div>
          <div className=''>
<p className='font-lato font-normal text-[20px] leading-6 text-[#606060]'>
Phone </p>
<p className='font-lato font-normal text-[20px] leading-6 text-[#06193F]'>
{companyDetail.phoneNumber} </p>
          </div>
        </div>

        <div className=' flex flex-col gap-2'>
<p className='font-lato font-medium text-[20px] leading-6 text-[#606060]'>
Description (optional) </p>
<p className='font-lato font-normal text-[20px] p-2 leading-6 text-[#A6A6A6] border border-[#DADADA] h-24 rounded-xl '>
 {companyDetail.description}
 </p>

        </div> 
    </div>
</div>
    </div>
    </div>
  )
}

export default EmployerEdit