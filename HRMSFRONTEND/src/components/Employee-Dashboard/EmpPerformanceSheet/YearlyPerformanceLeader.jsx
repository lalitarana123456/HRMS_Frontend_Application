import React, { useState, useEffect } from 'react'
import { RiTeamFill } from "react-icons/ri";
import man from "/Ellipse.png";
import task from "/task.jpg";
import task2 from "/task2.jpg";
import task3 from "/task3.png";
import task4 from "/task4.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
const YearlyPerformanceLeader = () => {

  const [isMonthly, setIsMonthly] = useState(false);

  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select Comment Type");

  const [value, setValue] = useState(0)
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // const [ratings, setRating] = useState([0, 0, 0, 0]);
  const { _id } = useParams();
  const [errors, setErrors] = useState({}); // To store validation errors

  const options = ["Recommendation", "Warning", 'Alert'];
  const getBackgroundColor = (option) => {
    switch (option) {
      case "Recommendation":
        return "bg-green-200 hover:bg-green-300";
      case "Warning":
        return "bg-yellow-200 hover:bg-yellow-300";
      case "Alert":
        return "bg-red-200 hover:bg-red-300"; // 
      default:
        return "bg-gray-100 hover:bg-gray-200";
    }
  }

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

  // const handleInputChange = (e) => {
  //   const inputValue = e.target.value;


  //   if (inputValue === "" || (inputValue >= 0 && inputValue <= 100)) {
  //     setValue(inputValue);
  //   } else {
  //     setValue(0);
  //   }
  // }

  const [ratings, setRatings] = useState({
    tasks: 0,
    team: 0,
    efficiency: 0,
    attendance: 0,
  });


  const handleRating = (category, rating) => {

    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: rating,
    }))

    console.log(`Rating for ${category}:`, rating);


  }


  const validateFields = () => {
    const newErrors = {};

    if (!selectedOption) {
      newErrors.selectedOption = "Please select an option.";
    }
    // if (!value) {
    //   newErrors.value = "please fill the value"
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {

    if (!validateFields()) {
      toast.error("Please fill all value before submitting.");
      return;
    }

    const payload = {
     
      commentCategory: selectedOption,
      commentText: comment,
      taskCompletion: ratings.tasks,
      attendanceRating: ratings.attendance,
      efficiencyScore: ratings.efficiency,
      teamCollaborationRating: ratings.team,
     
    };
    console.log("Payload Data to be sent to the backend:", payload);


    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/performances/yearly/${_id}`,
        payload,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',

          },
        }
      )
       console.log("Response:", response.data);

      toast.success("Data submitted successfully!");

      setRatings({
        tasks: 0,
        team: 0,
        efficiency: 0,
        attendance: 0,
      });
      setValue('0');
      setSelectedOption('Select Comment Type');
      setComment('');
    } catch (error) {
      console.error("Error submitting data:", error.response?.data || error.message);

      // Display the backend error message if available
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error(`Failed to submit data: ${error.response?.data?.message || "Unknown error"}`);
      }
    };
  }

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



  return (
    <div className='w-full flex md:h-screen min-h-screen bg-[#D6EAE7]'>
        <Sidebar/>
    <div className='md:w-full  md:h-[100%] md:p-10 flex-shrink  overflow-y-auto  scrollbar-thin scrollbar-thumb-black scrollbar-track-black  '>
    
    <div className='md:flex justify-between items-center  h-20'>
      <div className="md:flex items-center justify-between mt-4 md:mt-0">
        <p className="md:text-[40px] font-bold text-xl text-center text-[#002446]">Yearly Performance
          {/* <span className='font-lato font-bold text-2xl pl-4 text-[#8B8B8B]'>January 2024</span> */}

              {/* <span className="font-lato font-bold invisible md:visible text-2xl pl-2 text-[#8B8B8B]">
            {selectedYear}
          </span> */}
            </p>

            <div className="flex mt-4 md:ml-10 m-4 md:m-0 bg-white w-24 rounded-lg p-1  justify-center items-center   ">


              {/* <DatePicker
                selected={new Date(selectedYear, 0)}
                onChange={(date) => setSelectedYear(date.getFullYear())} // 
                showYearPicker
                dateFormat="yyyy"
                className="px-4 py-2 bg-white md:w-40 rounded-lg h-9 w-20 outline-none cursor-pointer "

              /> */}

             <p className=' '> {employeeData?.year}</p>

              {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" sstrokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 15l-5 -5M12 15l5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg> */}

            </div>

            {/* <button className=" hidden md:flex items-center gap-2 px-7 py-2 text-white rounded-lg w-[130px] h-[43px] transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-400 hover:to-green-400"
          style={{ background: 'linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)' }}>
          <RiTeamFill />
          <p className="text-[14px] font-lato font-extrabold">Team</p>
        </button> */}
          </div>

          <div className='flex items-end justify-end  -mt-12 m-4 md:m-0  md:mt-0 '>
            <div className="relative flex  md:flex w-[156px] h-[24px] rounded-full bg-white" style={{ boxShadow: '0px 3px 7.6px 1px #00000040', }}>
              <div className={`absolute w-1/2  bg-[#E2EFED] rounded-full transition-transform duration-300 ${isMonthly ? "translate-x-0" : "translate-x-full"}`}></div>

              <button className={`flex-1 w-20   text-xs z-10 font-semibold ${isMonthly ? "text-[#063057] bg-[#E2EFED] " : "text-[#06193F80]"}`}
                onClick={() => {
                  navigate(`/LeaderMonth/${_id}`);
                  // navigate("/LeaderYear")

                  setIsMonthly(false)
                }
                }>
                Monthly
              </button>

              <button className={`flex-1 w-20 text-xs z-10 font-semibold ${isMonthly ? "text-[#06193F80]  " : "text-[#063057] bg-[#E2EFED] rounded-lg "}`}
                onClick={() => {
                
                  setIsMonthly(true);
                }}>
                Yearly
              </button>
            </div>
          </div>
        </div>
        {/* profile section */}
        <div className='flex justify-between md:items-center md:p-4 '>
          <div className="md:flex hidden items-center justify-center rounded-lg ">
            {employeeData ? (
              <div className="md:m-4 m-2 w-24 ">
                <img className=' w-24 h-24 rounded-full' src={employeeData.profilePhoto} alt="Profile" />
              </div>) : (
              <p>Loading...</p>
            )
            }

            {employeeData ? (
              <div className=" pt-4   ">
                <h3 className="md:text-[32px]  text-[16px] leading-5 font-lato font-medium text-[#002446]">{employeeData.firstName + " " + employeeData.lastName}</h3>
                <p className="text-[#747E94]  md:text-2xl text-[12px] pt-1 leading-[14.4px] font-medium font-lato">{employeeData.designation}</p>
                <p className="text-[#747E94]  text-sm font-medium font-lato">Employee ID
                  <span className="text-[#002446] block font-bold text-sm  font-lato">{employeeData.employeeId}</span></p>
              </div>) :
              (<p>Loading......</p>)}


          </div>


        </div>

      {/* overallPerformance */}
<div className='md:w-full flex-shrink  md:h-[289px] w-screen p-4 md:p-0'>
      <div className='md:mt-10 rounded-lg  mt-4 m-auto   h-[187px]'>
{/* mobile view */}
        <div className=' md:h-[289px]  bg-[#FFFFFF]  md:w-full rounded-lg   shadow-lg'>
          <div className='flex justify-between p-5 md:h-36 h-20   md:pt-10 md:p-5 rounded-lg  shadow-lg'>
            <div className=" md:hidden flex  gap-2 items-center justify-center rounded-lg ">
            {employeeData ?(
            <div className="md:m-4 w-11 md:w-full ">
                <img  
                className=' w-8 h-8 rounded-full'
                src={employeeData.profilePhoto} alt="Profile" />
              </div>
           ):(<p>Loading..</p>)}   


                  {employeeData ? (
                    <div className="md:pt-4   ">
                      <h3 className="md:text-[32px]  text-[16px] leading-5 font-lato font-medium text-[#002446]">{employeeData.firstName + " " + employeeData.lastName}</h3>
                      <p className="text-[#747E94]  md:text-2xl text-[12px] leading-[14.4px] font-medium font-lato">{employeeData.designation}</p>
                    </div>) :
                    (<p>Loading...</p>)}

                </div>

                <div className='pt-1 md:pt-0 '>
                  <p className=" font-lato md:text-3xl text-[16px] leading-5 font-medium ">{employeeData?.yearlyOverallPerformancePercentage}%</p>
                  <p className=" font-lato md:text-2xl text-[12px] leading-[14.4px] font-medium text-[#747E94]">Overall Performance</p>
                </div>

                <div className='md:flex md:w-36 hidden   h-11 bg-[#F6F6F6] rounded-md items-center justify-center border border-[#CCCCCC] ' >
                  {/* <input type='text'
                    // value={value}
                    // onChange={handleInputChange}
                    className='md:w-20 p-2 w-10 md:h-5 outline-none m-auto bg-none  bg-[#F6F6F6]'
                  />

                  {/* <button className='m-auto'>{percentage}</button> */}
                  {/* <div className='flex flex-col align-middle  '>
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
                  </div> */} 
                  <p className='text-center'>{employeeData?.yearlyOverallPerformancePercentage} </p>
                   
                </div>
              </div>
              {/* progress bar */}
              <div className="md:w-full pt-1  h-28 md:h-36 bg-[#F6F6F6]    md:flex md:justify-center md:items-center rounded-b-lg ">
                <div className="relative bg-white m-auto w-[90%] md:h-12 h-5 rounded-[100px] mt-5 md:m-4 md:mt-0">
                  <div className="absolute  h-full bg-gradient-to-r from-[#1D5FA3] to-[#8BC4FF] rounded-[100px]"

                    style={{ width: `${employeeData?.yearlyOverallPerformancePercentage}%` }}
                  ></div>
                </div>
                <div className='flex justify-between md:hidden m-5 '>
                  {employeeData ? (
                    <div className=' '>
                      {/* <p className=" font-lato md:text-3xl text-[16px] leading-5 font-medium ">{value}%</p>
                    <p className=" font-lato md:text-2xl text-[12px] leading-[14.4px] font-medium text-[#747E94]">Overall Performance</p> */}
                      <p className="text-[#747E94]  text-sm font-medium font-lato">Employee ID <span className="text-[#002446] block text-sm font-normal font-lato">{employeeData.employeeId}</span></p>

                    </div>
                  ) : (<p>leading...</p>)}


                  <div className='flex md:w-36 w-20   h-11 bg-[#F6F6F6] rounded-md items-center justify-center border border-[#CCCCCC] ' >
                    {/* <input type='text'
                      // value={value}
                      // onChange={handleInputChange}
                      className='md:w-20 p-2 w-10 md:h-12 outline-none m-auto bg-none  bg-[#F6F6F6]'
                      required
                      
                    />*/
                    <p className='text-center'>{employeeData?.yearlyOverallPerformancePercentage} </p>
                    

                    /* <button className='m-auto'>{percentage}</button> */}
                    {/* <div className='flex flex-col align-middle  '>
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
                    </div> */}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* rating */}


      {/* <p className="font-lato font-semibold hidden md:block text-[36px]  text-[#6F6F6F]">Yearly Performance</p> */}
      <div className="md:flex flex-shrink md:flex-row   flex gap-3 w-[100%] px-5   md:m-auto items-center justify-center  pt-3  h-[187px] ">
<div className='md:flex md:gap-2  flex-shrink w-[90%] '>
        <div className="bg-white  md:w-[90%] flex-shrink flex flex-col items-center justify-center  h-[89px]  md:h-[99px]  rounded-[20px] shadow-md" >
          <div className="flex justify-center items-center gap-2  ">
            <img src={task} alt="icons" className="md:size-5 md:mt-4" />
            <p className="text-[#06193F8F] text-sm md:text-[20px] md:pt-2 p-0 md:mt-2">Tasks completed</p>
          </div>
          <div className="flex items-center gap-1 px-9 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-[20px] cursor-pointer ${star <= ratings.tasks ? "text-yellow-500" : "text-[#B8AF94]"
                  }`}
                onClick={() => handleRating("tasks", star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white flex-shrink  mt-2 md:mt-0 md:w-[90%]  flex flex-col items-center justify-center  h-[89px]  md:h-[99px]  rounded-[20px] shadow-md" >
        <div className="flex justify-center items-center gap-2 ">
            <img src={task2} alt="icons" className="md:size-5 md:mt-4" />
            <p className="text-[#06193F8F] text-sm md:text-[20px] md:pt-2 p-0 md:mt-2">Attendance Rate</p>
          </div>
          <div className="flex items-center gap-1 px-9 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-[20px] cursor-pointer ${star <= ratings.attendance ? "text-yellow-500" : "text-[#B8AF94]"
                  }`}
                onClick={() => handleRating("attendance", star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        </div>
        <div className='md:flex md:gap-2 flex-shrink w-[90%]  '>
        {/* Efficiency Score */}
        <div className="bg-white md:w-[90%] flex-shrink flex flex-col items-center justify-center  h-[89px]  md:h-[99px]  rounded-[20px] shadow-md" >
       <div className="flex justify-center w-full  items-center gap-2 ">
            <img src={task3} alt="icons" className="md:size-5 md:mt-4" />
            <p className="text-[#06193F8F] text-sm md:text-[20px] md:pt-2 p-0 md:mt-2">Efficiency Score</p>
          </div>
          <div className="flex items-center gap-1 px-9 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-[20px] cursor-pointer ${star <= ratings.efficiency ? "text-yellow-500" : "text-[#B8AF94]"
                  }`}
                onClick={() => handleRating("efficiency", star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        {/* Team Collaboration */}
        <div className="bg-white mt-2 md:mt-0 md:w-[90%]  flex flex-col items-center justify-center  h-[89px]  md:h-[99px]  rounded-[20px] shadow-md" >
        <div className="flex justify-center items-center gap-2">
            <img src={task4} alt="icons" className="md:size-5 md:mt-4" />
            <p className="text-[#06193F8F] text-sm md:text-[20px] md:pt-2 p-0 md:mt-2">Team Collaboration</p>
          </div>
          <div className="flex items-center gap-1 px-9 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-[20px] cursor-pointer ${star <= ratings.team ? "text-yellow-500" : "text-[#B8AF94]"
                  }`}
                onClick={() => handleRating("team", star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
</div>
      </div>




        {/* form */}

        <div className="md:h-[401px] h-[320px] bg-[#F6F6F6] rounded-lg md:w-full w-[90%] m-auto mt-10  ">
          <div className=" h-15 bg-[#F6F6F6] rounded-lg  w-[100%]  flex justify-center items-start md:mt-10 md:pt-10">
            <div className="relative w-[100%] md:w-[90%] ">
              {/* Selected Button */}
              <div
                onClick={handleDropdownToggle}
                className="font-lato w-full h-[60px]  drop-shadow-xl rounded-xl px-3 flex justify-between items-center cursor-pointer bg-white  hover:bg-gray-200"
              >
                <span className='pl-4'>{selectedOption}</span>
                <span
                  className={`transform transition-transform   ${isOpen ? "rotate-180" : ""
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" sstrokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 15l-5 -5M12 15l5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0" /></path></svg>
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
          <div className='md:mt-10 flex justify-center  m-auto mt-4 '>


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
        <button className='   w-[50%] h-[46px] md:w-[25%] md:h-[66px] bg-black text-white rounded-[15px] md:text-2xl text-[16px] font-lato font-bold mt-5 '
          onClick={handleSubmit}
        >
          SubmitReports
        </button>
      </div>

      </div>
    </div>
  )
}

export default YearlyPerformanceLeader