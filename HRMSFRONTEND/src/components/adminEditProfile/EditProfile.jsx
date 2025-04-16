import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import AdminSidebar from '../Admin-Sidebar/adminSidebar';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EditProfile = () => {

  const [isEditable, setIsEditable] = useState(false);
  const [profileData, setProfileData] = useState({});
  
  const [editedData, setEditedData] = useState({}); 
  
  
  const { id } = useParams();
 
  const handleChange = (e) => {
    const { name, value } = e.target;
   // console.log("Name:", name, "Value:", value);
    setEditedData((prevState) => ({
      ...prevState,
      [name]:name === "dateOfJoining" && !value ? null : value,
    }));
  };



 
  
  
 
 

  
  
 
  const handleEditToggle = () => {
    setIsEditable((prevState) => {
      const newState = !prevState;
  

      if (!newState && editedData.dateOfJoining) {
        const parts = editedData.dateOfJoining.split("/");
        const formattedDate =
          parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : ""; // Convert "DD/MM/YYYY" → "YYYY-MM-DD"
  
     


      // if (!newState && editedData.dateOfJoining) {
      //   const date = new Date(editedData.dateOfJoining);
      //   const formattedDate = !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
        setEditedData((prevData) => ({
          ...prevData,
          dateOfJoining: formattedDate,
        }));
      }
      return newState;
    });
  };
  



  const getApiData = async () => {

    const token = localStorage.getItem('token');
    
   // console.log("Token:", token); 
   // console.log("ID:", id)

    if (token) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/admin/${id}`,    

          {
            headers: {
              Authorization: `Bearer ${token}`, 

            },
          }
        );
       
       console.log("api date"+res.data);
       console.log(profileData);
        console.log(EditProfile);
         setProfileData(res.data);
          setEditedData(res.data);

       
      } catch (error) {
       console.error("Error fetching API:", error.message || error.response?.data);
     }

    } else {
     console.log("Token not found in local storage");
    }
  };


  const handleSave = async () => {
    const token = localStorage.getItem("token");

    let formattedDate = editedData.dateOfJoining;

    if (formattedDate.includes("/")) {
      const parts = formattedDate.split("/"); // "DD/MM/YYYY" → ["DD", "MM", "YYYY"]
      formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to "YYYY-MM-DD"
    }
  
    console.log("Formatted Date:", formattedDate);
    console.log("Payload:", { ...editedData, dateOfJoining: formattedDate });
  
    if (!formattedDate || isNaN(new Date(formattedDate).getTime())) {
      toast.error("Invalid or missing date");
      return;
    }


    // const formattedDate =
    // editedData.dateOfJoining && !isNaN(new Date(editedData.dateOfJoining).getTime())
    //   ? new Date(editedData.dateOfJoining).toISOString().split("T")[0]
    //   : null;

  //   const formattedDate =
  //   editedData.dateOfJoining &&
  //   editedData.dateOfJoining.includes("/")
  //     ? editedData.dateOfJoining.split("/").reverse().join("-")
  //     : editedData.dateOfJoining;

  //   console.log("Formatted Date:", formattedDate);

  //   // Payload ko console karo (editedData + dateOfJoining)
  //   console.log("Payload:", { ...editedData, dateOfJoining: formattedDate });
  

  // // Validate if the formattedDate is a valid date
  // if (!formattedDate) {
  //   toast.error("Invalid or missing date");
  //   return;
  // }

    if (token) {
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/admin/edit/${id}`,
        //  editedData,
        { ...editedData, dateOfJoining: formattedDate },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
        console.log("Data saved successfully:", res.data);
        toast.success("Data saved successfully");
        
      await  getApiData();
     
        setIsEditable(false);
      } catch (error) {
       console.error("Error saving data:", error.response?.data || error.message);
        toast.error("Error saving data");
      }
    } else {
   //   console.log("Token is missing");
    }
  };

  useEffect(() => {
    getApiData();
   
  }, []);

  
  return (
    <div className='w-screen  flex  bg-[#FFFCFE]  md:h-screen min-h-screen'>
     <div><AdminSidebar/></div>
    <div className=' w-[calc(100%-248px)] min-h-screen p-10  overflow-x-hidden  overflow-y-auto  scrollbar-thin scrollbar-thumb-black scrollbar-track-black'>
      <p className='font-roboto  font-bold text-4xl'>Edit Profile</p>
      <div className=' shadow-lg  flex justify-between rounded-[20px] mt-10 p-10 bg-[#FFFFFF]'>

        <div className='flex gap-10'>
          {/* <div className='w-[202px] h-[296px] '>
            <img
              className='w-[182px] h-[276px] rounded-3xl  m-3'
              src={`/uploads/${profileData?.photo?.replace(/\\/g, '/')}`} alt='Profile pic'
        
              
               />
          </div> */}
          <div>
          {/* name */}
            <div>
              
                  <span className='font-lato font-bold text-[32px] text-[#002446]'>
  {isEditable ? (
    <div className="flex gap-2">
      {/* Editable First Name */}
      <input
        type="text"
        name="firstName"
        value={editedData?.firstName || ""}
        onChange={ handleChange} // Handle input change
        className="border border-gray-300 p-1 rounded"
        placeholder="First Name"
      />

      {/* Editable Last Name */}
      {/* <input
        type="text"
        name="lastName"
        value={editedData?.lastName || ""}
        onChange={ handleChange} // Handle input change
        className="border border-gray-300 p-1 rounded"
        placeholder="Last Name"
      /> */}
    </div>
  ) : (
    // Display Full Name when not editable
    `${profileData?.firstName || ""}` 
  )}
</span>

<span className='font-lato font-bold text-[32px] text-[#002446]'>
  {isEditable ? (
    <div className="flex gap-2">
      {/* Editable First Name */}
      <input
       type="text"
        name="lastName"
        value={editedData?.lastName || ""}
        onChange={ handleChange} // Handle input change
        className="border border-gray-300 p-1 rounded"
        placeholder="Last Name"
      />
       </div>  
      ) : (
    // Display Full Name when not editable
    `${profileData?.lastName || ""}` 
  )}
</span>        
            </div>
            <div className='flex w-[100%] gap-20 pt-10'>
              {/* emp empid */}
              <div className='flex flex-col gap-5  '>
                <p className='font-lato font-medium text-[20px] leading-6 text-[#707070]'>Employee ID
                <span className='block font-lato font-normal text-[20px] leading-6 text-[#000000]'>
                  {isEditable ? (
                    <input type='text' name="employeeId"
                      value={editedData?.employeeId}
                      onChange={handleChange}
                      className="border border-gray-300 p-0 rounded  "
                    />
                  ) : (
                    profileData?.employeeId
                  )}
                </span> 
                </p>

<p className="font-lato font-normal text-[20px] leading-6 text-[#707070]">
  Date of Joining
  <span className="block font-lato font-normal text-[20px] leading-6 text-[#002446]">
    {isEditable ? (
      <input
        type="date"
        name="dateOfJoining"
        value={
        //   editedData.dateOfJoining && !isNaN(new Date(editedData.dateOfJoining).getTime())
        //     ? new Date(editedData.dateOfJoining).toISOString().slice(0, 10)
        //     : ""
        // }
        editedData.dateOfJoining
      ? new Date(
          editedData.dateOfJoining.split("/").reverse().join("-") // Convert "DD/MM/YYYY" → "YYYY-MM-DD"
        ).toISOString().slice(0, 10)
      : ""
  }
        onChange={handleChange}
        className="border border-gray-300 rounded"
      />
    ) : (
      profileData.dateOfJoining || "N/A"
    )}
  </span>
</p>


               
                {/* leader */}
                <p className='font-lato font-normal text-[20px] leading-6 text-[#707070]'>Leader
                <span className='block font-lato font-normal text-[20px] leading-6 text-[#002446]'>
                  {isEditable ? (
                    <input
                      type="text"
                      name="teamLeader"
                      value={editedData.teamLeader}
                      onChange={handleChange}
                      className="border border-gray-300 w-40 rounded"
                    />
                  ) : (
                    profileData.teamLeader
                  )}


                </span> </p>


              </div>
              {/* data gender */}
              <div className='flex flex-col gap-5'>
                <p className='font-lato font-normal text-[20px] leading-6 text-[#707070]'>
                  Gender<span className='block font-lato font-normal text-[20px] leading-6 text-[#002446]'>
                   
                  {isEditable ? (
        <select
          name="gender"
          value={editedData.gender}
          onChange={handleChange}
          className=" h-11 bg-[#FFFFFF] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      ) : (
        profileData.gender
      )}
    </span>
                   
         </p>          
                   
                   
                  

                 
                <p className='font-lato font-normal text-[20px] leading-6 text-[#707070]'>Designation
                <span className='block font-lato font-normal text-[20px] leading-6 text-[#002446]'>
                {isEditable ? (
        <select
          name="designation"
          value={editedData.designation}
          onChange={handleChange}
          className=" h-11 bg-[#FFFFFF] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <option value="" disabled selected>
      Select Designation 
    </option>
    <option value="IT Team Leader">IT Team Leader</option>
    <option value="Assignment Team Leader">Assignment Team Leader</option>
    <option value="Finance Team Leader">Finance Team Leader</option>
    <option value="Digital  marketing team Leader">Digital  marketing team Leader</option>
    <option value='IT'>IT</option>
    <option value="UI/UX">UI/UX</option>
    <option value="Front-End">Front-End</option>
    <option value="Back-End">Back-End</option>
    <option value="Research">Research</option>
    <option value="HR">HR</option>
    <option value="Social Media">Social Media</option>
    <option value="Team Leader">Team Leader</option>
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

      ) : (
        profileData.designation
      )}
                </span> </p>
                <p className='font-lato font-normal text-[20px] leading-6 text-[#707070]'>
                Employee Status<span className='block font-lato font-normal text-[20px] leading-6 text-[#002446]'>
                {isEditable ? (
        <select
          name="employeeStatus"
          value={editedData.employeeStatus}
          onChange={handleChange}
          className=" h-11 bg-[#FFFFFF] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
     <option value="" disabled selected>
      Select Employee Status
    </option>
    <option value="Full Time">Full Time</option>
    <option value="Part Time">Part Time</option>
    <option value="Intern">Intern</option>  </select>

      ) : (
        profileData.employeeStatus
      )}
                </span> </p>


              </div>
              {/* department */}
               <div className='flex items-center gap-10'>
                <p className='font-lato font-normal text-[20px] leading-6 text-[#707070]'>Department
                
                <span className='block font-lato font-normal text-[20px] leading-6 text-[#002446]'>
      {isEditable ? (
        <select
          name="department"
          value={editedData.department}
          onChange={handleChange}
          className=" h-11 bg-[#FFFFFF] border border-gray-300 rounded-md px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
         <option value="" disabled selected>
      Select Deparment
    </option>
    <option value="IT Department">IT Department</option>
    <option value="Finance Department">Assignment Department</option>
    <option value="Assignment Department">Finance Department</option>
    <option value="Digital Marketing Department">Digital Marketing Department</option>
</select>
      ) : (
        profileData.department
      )}
    </span>
  </p>
              </div>  
            </div>
          </div>
        </div>
        {/* edit button */}
        <div className='  flex justify-center items-center w-24 h-8  border rounded-xl border-[#A29F9F] '>

        <button
  onClick={isEditable ? handleSave : handleEditToggle}
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
  {isEditable ? "Save" : "Edit"}
</button>

          
        </div>

      </div>
      <div className=' shadow-lg  flex justify-between rounded-[20px] mt-10 p-10 bg-[#FFFFFF]'>

        <div >
          <p className='font-roboto font-bold text-4xl'>Contact Information</p>

          <div className='flex flex-col gap-10'>
            <p className='font-lato font-normal text-[20px] leading-6 text-[#707070] '>Email<span className='block font-lato font-normal text-[20px] leading-6 text-[#002446]'>
              {isEditable ? (
                <input
                  type="text"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                  className="border border-gray-300 p-1 rounded"
                />
              ) : (
                profileData.email
              )}
            </span> </p>
            <p className='font-lato font-normal text-[20px] leading-6 text-[#707070]'>Phone<span className='block font-lato font-normal text-[20px] leading-6 text-[#002446]'>
              {isEditable ? (
                <input
                  type="text"
                  name="contactNumber"
                  value={editedData.contactNumber}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded"
                />
              ) : (
                profileData.contactNumber
              )}
            </span> </p>
            <p className='font-lato font-normal text-[20px] leading-6 text-[#707070]'>Alterate Phone<span className='block font-lato font-normal text-[20px] leading-6 text-[#002446]'>
              {isEditable ? (
                <input
                  type="text"
                  name="alternatePhone"
                  value={editedData.alternatePhone}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded"
                />
              ) : (
                profileData.alternatePhone
              )}

            </span> </p>
            <p className='font-lato font-normal text-[20px] leading-6 text-[#707070]'>Salary<span className='block font-lato font-normal text-[20px] leading-6 text-[#002446]'>
              {isEditable ? (
                <input
                  type="text"
                  name="salary"
                  value={editedData.salary}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded"
                />
              ) : (
                profileData.salary
              )}

            </span> </p>

          </div>
        </div>
        <div className='  flex justify-center items-center w-24 h-8  border rounded-xl border-[#A29F9F] '>
        <button
  onClick={isEditable ? handleSave : handleEditToggle}
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
  {isEditable ? "Save" : "Edit"}
</button>

         
          {isEditable && <button onClick={handleSave}></button>}
        </div>

      </div>
    </div>
    </div>
  )
}

export default EditProfile