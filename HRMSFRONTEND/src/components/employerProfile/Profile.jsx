import React, { useState,useEffect,useRef } from 'react'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import EmployerSidebar from '../Employer-Sidebar/EmployerSidebar';
import { useNavigate } from 'react-router-dom';
import { Calendar, Phone } from 'lucide-react';
import DatePicker from 'react-datepicker';

const Profile = () => {
    // const [selectedOption, setSelectedOption] = useState("Industry type");
    const [isOpen, setIsOpen] = useState(false);
    // const[companyDetail,setCompanyDetail]=useState([])
    const [dataFetched, setDataFetched] = useState(false);
    const options = ['account', 'software', 'social media'];
const[formData,setFormData]=useState({
    // companyName: "",
    date: "",
    ownerName: "",
    domainEmail: "",
    personalEmail: "",
    industryType: "Industry type",
    address: "",
    description: "",
    uploadedFile: "",
    
    phoneNumber:""
})
    const handleOptionSelect = (option) => {
        setFormData({ ...formData, industryType: option });
        console.log(option);
        // setSelectedOption(option);
        setIsOpen(false);
      };
      const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
      };

   

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 0) {
    setFormData({ ...formData, uploadedFile: files });
  }
};

const [selectedDate, setSelectedDate] = useState(null);
const handleDateChange = (date) => {
  setSelectedDate(date);
  setFormData({ ...formData, date: date.toISOString().split('T')[0] });

}




const handleChange=(e)=>{
const {name,value}=e.target;
setFormData({...formData,[name]:value});
};


