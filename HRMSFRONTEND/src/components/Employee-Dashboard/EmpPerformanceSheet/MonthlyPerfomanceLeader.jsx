import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from '../Sidebar/Sidebar';


const MonthlyPerfomanceLeader = () => {

  const [isMonthly, setIsMonthly] = useState(true);


  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select Comment Type");

  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [value, setValue] = useState(0)

  const [errors, setErrors] = useState({}); // To store validation errors


  const options = ["Achievement", "Goal"];

  // Store here emp details which is clicked
  const [employeeData, setEmployeeData] = useState(null);
  const { _id } = useParams();

  console.log("Employee ID in TL Edid:", _id);


  const getBackgroundColor = (option) => {
    switch (option) {
      case "Achievement":
        return "bg-sky-100 hover:bg-sky-300"; 
      case "Goal":
        return "bg-pink-100 hover:bg-pink-300"; 
        default:
        return "bg-gray-100 hover:bg-gray-200"; 
    }
  }

const navigate=useNavigate();

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleComment = (e) => {
    setComment(e.target.value)
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value;


    if (inputValue === "" || (inputValue >= 0 && inputValue <= 100)) {
      setValue(inputValue);
     
    } else {

      setValue(0);
    }
  }

  const validateFields = () => {
    const newErrors = {};

    if (!selectedOption) {
      newErrors.selectedOption = "Please select an option.";
    }
if(!value){
  newErrors.value="please fill the value"
}

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
  
    if (!validateFields()) {
      toast.error("Please fill the all value before submitting.");
      return;  
  }
  
  
    const payload = {
      overallPerformancePercentage: value,
      commentCategory: selectedOption,
      commentText: comment,
      month: selectedMonth,
      //year: selectedYear
    };
    console.log("Payload Data to be sent to the backend:", payload);


    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/performances/monthly/${_id}`,
         payload,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',

          },
        }
      )
      console.log("Response:", response.data);
      console.log(response);

      toast.success("Data submitted successfully!");



      setValue('0');
      setSelectedOption("Select Comment Type");
      setComment('');
      setSelectedMonth("");
      setSelectedYear("");

    }
    catch (error) {
      console.error("Error submitting data:", error.response?.data || error.message);
  
      // Display the backend error message if available
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error(`Failed to submit data: ${error.response?.data?.message || "Unknown error"}`);
      }
  };

  }
  // get data..

  const getApiData = async () => {

    const token = localStorage.getItem('token');


    if (token) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/admin/${_id}`,    

          

        
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token ko header me add karo

            },

          });
        console.log("msg" + token);
        console.log(res.data);
        setEmployeeData(res.data);
    
      } catch (error) {
        console.error("Error fetching API:", error.message);
      }
    } else {
      console.log("Token not found in local storage");
    }
  };


  useEffect(() => {
    getApiData();
  }, [])




  const months = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
  ];

  return (
    <div className='w-full  flex  md:h-screen min-h-screen bg-[#D6EAE7]'>
        <Sidebar/>
    <div className='w-full h-[100%]  md:p-10 p-0   overflow-y-auto  scrollbar-thin scrollbar-thumb-black scrollbar-track-black  '>
      <div className="md:flex items-center  flex-shrink justify-between ">
       
      

       <div className=' p-4 flex-shrink md:flex  md:w-full items-center pt-4 md:pt-0  '>       
        <p className="md:text-[40px] font-bold text-xl text-center   md:block text-[#002446]">Monthly Performance
          {/* <span className='font-lato font-bold text-2xl pl-4 text-[#8B8B8B]'>January 2024</span></p> */}
       
       
          {/* <span className="font-lato font-bold invisible md:visible text-2xl pl-2 text-[#8B8B8B]"> */}
            {/* {selectedMonth} */}
             {/* {selectedYear} */}
          {/* </span> */}
        </p>

        {/* Dropdown for selecting the month */}
        <div className="flex mt-4 md:ml-10 ">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mr-4 px-4 py-2 bg-white cursor-pointer  border rounded-lg w-28 h-9 md:w-40 md:h-full"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

       

        </div>
</div>

<div className='flex items-end justify-end -mt-16 md:-mt-0  p-4 flex-shrink w-full md:w-[20%] '>
        <div className="relative flex  md:flex w-[156px] h-[24px] rounded-full bg-white" style={{ boxShadow: '0px 3px 7.6px 1px #00000040', }}>
            <div className={`absolute w-1/2 h-full bg-[#E2EFED] rounded-full transition-transform duration-300 ${isMonthly ? "translate-x-0" : "translate-x-full"}`}></div>

            <button className={`flex-1 text-xs z-10 font-semibold ${isMonthly ? "text-[#063057] " : "text-[#06193F80]"}`}
              onClick={() => {

                // navigate("/LeaderYear")

                setIsMonthly(true)
              }
              }>
              Monthly
            </button>

            <button className={`flex-1 text-xs z-10 font-semibold ${isMonthly ? "text-[#06193F80]" : "text-[#063057]"}`}
              onClick={() => {
              //  navigate("/Leader")
                navigate(`/LeaderYear/${_id}`);
                setIsMonthly(false)
              }}>
              Yearly
            </button>
          </div>
</div>
     


      </div>

      {/* profile section */}
      <div className='flex justify-between md:items-center  md:p-4 flex-shrink'>
        <div className="md:flex hidden items-center justify-center rounded-lg ">
        {employeeData?(
          <div className="md:m-4 m-2   ">
            <img className=' w-24 h-24 rounded-full' src={employeeData.profilePhoto} alt="Profile" />
          </div>):(
            <p>Loading...</p>
          )
        } 

          {employeeData ? ( 
          <div className=" pt-4   ">
          <h3 className="md:text-[32px]  text-[16px] leading-5 font-lato font-medium text-[#002446]">{employeeData.firstName+""+employeeData.lastName}</h3>
            <p className="text-[#747E94]  md:text-2xl text-[12px] pt-1 leading-[14.4px] font-medium font-lato">{employeeData.designation}</p>
            <p className="text-[#747E94]  text-sm font-medium font-lato">Employee ID
             <span className="text-[#002446] block text-sm font-bold font-lato">{employeeData.employeeId}</span></p>
               </div>):
               ( <p>Loading......</p>  )}  

        </div>

        

      </div>

      {/* overallPerformance */}

      <div className='md:mt-10 flex-shrink rounded-lg mt-4 m-auto md:w-full w-[90%] md:h-[289px] h-[187px]'>

        <div className=' md:h-[289px]  bg-[#FFFFFF]  w-full rounded-lg   shadow-lg'>
          <div className='flex justify-between p-5 md:h-36 h-20   md:pt-10 md:p-5 rounded-lg  shadow-lg'>
            <div className=" md:hidden flex  gap-2 items-center justify-center rounded-lg ">
           {employeeData ?(
            <div className="md:m-4 w-11 md:w-full ">
                <img  className=' w-8 h-8 rounded-full' src={employeeData.profilePhoto} alt="Profile" />
              </div>
           ):(<p>Loading..</p>)}   

{employeeData?(
  <div className="md:pt-4   ">
                <h3 className="md:text-[32px]  text-[16px] leading-5 font-lato font-medium text-[#002446]">{employeeData.firstName+" "+employeeData.lastName}</h3>
                <p className="text-[#747E94]  md:text-2xl text-[12px] leading-[14.4px] font-medium font-lato">{employeeData.designation}</p>
              </div>):
              (<p>Loading...</p>)}
             
            </div>

            <div className='pt-1 md:pt-0 '>
              <p className=" font-lato md:text-3xl text-[16px] leading-5 font-medium ">{value}%</p>
              <p className=" font-lato md:text-2xl text-[12px] leading-[14.4px] font-medium text-[#747E94]">Overall Performance</p>
            </div>









            <div className='md:flex md:w-36 hidden   h-11 bg-[#F6F6F6] rounded-md items-center justify-between border border-[#CCCCCC] ' >
              <input type='text'
                value={value}
                onChange={handleInputChange}
                className='md:w-20  w-10 md:h-5 outline-none m-auto bg-none  bg-[#F6F6F6]'
              />

              {/* <button className='m-auto'>{percentage}</button> */}
              <div className='flex flex-col align-middle  '>
                <button className=' pt-2'
                  onClick={() => setValue((prev) => Math.max((prev || 0) - 1, 0))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m7 15l5-5l5 5z" /></svg>

                </button>

                <button className='pb-2'
                  onClick={() => setValue((prev) => Math.min((prev || 0) + 1, 100))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m7 10l5 5l5-5z" /></svg>

                </button>
              </div>
            </div>
          </div>

          <div className="md:w-full pt-1  h-28 md:h-36 bg-[#F6F6F6]   md:flex md:justify-center md:items-center rounded-b-lg ">
            <div className="relative bg-white w-[90%] m-auto md:h-12 h-5 rounded-[100px] mt-5 md:m-4 md:mt-0">
              <div className="absolute  h-full bg-gradient-to-r from-[#1D5FA3] to-[#8BC4FF] rounded-[100px]"

                style={{ width: `${value}%` }}
              ></div>
            </div>
            <div className='flex justify-between md:hidden m-5 '>
             
            {employeeData?(
              <div className=' '>
                {/* <p className=" font-lato md:text-3xl text-[16px] leading-5 font-medium ">{value}%</p>
                    <p className=" font-lato md:text-2xl text-[12px] leading-[14.4px] font-medium text-[#747E94]">Overall Performance</p> */}
                <p className="text-[#747E94]  text-sm font-medium font-lato">Employee ID <span className="text-[#002446] block text-sm font-bold font-lato">{employeeData.employeeId}</span></p>

              </div>
            ):(<p>leading...</p>)} 
             

              <div className='flex md:w-36   h-11 bg-[#F6F6F6] rounded-md items-center justify-between border border-[#CCCCCC] ' >
                <input type='text'
                  value={value}
                  onChange={handleInputChange}
                  className='md:w-20 p-2  w-10 md:h-5 outline-none m-auto bg-none  bg-[#F6F6F6]'
                />

                {/* <button className='m-auto'>{percentage}</button> */}
                <div className='flex flex-col align-middle  '>
                  <button className=' pt-2'
                    onClick={() => setValue((prev) => Math.max((prev || 0) - 1, 0))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m7 15l5-5l5 5z" /></svg>

                  </button>

                  <button className='pb-2'
                    onClick={() => setValue((prev) => Math.min((prev || 0) + 1, 100))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m7 10l5 5l5-5z" /></svg>

                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>


      {/* form */}

      <div className="md:h-[401px] flex-shrink h-[320px] bg-[#F6F6F6] rounded-lg md:w-full w-[90%] m-auto mt-10  ">
        <div className=" h-15 bg-[#F6F6F6] rounded-lg  w-[100%]  flex justify-center items-start md:mt-10 md:pt-10">
          <div className="relative w-[100%] md:w-[90%] ">
            {/* Selected Button */}
            <div
              onClick={handleDropdownToggle}
              className="font-lato w-full h-[60px]  drop-shadow-xl rounded-xl px-3 flex justify-between items-center cursor-pointer bg-white  hover:bg-gray-200"
            >
              <span className=''>{selectedOption}</span>
              <span
                className={`transform transition-transform   ${isOpen ? "rotate-180" : ""
                  }`}
              >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" sstrokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 15l-5 -5M12 15l5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>
              </span>
            </div>

            {/* Dropdown Options */}
            {isOpen && (
              <div className="absolute top-full left-0 w-full  bg-white drop-shadow-xl rounded-xl mt-2 z-10 space-y-2 p-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`font-lato w-full pl-4 h-[50px] flex items-center  cursor-pointer rounded-lg transition-colors ${getBackgroundColor(option)}`}
                    >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='md:mt-10 flex justify-center  flex-shrink m-auto mt-4 '>


          <textarea
            name="description"
            className="w-full md:w-[90%] h-56 md:h-[156px] rounded-2xl border border-[#CCCCCC] mt-7 font-medium font-lato text-black p-5 placeholder:text-[#C1C1C1] placeholder:font-medium outline-none md:text-[32px] text-sm resize-none"
            placeholder="Leave A Brief Description."
            maxLength="550"
            value={comment}
            onChange={handleComment}
          />


        </div>

      </div>



      <div className='flex justify-end p-5'>
        <button className='   w-[40%] h-[46px] md:w-[25%] md:h-[66px] bg-black text-white rounded-[15px] md:text-2xl text-[16px] font-lato font-bold mt-5 '
          onClick={handleSubmit}
        >
          SubmitReports
        </button>
      </div>

    </div>
    </div>

  )
}

export default MonthlyPerfomanceLeader