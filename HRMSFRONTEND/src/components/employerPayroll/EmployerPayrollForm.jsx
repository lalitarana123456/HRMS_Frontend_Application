import React, { useEffect, useState, useRef } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react"; // Icon library: lucide-react
import axios from 'axios';
import { useParams } from 'react-router-dom';
import EmployerSidebar from '../Employer-Sidebar/EmployerSidebar';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployerPayrollForm = () => {
 
 
    const [isOpen, setIsOpen] = useState(false);


    const[formData,setFormData]=useState({
        date: "",
    leaveType:  "Industry type",
    status: "",
    description: "",
    uploadedFile:"",

        // uploadedFile: "",
    })
    const [employeeData, setEmployeeData] = useState({});
      const [isLoading, setIsLoading] = useState(false);
      
    const options = ['Leave', 'Medical Leave', 'Half Day', 'Holiday', 'Full Day'];
   
    // const handleFileChange=(e)=>{
    //     const file=e.target.files;
    //     if(file){
    //         setFormData({ ...formData, uploadedFile:Array.from(file) });
    //       //  setUpload(file.name);
    //         // console.log('')
    //         console.log('File uploaded:', file); // You can handle file upload here
      
    //     }
    // }
   
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        setFormData({ ...formData, uploadedFile: files });
      }
    };
    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
      };

      const handleOptionSelect = (option) => {
        setFormData({ ...formData, leaveType: option });

        setIsOpen(false);
      };

      const [selectedDate, setSelectedDate] = useState(null);

      const handleDateChange = (date) => {
        setSelectedDate(date);
        setFormData({ ...formData, date: date.toLocaleDateString('en-CA').split('T')[0] });

      }

      // const handleChange = (e) => {
      //   const { name, value } = e.target;
      //   setFormData({ ...formData, [name]: value });
      // };
      const { id } = useParams();
      console.log(id);

      const getApiData = async () => {

        const token = localStorage.getItem('token');
    
    
        if (token) {
          if (token) {
            setIsLoading(true);
         
          try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/admin/${id}`,
    
            
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Token ko header me add karo
    
                },
    
              });
            console.log("msg" + token);
            console.log(res.data);
          
             setEmployeeData(res.data)
           
            // console.log("Payroll State:", payroll);
         
           

          } catch (error) {
            console.error("Error fetching API:", error);
          }finally {
            setIsLoading(false); // Stop loading
          }
        } else {
          console.log("Token not found in local storage");
        }
      }
      };
    
    
      useEffect(() => {
        getApiData();
      }, [])
    
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form data:", formData);
        const token = localStorage.getItem('token');

      

        const formDataObj = new FormData();

// Append regular form data
formDataObj.append("payType", formData.leaveType);
formDataObj.append("status", formData.status);
formDataObj.append("payrollRuns", formData.date);
formDataObj.append("description", formData.description);

// if (formData.uploadedFile) {
//   formDataObj.append("document", formData.uploadedFile); 
// }     
if (formData.uploadedFile && formData.uploadedFile.length > 0) {
  formData.uploadedFile.forEach(file => {
    formDataObj.append("documents", file);
  });
}
// Example API call to a fake backend
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/administrative/payroll/create-payroll/${id}`, // Fake API endpoint
            formDataObj,
          

          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },

          });
          console.log("Data successfully posted:", response.data);
          console.log("Data successfully posted:", formData);
        
        toast.success("Data successfully posted");
        setFormData({
            date: "",
            leaveType: "",
            status: "",
            description: "",
         

        });
        
      }  catch (error) {
          console.error("Error submitting form data:", error);
        }
      };
      const [open, setOpen] = useState(false);
      const datePickerRef = useRef(null);
      const toggleDatePicker = () => {
        setOpen((prevOpen) => !prevOpen); // Toggle the open state
      };

      const handleCancel=()=>{
         setFormData({
            date: "",
            leaveType: "",
            status: "",
            description: "",
         

        });
       
      }
    return (
<div className='flex w-screen h-screen bg-[#D5EAE7]'>
{/* <EmployerSidebar/> */}
    <div 
    className=' w-screen  h-screen pt-10 md:pt-0 flex items-center justify-center overflow-y-auto'>
    <EmployerSidebar/>
      <form 
      onSubmit={handleSubmit} 
      className=' w-[90%] lg:p-10 p-5 m-5 mt-10 rounded-[20px] bg-[#FFFFFF]'>
    
        <div className='flex justify-between lg:w-full lg:flex-row flex-col items-center'>

        {/* box1 */}
        <div className='w-full'>
        
          {/* emp name */}
          <div>
            <p className='font-lato font-medium lg:text-xl text-base lg:mb-3'>Employee Name</p>

            <div 
            className="flex items-center">

              <img
              src={employeeData.profilePhoto}
              alt=""
              className="w-[40px] h-[40px] rounded-full border  border-black m-2"/>

              <div>

                <span 
                className="px-2 py-1 font-lato text-sm lg:text-lg leading-[19.2px] font-normal text-[#838383]">
                  {employeeData?.firstName + " "+ employeeData?.lastName}
                </span>

                <span 
                className="font-lato text-[10px] leading-[8px] md:text-base md:leading-[19.2px] font-normal text-[#838383]">
                  {employeeData.designation}
                </span>
              
                <p 
                className='font-lato px-2 text-sm lg:text-base leading-[19.2px] font-normal text-[#9C9C9C]'>
                  Emp ID : {employeeData?.employeeId}
                </p>

              </div>

            </div>

            </div>
            
            {/* date */}
              
              <div className='py-5 flex flex-col'>
                
                <p className='font-lato relative font-medium lg:text-xl lg:mb-3'>Date</p>
                  
                  <div 
                  className="flex items-center relative lg:w-[70%] w-full bg-white border border-gray-300 rounded-md px-1 drop-shadow-lg">

                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="dd-mm-yyyy"
                      className="h-8 w-72 bg-transparent text-black focus:outline-none"
                      showPopperArrow={false}
                      ref={datePickerRef}
                      open={open}
                      />

                      <Calendar
                      className="absolute right-1 text-gray-600 cursor-pointer"
                     // onClick={() => document.querySelector(".react-datepicker-ignore-onclickoutside").focus()}/>
                     onClick={toggleDatePicker}  // Open the date picker on icon click
      />
                  </div>
                
                </div>

              </div>

              <div className='w-full lg:px-4'>

                  {/* leave type */}
                  <div>
                    
                    <p 
                    className='font-lato font-medium lg:text-xl text-md lg:mb-3'>
                      Leave Type
                    </p>

                      <div 
                      className=" h-12 rounded-lg w-[100%] flex justify-between">
          
                        <div 
                        className="relative w-[100%] lg:w-[80%] lg:h-8 h-8 flex justify-between bg-[#FCFCFC] border border-[#DADADA] rounded-md"
                        required>

                          <input
                          type="text"
                          value={formData.leaveType||""}
                          required
                          readOnly
                          className="opacity-0 absolute"/>
            
                            {/* Selected Button */}
                            <div
                              onClick={handleDropdownToggle}
                              className="font-lato w-[100%] h-7 lg:h-7 rounded-md  px-1 flex justify-between items-center cursor-pointer bg-white  "
                              required  >
                              
                              <span 
                              className={`pl-4 font-lato font-normal  lg:text-[18px] text-sm leading-[24px] ${!formData.leaveType ? "text-[#9C9C9C]" : "text-black"}`}> 
                                {formData.leaveType || "Select Leave Type"}
                              </span>

                              <span
                              className={`transform transition-transform   ${isOpen ? "rotate-180" : ""}`}>
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
                                    className={"font-lato w-full pl-4 lg:h-[40px] border-b flex items-center cursor-pointer rounded-lg transition-colors" }
                                    >
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
          </div>
          
        </div>
        </div>

        {/* status */}
        <div className='lg:py-6'>
        <p className='font-lato font-medium lg:text-xl lg:mb-3'>Status</p> 
        <div className='flex gap-10 items-center'>
       <div className='flex gap-2'>
       <input type='radio' className=''
name='status' value='Paid' onChange={(e) => setFormData({ ...formData, status: e.target.value })}

       />
        <span className='font-lato font-medium lg:text-base text-xs leading-[19.2px]'>Paid</span>
        

       </div>
       <div className='flex gap-2'>

        <input type='radio'
name='status' value='Unpaid' onChange={(e) => setFormData({ ...formData, status: e.target.value })}

        />
        <span className='font-lato font-medium lg:text-base text-xs leading-[19.2px]'>Unpaid</span>
       
        </div>
        <div className='flex gap-2'>
        <input type='radio'
name='status' value='Half Paid' onChange={(e) => setFormData({ ...formData, status: e.target.value })}

        />
        <span className='font-lato font-medium lg:text-base text-xs leading-[19.2px]'>Half paid </span>
       
        </div>
       
        </div>
        </div>
</div>

    </div>
    {/* descriptin */}
    <div className='w-full flex flex-col  gap-2 lg:mt-0 mt-3'>
  <label className='font-lato font-medium lg:text-xl leading-[28.8.2px]'>Description
  </label>
  
 <textarea type='text'
    className='w-full lg:h-28 h-28  md:m-0 bg-[#FFFFFF] border border-[#DADADA] text-left rounded-md shadow-sm pl-2 font-lato font-normal lg:text-[16px] text-xs leading-[19.2px] outline-none resize-none'
 placeholder='About the company policies and agenda , drop it here'
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 value={formData.description}
    name='description'
 />
 </div>
 <div className='w-full flex flex-col lg:gap-4 gap-2 mt-2'>
 <label className='font-lato  font-medium lg:text-xl leading-[28.8.2px]'>Attach Documents</label>
 
    <div className=' bg-[#F9FAFB] border-2 border-dashed lg:w-[40%] w-full rounded-[20px] h-28  border-[#969696] flex justify-center'>
   
   <div className='flex flex-col justify-center items-center lg:m-auto'>  
   <input 
    type='file' 
    id='fileInput' 
    // className='hidden' 
    name="documents"
    multiple
    className="absolute opacity-0 cursor-pointer" // Invisible but focusable
     
     onChange={handleFileChange}
  
  />

  {/* SVG as a clickable label */}
  <label htmlFor='fileInput'  className='cursor-pointer '>
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24">
      <path fill="#6B6B6B" d="M11.5 19h-5q-1.871 0-3.185-1.306Q2 16.39 2 14.517q0-1.719 1.175-3.051t2.921-1.431q.337-2.185 2.01-3.61T12 5q2.502 0 4.251 1.749T18 11v1h.616q1.436.046 2.41 1.055T22 15.5q0 1.471-1.014 2.486Q19.97 19 18.5 19h-6v-7.42l2.1 2.09l.708-.69L12 9.674l-3.308 3.308l.708.688l2.1-2.088z"/>
    </svg>
  </label>
   <p className='md:w-[170px] w-[90%] md:h-7 text-center font-lato font-medium text-[8px] md:text-[12px] md:leading-[14.4px] leading-[9.4px] text-[#6B6B6B]'>Click to upload or drag and drop ( PDF , DOCX , PNG , JPG ) 
   </p>
   {/* {formData.uploadedFile && (
       <div className='w-[240px]'>
        <p className='text-green-500 mt-2 text-center text-'>
          File uploaded: {formData.uploadedFile?.name}
        </p>
        </div>
      )} */}
      {formData.uploadedFile && formData.uploadedFile.length > 0 && (
  <div className='w-[240px]'>
    {formData.uploadedFile.map((file, index) => (
      <p key={index} className='text-green-500 mt-2 text-center'>
        File uploaded: {file.name}
      </p>
    ))}
  </div>
)}
   </div>
   
    </div>

   
  </div>
 {/* button */}

 <div className='flex gap-4 lg:justify-end justify-center mt-5 lg:mt-0'>

<button
onClick={handleCancel}
  type="button" className='lg:w-40 font-lato lg:h-12 w-[50%] h-10  font-semibold text-[16px] leading-[19.2px] bg-[#F2F2F2] border border-[#BDBDBD] rounded-xl'>Cancel</button>
<button
type='submit'
 className='lg:w-44 lg:h-12 font-extrabold text-[16px] w-[50%] h-10 leading-[19.2px] text-[#FFFFFF] bg-[#000000] border border-[#898989] rounded-xl'>Update</button>

 </div>
    </form>
    
    
    
    
    
    </div>
    </div>
  )
}

export default EmployerPayrollForm