const handleSubmit= async(e)=>{
    e.preventDefault();
    // console.log(formData);
    console.log("Submitting form data:", formData);
    const token = localStorage.getItem('token');


const formDataPayload = new FormData();
// formDataPayload.append('companyName', formData.companyName);
formDataPayload.append('ownerName', formData.ownerName);
formDataPayload.append('domainEmail', formData.domainEmail);
formDataPayload.append('personalEmail', formData.personalEmail);
formDataPayload.append('industryType', formData.industryType);
formDataPayload.append('address', formData.address);
formDataPayload.append('description', formData.description);
formDataPayload.append('establishedOn', formData.date);
formDataPayload.append('phoneNumber', formData.phoneNumber);


if (formData.uploadedFile && formData.uploadedFile.length > 0) {
  formData.uploadedFile.forEach(file => {
    formDataPayload.append("logo", file);
  });
}

console.log(formData);

    try {
        
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/companyProfile/reg`, 
         // payload,
         formDataPayload ,
        
          {
            headers: {
              Authorization: `Bearer ${token}`, 
              'Content-Type': 'multipart/form-data',
            },

          });
        console.log("Data successfully posted:", response.data);
        toast.success("Data successfully posted:");
        console.log("Data successfully posted:", formData);
        // Reset form fields after successful post
        setFormData({
          companyName: "",
          ownerName: "",
          domainEmail: "",
          personalEmail: "",
          industryType: "Industry type",
          address: "",
          description: "",
          uploadedFile: "",
        });
        navigate('/employerEditProfile');
      } catch (error) {
        console.error("Error posting data:", error.response?.data || error.message);
        if (error.response?.data?.error) {
          toast.error(`Error: ${error.response.data.error}`);
        } else {
          toast.error(`Failed to submit data: ${error.response?.data?.message }`);
        }    
        }
    };


    const fetch= async()=>{
      const token = localStorage.getItem('token');

      if(token){
       try{
     
     const res=await axios.get("http://localhost:5000/api/v1/companyProfile",
     {
     headers: {
       Authorization: `Bearer ${token}`,
     },
     })
     
     const companyData = res.data?.existingCompanyAdmin || {};
    
    
     setFormData((prev) => ({
      ...prev,
      ...companyData,
      date: companyData.establishedOn ? new Date(companyData.establishedOn).toISOString().split("T")[0] : "",
    }));

    setSelectedDate(companyData.establishedOn ? new Date(companyData.establishedOn) : null);
    
    
         setDataFetched(true);
          console.log(res.data?.existingCompanyAdmin);
     
     
       }
     
       catch{}
     }
      }
      
      useEffect(()=>{
     fetch();
      },[])

      const [open, setOpen] = useState(false);
      const datePickerRef = useRef(null);
      const toggleDatePicker = () => {
        setOpen((prevOpen) => !prevOpen); // Toggle the open state
      };

const navigate=useNavigate();
    return (
    <div className='flex bg-[#D5EAE7] w-screen h-screen'>
      <EmployerSidebar/>
    <div className='w-[100%] h-screen overflow-y-auto   '>
  
    <p className='font-lato font-bold md:text-[40px] md:text-left text-center pt-1  p-10 leading-[48px]'>Profile</p>
    <form onSubmit={handleSubmit}>
<div className='bg-white w-[90%] flex-shrink -mt-10 md:w-[90%] h-[100%] md:m-10 m-auto md:p-16 rounded-3xl md:flex md:flex-col gap-2 '>
<div className='  m-4  w-[100%]  justify-between flex flex-col-reverse md:flex-row  '>
<div className='md:flex justify-between mt-4 md:mt-0 md:w-4/6  '>
{/* input box */}
  <div className='flex flex-col md:w-[100%]   md:p-0 gap-2  '>
    <label className='font-lato font-normal  text-[16px] leading-[19.2px] '>Name of the Company<span className='text-red-500 font-lato font-normal text-[16px] leading-[19.2px]'>*</span></label>
 <input type='text'
    className='w-[90%] h-[48px] bg-[#FFFFFF] border border-[#DADADA] rounded-md shadow-sm pl-2 font-lato font-normal text-[16px] leading-[19.2px] outline-none'
 placeholder='Los Pollos Hermanos'
 required
 name="companyName"
 onChange={handleChange}
 value={formData.Name}
 
 />
 {/* <p className='w-[90%] h-[48px] bg-[#FFFFFF] border p-2 border-[#DADADA] rounded-md shadow-sm  font-lato font-normal text-[16px] leading-[19.2px] '>{companyDetail?.Name}</p> */}
 <label className='font-lato font-normal text-[16px] leading-[19.2px] '>Name of the Owner<span className='text-red-500 font-lato font-normal text-[16px] leading-[19.2px]'>*</span></label>
 <input type='text'
    className='w-[90%] h-[48px] bg-[#FFFFFF] border border-[#DADADA] rounded-md shadow-sm pl-2 font-lato font-normal text-[16px] leading-[19.2px] outline-none'
 placeholder='Gustavo'
 required
 onChange={handleChange}
 value={formData.ownerName}
 name='ownerName'
 />
 <label className='font-lato font-normal text-[16px] leading-[19.2px] '>Domain e-mail address<span className='text-red-500 font-lato font-normal text-[16px] leading-[19.2px]'>*</span></label>
 <input type='text'
    className='w-[90%] h-[48px] bg-[#FFFFFF] border border-[#DADADA] rounded-md shadow-sm pl-2 font-lato font-normal text-[16px] leading-[19.2px] outline-none'
 placeholder='company@email.ac.co'
 required
 value={formData.domainEmail}
 onChange={handleChange}
 name='domainEmail'
 />
 <label className='font-lato font-normal text-[16px] leading-[19.2px] '>Personal mail address<span className='text-[#9A9A9A] font-lato font-normal text-[16px] leading-[19.2px]'>(optional)</span></label>
 <input type='text'
    className='w-[90%] h-[48px] bg-[#FFFFFF] border border-[#DADADA] rounded-md shadow-sm pl-2 font-lato font-normal text-[16px] leading-[19.2px] outline-none'
 placeholder='name@email.com'
 value={formData.personalEmail}
 onChange={handleChange}
 name='personalEmail'
 />

{dataFetched && (
  <>
 <label className='font-lato font-normal text-[16px] leading-[19.2px] '>Established on</label>


 <div 
                 
                  className="flex items-center relative w-[90%] bg-white border border-gray-300 rounded-md px-1 ">

                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="dd-mm-yyyy"
                      className="h-12 w-[90%]   text-black focus:outline-none"
                      showPopperArrow={false}
                      ref={datePickerRef}
                      open={open}
                      
                      />

                      <Calendar
                      className="absolute right-1  text-gray-600 cursor-pointer"
                     // onClick={() => document.querySelector(".react-datepicker-ignore-onclickoutside").focus()}/>
                     onClick={toggleDatePicker}  // Open the date picker on icon click
      />
                  </div>
  <label className='font-lato font-normal text-[16px] leading-[19.2px] '>Phone</label>
 <input type='text'
    className='w-[90%] h-[48px] bg-[#FFFFFF] border border-[#DADADA] rounded-md shadow-sm pl-2 font-lato font-normal text-[16px] leading-[19.2px] outline-none'
 placeholder='Phone'
 value={formData.phoneNumber}
 onChange={handleChange}
 name='phoneNumber'
/>
</>
)}
  </div>
  {/* industry type */}
 <div className='md:mt-4 mt-2 pr-4 w-[100%]'>
  <div className=" h-12  rounded-lg  w-[95%] flex justify-between   ">
          <div className="relative w-[100%] h-11  flex justify-between bg-[#FCFCFC] border border-[#DADADA] rounded-md   "
          required>
           <input
      type="text"
      value={formData.industryType === "Industry type" ? "" : formData.industryType}
      required
      readOnly

      className="opacity-0 absolute"
    />
            {/* Selected Button */}
            <div
              onClick={handleDropdownToggle}
              className="font-lato w-[100%] h-10 rounded-md  px-1 flex justify-between items-center cursor-pointer bg-white  "
              required  >
              <span 
              className={`pl-4 font-lato font-normal  text-[20px] leading-[24px] ${formData.industryType==="Industry type"?"text-[#9C9C9C]":"text-black"}`}> 
              {formData.industryType}
              { formData.industryType === "Industry type" &&(
              <span className='text-red-500 font-lato font-normal text-[20px] leading-[24px]'>*</span>
              )}
              </span>
              <span
                className={`transform transition-transform   ${isOpen ? "rotate-180" : ""
                  }`}
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"/></svg>
              </span>
            </div>

            {/* Dropdown Options */}
            {isOpen && (
              <div className="absolute top-full left-0 w-full  bg-white drop-shadow-xl rounded-xl mt-2 z-10 space-y-2 p-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={"font-lato w-full pl-4 h-[50px] flex items-center  cursor-pointer rounded-lg transition-colors" }
                    >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>

{/* adr */}
   <div className='flex flex-col gap-4  w-[100%] h-[249px]  md:p-2  '> 
   <label className='font-lato font-normal w-[90%] text-[16px] mt-2 leading-[19.2px]  '>Address Details<span className='text-red-500 font-lato font-normal text-[16px] leading-[19.2px]'>*</span></label>
  
  <textarea 
  className='w-[95%] h-[174px]  font-lato font-normal text-[16px] leading-[19.2px] p-2 text-[#575757] outline-none border border-[#DADADA] rounded-xl' 
    placeholder='125-2mf , kulayadi mone Duplicate Indian, Kerla , kutty'
    onChange={handleChange}
    value={formData.address}
    name='address'
  required />
   {/* adr */}
  

  
   {/* <div className='w-[260px] h-[127px] -ml-2  border-t border-[#898989] '> */}

   </div>
   {/* </div> */}
   


</div>

</div>
  <div>
    <div className='md:w-[251px] mt-4 md:mt-0 w-[35%] h-[160px] m-auto rounded-md md:h-[279px] bg-[#F9FAFB] border-2 border-dashed  border-[#969696] flex justify-center'>
   <div className='flex flex-col justify-center items-center m-auto'>  
   <input 
    type='file' 
    id='fileInput' 
    // className='hidden' 
    className="absolute  opacity-0 cursor-pointer" // Invisible but focusable
     
    onChange={handleFileChange}
   name="logo"
  />

  {/* SVG as a clickable label */}
  <label htmlFor='fileInput'  className='cursor-pointer '>
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24">
      <path fill="currentColor" d="M11.5 19h-5q-1.871 0-3.185-1.306Q2 16.39 2 14.517q0-1.719 1.175-3.051t2.921-1.431q.337-2.185 2.01-3.61T12 5q2.502 0 4.251 1.749T18 11v1h.616q1.436.046 2.41 1.055T22 15.5q0 1.471-1.014 2.486Q19.97 19 18.5 19h-6v-7.42l2.1 2.09l.708-.69L12 9.674l-3.308 3.308l.708.688l2.1-2.088z"/>
    </svg>
  </label>
   <p className='md:w-[170px] w-[90%] text-wrap md:h-7 text-center font-lato font-medium text-[8px] md:text-[12px] md:leading-[14.4px] leading-[9.4px] text-[#6B6B6B] break-words whitespace-normal '>Click to upload or drag and drop ( PDF , DOCX , PNG , JPG ) <span className='text-red-500 font-lato font-normal text-[16px] leading-[19.2px]'>*</span></p>
   {formData.uploadedFile && formData.uploadedFile.length > 0 && (
  <div className='md:w-[240px]'>
    {formData.uploadedFile.map((file, index) => (
      <p key={index} className='text-green-500 md:mt-2   text-center'>
         {file.name}
      </p>
    ))}
  </div>
)}
  
  
   </div>
   

   
    </div>

    <p className='font-lato text-[#838383] md:mt-2 mt-1 font-normal md:text-[16px] text-[10px] leading-3 text-center md:leading-[19.2px] '>Upload your company logo
    <span className='text-red-500 font-lato font-normal text-[16px] leading-[19.2px]'>*</span>
    </p>
  </div>
 
  </div>
 <div className=''>
  <label className='font-lato p-4 md:p-0 font-medium text-[16px] leading-[19.2px]'>Description<span className='text-[#9A9A9A] font-lato font-medium text-[16px] leading-[19.2px]'>(optional)</span></label>
  
 <textarea type='text'
    className=' md:w-[100%] w-[90%]  h-[211px] m-4 md:m-0 bg-[#FFFFFF] border border-[#DADADA] text-left rounded-md shadow-sm pl-2 font-lato font-normal text-[16px] leading-[19.2px] outline-none'
 placeholder='About the company policies and agenda , drop it here'
    onChange={handleChange}
    value={formData.description}
    name='description'
 />
 </div>
 <div className='flex gap-4 lg:justify-end justify-center p-4 mt-5 lg:mt-0'>

<button 
onClick={()=>navigate("/Main_Employer_Component")}
 type="button" className='lg:w-40 font-lato lg:h-12 w-[50%] h-10  font-semibold text-[16px] leading-[19.2px] bg-[#F2F2F2] border border-[#BDBDBD] rounded-xl'>Back</button>
<button
type='submit'
 className='lg:w-44 lg:h-12 font-extrabold text-[16px] w-[50%] h-10 leading-[19.2px] text-[#FFFFFF] bg-[#000000] border border-[#898989] rounded-xl'>Save & Continue</button>

 </div>

 
  </div>
 
  </form>

    </div>
    </div>
   
  )
}

export default Profile