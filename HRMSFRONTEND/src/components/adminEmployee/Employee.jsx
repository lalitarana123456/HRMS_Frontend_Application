import axios from 'axios';
import React, { useRef, useState } from 'react'
import AdminSidebar from '../Admin-Sidebar/adminSidebar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import EmployerSidebar from '../Employer-Sidebar/EmployerSidebar';
const Employee = () => {



  const currentYear = new Date().getFullYear(); // Get current year dynamically
  const startYear = currentYear - 50; // Adjust start year (e.g., last 50 years)
  const endYear = currentYear + 10; // Adjust end year if you want future years

  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // dateOfJoining: { day: "", month: "", year: "" },
    date: "",
    email: "",
    designation: "",
    teamLeader: "",
    password: "",
    confirmPassword: "",
    gender: "",
    contactNumber: "",
    department: "",
    employeeStatus: "",
    salary: "",


  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };



  // const handleDateChange = (e, field) => {
  //   const { value } = e.target;

  //   setFormData((prevData) => {
  //     const newDateOfJoining = {
  //       ...prevData.dateOfJoining,
  //       [field]: value,
  //     };


  //     if (newDateOfJoining.day && newDateOfJoining.month && newDateOfJoining.year) {
  //       // Convert month name to month number
  //       const monthNumber = getMonthNumber(newDateOfJoining.month); // Now convert month name to number

  //       // Creating a new Date using the provided day, month (as number), and year
  //       const date = new Date(`${newDateOfJoining.year}-${monthNumber}-${newDateOfJoining.day}`);
  //       // const date = new Date(
  //       //   newDateOfJoining.year,
  //       //   monthNumber,
  //       //   newDateOfJoining.day
  //       // );

  //       if (isNaN(date.getTime())) {
  //         setErrors({ dateOfJoining: "Invalid date selected!" });
  //         return prevData;
  //       }
  //       // Converting to ISO format ('YYYY-MM-DD')
  //       const isoDate = date.toISOString().split("T")[0];

  //       return {
  //         ...prevData,
  //         dateOfJoining: { ...newDateOfJoining, formattedDate: isoDate }, // 'formattedDate' in ISO format
  //       };
  //     }

  //     return {
  //       ...prevData,
  //       dateOfJoining: newDateOfJoining,
  //     };
  //   });

  //   setErrors({ ...errors, dateOfJoining: "" });
  // };

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData({ ...formData, date: date.toLocaleDateString('en-CA').split('T')[0] });

  }

  const [open, setOpen] = useState(false);
  const datePickerRef = useRef(null);
  const toggleDatePicker = () => {
    setOpen((prevOpen) => !prevOpen); // Toggle the open state
  };






  // const getMonthNumber = (month) => {
  //   const months = {
  //     "January": 0,
  //       "February": 1,
  //       "March": 2,
  //       "April": 3,
  //       "May": 4,
  //       "June": 5,
  //       "July": 6,
  //       "August": 7,
  //       "September": 8,
  //       "October": 9,
  //       "November": 10,
  //       "December": 11,
  //   };
  //   return months[month] ?? 0; // Default to January if invalid month
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};


    if (!formData.firstName) {
      validationErrors.firstName = 'Please fill the first name'
    }
    //console.log(validationErrors.firstName);
    if (!formData.lastName) {
      validationErrors.lastName = 'Please fill the last name'
    }
    if (!formData.email) {
      validationErrors.email = 'Please fill the email'
    }
    if (!formData.designation) {
      validationErrors.designation = 'Please fill the designation'
    }
    if (!formData.password) {
      validationErrors.password = 'Please fill the password'
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = 'Please fill the re password'
    }
    if (!formData.gender) {
      validationErrors.gender = 'Please fill the gender'
    }
    if (!formData.contactNumber) {
      validationErrors.contactNumber = 'Please fill the phone number'
    }
    if (!formData.department) {
      validationErrors.department = 'Please fill the department'
    }
    if (!formData.employeeStatus) {
      validationErrors.employeeStatus = 'Please fill the employee status'
    }
    if (!formData.teamLeader) {
      validationErrors.teamLeader = 'Please fill the team leader name'
    }
    if (!formData.salary) {
      validationErrors.salary = 'Please fill the salary'
    }

    // if (
    //   !formData.dateOfJoining.day ||
    //   !formData.dateOfJoining.month ||
    //   !formData.dateOfJoining.year
    // ) {
    //   validationErrors.dateOfJoining = "Please fill in the complete joining date";
    // }
    setErrors(validationErrors)
    console.log('Form Data:', formData);



    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfJoining: formData.date,
      email: formData.email,
      designation: formData.designation,
      teamLeader: formData.teamLeader,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      gender: formData.gender,
      contactNumber: formData.contactNumber,
      department: formData.department,
      employeeStatus: formData.employeeStatus,
      salary: formData.salary
    };







    console.log("Data being sent to the backend:", payload);

    try {
      const token = localStorage.getItem('token'); // Get token from local storage (if needed)

      // Make API request to send the data
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employees/create`


        // ${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employees/create"
        ,
        payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Optional, depending on authentication
          'Content-Type': 'application/json',
        },
      });

      // console.log("Response from the backend:", response.data);
      toast.success("Employee data submitted successfully!");

      // Reset form data after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        dateOfJoining: { day: "", month: "", year: "" },
        email: "",
        designation: "",
        teamLeader: "",
        password: "",
        confirmPassword: "",
        gender: "",
        contactNumber: "",
        department: "",
        employeeStatus: "",
        salary: ""


      });
    } catch (error) {
      // console.error("Error submitting data:", error);
      toast.error(`Failed to submit data: ${error.response?.data?.message || "Unknown error"}`);
    }
  };
  const navigate = useNavigate()
  return (
    <>
      <div className='w-screen  flex  bg-[#FFFCFE]  md:h-screen min-h-screen'>
        {/* <AdminSidebar/> */}
        <div><EmployerSidebar /></div>
        <div className='w-[calc(100%-248px)] min-h-screen  overflow-x-hidden  overflow-y-auto  scrollbar-thin scrollbar-thumb-black scrollbar-track-black '>
          <p className='font-roboto text-4xl items-center font-bold p-7'>Create Employee ID</p>
          <div className='border-b border-[#00000033] w-full'></div>
          {/* form */}
          <form
            onSubmit={handleSubmit}>

            <div className='flex justify-between p-7'>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2 '>
                  <label className="font-inter font-medium text-2xl ">First Name</label>
                  <input type='text'
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
                    placeholder='Enter your name'
                  />
                  {errors.firstName && <p className="text-red-500 text-sm font-bold">{errors.firstName}</p>}

                </div>


                {/* date joining */}

                {/* Date of Joining */}
                <div className="flex flex-col gap-2">
                  <label className="font-inter font-medium text-2xl">Date of Joining</label>

                  <div
                    className="flex items-center relative w-full bg-white border border-gray-300 rounded-md px-2 ">

                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="dd-mm-yyyy"
                      className="h-11 w-72 bg-transparent text-black focus:outline-none"
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







                  {/* <div className="flex gap-4"> */}
                  {/* Day Dropdown */}
                  {/* <select
     
     name="day"
                value={formData.dateOfJoining.day}
                onChange={(e) => handleDateChange(e, 'day')}
             
     
      className="w-[120px] cursor-pointer h-11 bg-[#FFFFFF] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled selected>
        Day
      </option>
      {Array.from({ length: 31 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select> */}

                  {/* Month Dropdown */}
                  {/* <select
      value={formData.dateOfJoining.month}
                onChange={(e) => handleDateChange(e, 'month')}
               
     
      className="w-[130px] h-11 bg-[#FFFFFF] border cursor-pointer border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled selected>
        Month
      </option>
      {[
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].map((month, index) => (
        <option key={index} value={month}>
          {month}
        </option>
      ))}
    </select> */}

                  {/* Year Dropdown */}
                  {/* <select
      name="year"
                value={formData.dateOfJoining.year}
                onChange={(e) => handleDateChange(e, 'year')}
               
     
      className="w-[100px] h-11 cursor-pointer bg-[#FFFFFF] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
     <option value="" disabled selected>
    Year
  </option>
  {Array.from({ length: endYear - startYear + 1 }, (_, i) => (
    <option key={i} value={startYear + i}>
      {startYear + i}
    </option>
      ))}
    </select> */}

                  {/* {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>} */}
                  {/* </div> */}
                  {errors.dateOfJoining && <p className="text-red-500 text-sm font-bold">{errors.dateOfJoining}</p>}

                </div>



                {/* emailid */}
                <div className='flex flex-col gap-2'>
                  <label className="font-inter font-medium text-2xl ">email id</label>
                  <input type='text'

                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}

                    className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
                    placeholder='Enter your email Id'
                  />
                  {errors.email && <p className="text-red-500 text-sm font-bold">{errors.email}</p>}
                </div>
                {/* designation */}
                <div className="flex flex-col gap-2">
                  <label className="font-inter font-medium text-2xl">Designation</label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Select your designation "
                    className="w-[396px] cursor-pointer h-11 bg-[#FFFFFF] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled selected
                      placeholder="Select your gender">
                      Select Designation
                    </option>
                    <option value="IT Team Leader">IT Team Leader</option>
                    <option value="Assignment Team Leader">Assignment Team Leader</option>
                    <option value="Finance Team Leader">Finance Team Leader</option>
                    <option value="Digital marketing team Leader">Digital  marketing team Leader</option>
                    <option value='IT'>IT</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Front-End">Front-End</option>
                    <option value="Back-End">Back-End</option>
                    <option value="Research">Research</option>
                    <option value="HR">HR</option>
                    <option value="Social Media">Social Media</option>
                    {/* <option value="Team Leader">Team Leader</option> */}
                    <option value="Human Resources">Human Resources</option>
                    <option value="Research Writer">Research Writer</option>
                    <option value="Finance Analyst">Finance Analyst</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Business Development Executive">Business Development Executive</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full stack Developer">Full stack Developer</option>
                    <option value="UI & UX designer">UI & UX designer</option>
                    <option value="Python Developer">Python Developer</option>
                  </select>
                  {errors.designation && <p className='text-red-500 text-sm font-bold'>{errors.designation}</p>}

                </div>


                {/* Leader */}
                <div className='flex flex-col gap-2'>
                  <label className="font-inter font-medium text-2xl ">Leader</label>
                  <input type='text'
                    name="teamLeader"
                    value={formData.teamLeader}
                    onChange={handleInputChange}

                    className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
                    placeholder='Enter your Leader name'
                  />
                  {errors.teamLeader && <p className='text-red-500 text-sm font-bold'>{errors.teamLeader}</p>}

                </div>
                {/* Enter your password */}
                <div className='flex flex-col gap-2'>
                  <label className="font-inter font-medium text-2xl ">Enter your Password</label>
                  <input type='text'
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}

                    className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
                    placeholder='Enter your Password'
                  />
                  {errors.password && <p className='text-red-500 text-sm font-bold'>{errors.password}</p>}

                </div>
                <div className='flex flex-col gap-2'>
                  <label className="font-inter font-medium text-2xl ">Enter your Salary</label>
                  <input type='text'
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}

                    className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
                    placeholder='Enter your Password'
                  />
                  {errors.salary && <p className='text-red-500 text-sm font-bold'>{errors.salary}</p>}

                </div>
                {/* left */}
              </div>
              <div className=' w-1/2 flex flex-col gap-4'>
                <div className='flex flex-col gap-2 '>
                  <label className="font-inter font-medium text-2xl ">Last Name</label>
                  <input type='text'
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}

                    className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
                    placeholder='Enter your name'
                  />
                  {errors.lastName && <p className='text-red-500 text-sm font-bold'>{errors.lastName}</p>}

                </div>



                <div className='flex flex-col gap-2'>
                  <label className="font-inter font-medium text-2xl ">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder="Select your gender"

                    className="w-[396px] h-11 bg-[#FFFFFF] cursor-pointer border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option className='bg- font-inter'
                      value="" disabled selected
                      placeholder="Select your gender"
                    >
                      Select your gender

                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  {errors.gender && <p className='text-red-500 text-sm font-bold'>{errors.gender}</p>}

                </div>


                <div className='flex flex-col gap-2'>
                  <label className="font-inter font-medium text-2xl ">Contact number</label>
                  <input type='text'
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}

                    className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
                    placeholder='Enter your email Id'
                  />
                  {errors.contactNumber && <p className='text-red-500 text-sm font-bold'>{errors.contactNumber}</p>}

                </div>

                <div className='flex flex-col gap-2'>
                  <label className="font-inter font-medium text-2xl ">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}

                    className="w-[396px] h-11 cursor-pointer bg-[#FFFFFF] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled selected>
                      Select Deparment
                    </option>
                    <option value="IT Department">IT Department</option>
                    <option value="Finance Department">Assignment Department</option>
                    <option value="Assignment Department">Finance Department</option>
                    <option value="Digital Marketing Department">Digital Marketing Department</option>
                  </select>
                  {errors.department && <p className='text-red-500 text-sm font-bold'>{errors.department}</p>}

                </div>
                {/* Leader */}

                <div className="flex flex-col gap-2">
                  <label className="font-inter font-medium text-2xl">Employee Status</label>
                  <select
                    name="employeeStatus"
                    value={formData.employeeStatus}
                    onChange={handleInputChange}

                    className="w-[396px] h-11 cursor-pointer bg-[#FFFFFF] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled selected>
                      Select Employee Status
                    </option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Intern">Intern</option>
                  </select>
                  {errors.employeeStatus && <p className='text-red-500 text-sm font-bold'>{errors.employeeStatus}</p>}

                </div>



                {/* Enter your password */}
                <div className='flex flex-col gap-2'>
                  <label className="font-inter font-medium text-2xl ">Re-enter your Password</label>
                  <input type='text'
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className='w-[396px] h-11 bg-[#FFFFFF] border border-[#0000001A] rounded-[10px] p-4'
                    placeholder='Enter your Password'
                  />
                  {errors.confirmPassword && <p className='text-red-500 text-sm font-bold'>{errors.confirmPassword}</p>}

                </div>



                {/* right */}
              </div>




            </div>
            <button
              className='bg-[#55D1D9] w-60 h-16 rounded-2xl border shadow-lg border-[#FFFFFF] font-roboto m-10  text-3xl font-semibold mt-10'

              type="submit">Create id</button>
          </form>


        </div>
      </div>
    </>
  )
}

export default Employee