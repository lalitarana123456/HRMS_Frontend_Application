import React, {useState, useEffect, useRef} from 'react'
import { IoSearchOutline, IoFilterOutline } from 'react-icons/io5';
import { RiArrowUpDownLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { MdSaveAs } from "react-icons/md";
import axios from 'axios';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'


const AttendanceTable = ({ selectionDate }) => {

  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState({}); 
  const [editedValues, setEditedValues] = useState({});
  const [isFilter, setIsFilter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setsearchQuery] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const intervalId = useRef(null);
  const [isChecked, setIsChecked] = 
  useState({
      UIUX: false,
      FrontEnd: false,
      BackEnd: false,
      HR: false,
      SocialMedia: false,
      Finance: false,
      Research: false
    }
  );

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  
  const years = [];
  for (let year = 2020; year <= 2030; year++) {
    years.push(year);
  }
  
  const [selectedDate, setSelectedDate] = useState(null);

  const filterToggle = () => 
  {
    setIsFilter(!isFilter)
  }

  const handleToggle = () => 
  {
    setIsOpen(!isOpen);
    console.log(!isOpen);
  }

  const handleChecked = (option) => 
    {
      setIsChecked((prev) => 
      {
        const updatedState = { ...prev, [option]: !prev[option] };
        const selectedDesignations = Object.keys(updatedState).filter((key) => updatedState[key]);
        setSelectedDesignation(selectedDesignations.length ? selectedDesignations : null);
        setCurrPage(1);
        return updatedState;
      });
    };

    const handleStatusChecked = (status) => {
      setIsChecked((prev) => {
        const updatedState = { ...prev, [status]: !prev[status] };
        const selectedStatus = Object.keys(updatedState).filter((key) => updatedState[key]);
        setSelectedStatus(selectedStatus.length ? selectedStatus : null);
        setCurrPage(1);
        return updatedState;
      });
    };
    
  
    const filteredUsers = users.filter((user) => {
      const matchesSearch = searchQuery.length >= 1
        ? (user.employeeName && user.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.designation && user.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.employeeId && user.employeeId.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
    
      const matchesDesignation = selectedDesignation
        ? selectedDesignation.some((designation) => 
            user.designation && user.designation.toLowerCase().includes(designation.toLowerCase())
          )
        : true;
    
        const matchesStatus = selectedStatus
        ? selectedStatus.some((status) =>
          user.status && user.status.toLowerCase().includes(status.toLowerCase())
          )
        : true;
    
      return matchesSearch && matchesDesignation && matchesStatus;
    });
    
      
  

  const [currPage, setCurrPage] = useState(1);
  const recPerPage = 5;
  const lastInd = currPage * recPerPage;
  const firstInd = lastInd - recPerPage;
  const rec = filteredUsers.slice(firstInd, lastInd);
  const npages = Math.ceil(filteredUsers.length / recPerPage);
  const num = [...Array(npages).keys()].map((n) => n + 1);

  const nextPage = () => 
    {
      if (currPage < npages) 
      {
        setCurrPage(currPage + 1);
      }
    };
  
    const prevPage = () => 
    {
      if (currPage > 1) 
      {
        setCurrPage(currPage - 1);
      }
    }; 

  useEffect(() =>
  {
    const getAttendanceData = async () =>
    {
      try
      {
        const response = await axios.get("http://localhost:5000/api/v1/administartive/attendance/records/employee-attendance", {
          params:
          {
            day: selectionDate ? selectionDate.getDate() : "",
            month: selectionDate ? selectionDate.getMonth() + 1 : "",
            year: selectionDate ? selectionDate.getFullYear() : "",
          },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          }
        );
        // console.log(response.data);
        if(response.data.success)
        {
          setUsers(response.data.attendanceRecords);
        }
        else
        {
          toast.error('Failed To Fetch Attendance Data!');
        }
      }
      catch(error)
      {
        toast.error(`Error: ${error.message}`);
      }
    }
    getAttendanceData();

    intervalId.current = setInterval(getAttendanceData, 3000);
    return () => clearInterval(intervalId.current);

  }, [selectionDate]);

  
  const handleEdit = (userId, field) => {
    setEditing((prev) => ({ ...prev, [userId]: field }));
    if (!editedValues[userId]) {
      setEditedValues((prev) => ({
        ...prev,
        [userId]: {
          checkIn: field === 'checkIn' ? users.checkIn : undefined,
          checkOut: field === 'checkOut' ? users.checkOut : undefined,
        },
      }));
    }
  };

  const handleInputChange = (e, userId, field) => {
    const newValue = e.target.value;
    setEditedValues({
      ...editedValues,
      [userId]: {
        ...editedValues[userId],
        [field]: newValue
      }
    });
  };

  const handleTimeUpdate = async (userId, field) => {
    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex((user) => user.objectId === userId);
    updatedUsers[userIndex][field] = editedValues[userId]?.[field] || updatedUsers[userIndex][field];
    
    setUsers(updatedUsers);
    setEditing((prev) => ({ ...prev, [userId]: null })); 
    
    const employeeId = userId;
    const date = updatedUsers[userIndex].date;
  
    // const checkIn = field === 'checkIn' ? editedValues[userId]?.checkIn : updatedUsers[userIndex].checkIn;
    const checkOut = field === 'checkOut' ? editedValues[userId]?.checkOut : updatedUsers[userIndex].checkOut;

    // if (field === 'checkOut' && (!checkOut || checkOut.trim() === '')) {
    //   toast.warn('Please Enter The Checkout Time!');
    //   return;
    // }
    
  
    try {
      const response = await axios.put("http://localhost:5000/api/v1/administartive/attendance/records/update-attendance", {
        employeeId,
        date,
        // checkIn,
        checkOut,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      // console.log("Data being sent to API:", {
      //   employeeId,
      //   date,
      //   checkIn,
      //   checkOut
      // });
      
      if (response.data.success) {
        toast.success('Attendance updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update attendance!');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 400 && error.response.data.message.includes('Check-in record is missing')) {
          toast.error('Check-In Record Is Missing. Cannot Update Check-Out.');
        } else {
          toast.error(`Error: ${error.response.data.message}`);
          // console.log(error)
        }
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const [sortModalVisible, setSortModalVisible] = useState(false);

  const handleSort = () => {
    clearInterval(intervalId.current); 
    const sortedFilteredUsers = [...filteredUsers].sort((a, b) => (a.employeeName || "").localeCompare(b.employeeName || ""));
    setUsers(sortedFilteredUsers);
    setSortModalVisible(false);
  };

  const [date, setDate] = useState("");

  const handleDateChange = (e) => 
  {
    setDate(e.target.value);
  };

  const exportAttendance = async () => {
    try {  
      console.log("Selection Date:", selectionDate);
      const formattedDate = selectionDate 
      ? moment(selectionDate).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");

    console.log("Formatted Date:", formattedDate);
      const response = await axios.get('http://localhost:5000/api/v1/administartive/attendance/records/export-attendance', {
        params: {
          date: formattedDate,
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });
  
      const fileName = response.headers['content-disposition']
        ? response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
        : `Attendance-Report.xlsx`;
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
  
      toast.success('Attendance exported successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Error exporting attendance');
    }
  }; 


  return (
    <div 
    id="table"
    className='lg:w-full lg:h-full lg:rounded-[20px] rounded-[10px] lg:drop-shadow-xl p-2 font-lato drop-shadow-lg bg-white'>

      <div 
      className='lg:w-[98%] flex flex-col gap-5 mx-auto'>

      <h1 
      className='lg:text-2xl text-sm font-semibold'>
        Today's Attendance
      </h1>

      <div 
      id='functionalities' 
      className='flex flex-row justify-between items-center w-full'>

        <div 
        id='searchBar' 
        className='flex w-[70%] lg:h-full h-[80%] bg-white items-center border-[1px] border-[#B7B7B7] p-2 rounded-xl'>
          <IoSearchOutline 
          className='text-lg mr-2' />
          <input 
          type='search' 
          placeholder='Search Employee by Name, ID or Designation' 
          className='w-full outline-none lg:text-[100%] text-[50%]' 
          value={searchQuery}
          onChange={(e) => setsearchQuery(e.target.value)}  />
        </div>

        <div 
        id='sort-filter' 
        className='flex lg:w-[20%] w-[25%] h-[80%] bg-[#F9F9F9] border-[1px] border-[#B7B7B7] rounded-xl lg:gap-0 gap-1'>

          <button 
          id='filter' 
          onClick={filterToggle}
          className='w-[50%] lg:h-full m-auto rounded-md '>
            <IoFilterOutline className='text-xl mx-auto' />
          </button>

          <div className='border-l h-10 border-[#b7B7B7]'></div>

          <button 
          id='sort' 
          onClick={() => setSortModalVisible(!sortModalVisible)}
          className='w-[50%] h-full m-auto rounded-md'>
            <RiArrowUpDownLine className='text-xl mx-auto' />
          </button>

        </div>

      </div>

      {sortModalVisible && (
        <div className="absolute z-50 bg-[#FFFFFF] lg:w-[15%] w-[30%] lg:right-5 lg:top-40 right-2 top-28">
          <p className='lg:h-10 h-7 flex items-center justify-center bg-[#F1F7FF] font-bold lg:text-lg text-[60%]'>Sort</p>
          <button 
          onClick={handleSort} 
          className="w-full p-2 text-black font-lato font-medium lg:text-sm text-[50%]">
            Alphabetically A-Z
          </button>
        </div>
      )}

      {isFilter && (

<div 
className='absolute z-50 bg-[#FFFFFF] lg:w-[60%] w-[80%] top-1/4 left-1/3 lg:top-1/2 lg:left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:p-3 p-2 rounded-lg shadow-lg'>

    <div 
    className='flex flex-row gap-1 h-[50%] p-1'>

      <div 
      className={`relative  lg:h-[40%]   
      ${isOpen ? "rounded-lg" : "rounded-none"} w-[50%]`}>

      <p className='font-lato font-bold lg:text-lg text-[60%] flex items-center justify-center w-full lg:h-10 h-7 text-center'>
      Filter by Department</p>

        <div 
        className={`flex lg:p-2 h-6 px-2 lg:h-10 mb-1
        ${isOpen ? "rounded-t-lg" : "rounded-lg"} w-full 
        ${isOpen ? "bg-custom-gradient" : "bg-[#FFFFFF]"} border-[#EDEDED] border`}>

          <button
          onClick={handleToggle}
          className={`w-full  lg:text-sm text-[50%] text-left font-medium
          ${isOpen ? "text-white" : "text-[#6B6B6B]"}`}  >
            IT - Team
          </button>

          <svg
          onClick={handleToggle}
          className={`cursor-pointer transition-transform 
          ${isOpen ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" />
          </svg>

        </div>

        {(isOpen &&
          
          <div className='gap-1 flex flex-col  rounded-b-lg justify-center p-2 bg-[#FFFFFF]  shadow-lg lg:text-sm text-[50%] mb-1'>
          
            {["Front-End", "Back-End", "UI/UX"].map((designation) => (

              <div key={designation} className='w-full flex justify-between'>

                <label>{designation}</label>
                <input
                type='radio'
                className={`md:w-3 md:h-5 ${isChecked[designation] ? "accent-black" : "accent-gray-50"} cursor-pointer`}
                onClick={() => handleChecked(designation)}
                checked={isChecked[designation]}/>
                
              </div>

            ))}

          </div>
        )}

            <div className='flex flex-col gap-1 w-full m-auto h-[90%]'>

            {["HR", "Social Media", "Finance", "Research"].map((dept) => (

              <div
              key={dept}
              className={`flex w-full lg:h-10 h-6 rounded-lg justify-between p-2 items-center cursor-pointer 
              ${isChecked[dept] ? "bg-custom-gradient" : "bg-[#FFFFFF] "} border border-[#EDEDED]`}>

                <p className='font-lato font-medium lg:text-sm text-[50%] leading-6'>{dept}</p>

                <input
                type='radio'
                className={`md:w-5 md:h-6 ${isChecked[dept] ? "accent-black" : "accent-gray-50"} cursor-pointer`}
                onClick={() => handleChecked(dept)}
                checked={isChecked[dept]}/>

              </div>

            ))}
            </div>

        </div>

            <div className='w-[50%]'>

            <p className='font-lato font-bold lg:text-lg text-[60%] flex items-center justify-center w-full lg:h-10 h-7 text-center'>
            Filter by Year</p>

                    <div className='w-full'>
                      <h1 className='lg:text-[90%] text-[50%]'>Select Month</h1>
                      <select 
                      className='flex w-full lg:h-10 h-6 rounded-lg justify-between p-1 items-center cursor-pointer border text-[50%] border-[#EDEDED] outline-none lg:text-[80%]'
                        value={selectedDate ? selectedDate.getMonth() : ""}
                        onChange={(e) => {
                          const newDate = new Date(selectedDate || new Date());
                          newDate.setMonth(e.target.value);
                          setSelectedDate(newDate);
                        }}
                      >
                        <option value="" disabled>Select Month</option>
                        {months.map((month, index) => (
                          <option key={index} value={index}>{month}</option>
                        ))}
                      </select>
                  </div>

                  <div>
                    <h1 className='lg:text-[90%] text-[50%]'>Select Year</h1>
                    <select 
                    className='flex w-full text-[50%] lg:h-10 h-6 rounded-lg justify-between p-1 items-center cursor-pointer border border-[#EDEDED] outline-none lg:text-[80%]'
                      value={selectedDate ? selectedDate.getFullYear() : ""}
                      onChange={(e) => {
                        const newDate = new Date(selectedDate || new Date());
                        newDate.setFullYear(e.target.value);
                        setSelectedDate(newDate);
                      }}
                    >
                      <option value="" disabled>Select Year</option>
                      {years.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* <div>
                    <p>Selected Date: {selectedDate ? selectedDate.toLocaleString('default', { year: 'numeric', month: 'long' }) : "None"}</p>
                  </div> */}
                
              </div>

      </div>
      <div className='flex flex-col gap-1 w-[50%] h-[90%]'>

        <p className='font-lato font-bold lg:text-lg text-[60%] flex items-center justify-center w-full lg:h-10 h-7 text-center'>
        Filter by Status</p>

            {["Present", "Absent", "Pending checkout"].map((status) => (
        <div key={status} className={`flex w-full lg:h-10 h-6 rounded-lg justify-between p-2 items-center cursor-pointer 
          ${isChecked[status] ? "bg-custom-gradient" : "bg-[#FFFFFF] "} border border-[#EDEDED]`}>

          <p className='font-lato font-medium lg:text-sm text-[50%] leading-6'>{status}</p>

          <input
          type='radio'
          className={`md:w-5 md:h-6 ${isChecked[status] ? "accent-black" : "accent-gray-50"} cursor-pointer`}
          onClick={() => handleStatusChecked(status)}
          checked={isChecked[status]}/>
          
        </div>
        ))}
        </div>

    </div>
)}

      <table 
      className='border-collapse lg:border border-gray-200 lg:rounded-[15px] rounded-lg drop-shadow-lg overflow-hidden bg-white rounded-b-none border-0 w-full'>
            
        <thead 
        className='bg-[#F5F9F9]'>
              
          <tr 
          className='font-lato lg:text-sm text-[8px] lg:font-bold h-14 text-nowrap'>

            {["Name", "Employee ID", "Designation", "Date", "Check-In", "Check-Out", "Working Hour", "Status"].map((item, index) => (
              <th key={index}>{item}</th>
            ))}

          </tr>

        </thead>

            <tbody className='flex-shrink'>

              {rec.length > 0 ?  (
              rec.map((user, index) => (
                
                <tr 
                className='lg:border-b font-lato lg:text-sm lg:font-bold lg:text-[#9C9C9C] text-center h-14 text-[8px] border-y-[1px] lg:border-y-0 border-gray-300'
                key={index}>

                  <td 
                  className=''>
                    <span className='flex items-center flex-col lg:flex-row'>
                      <img 
                      src={user.profilePhoto}
                      alt='' 
                      className='lg:w-[40px] lg:h-[40px] w-[20px] h-[20px] rounded-full border border-black lg:m-2' />
                      {user.employeeName}
                    </span>
                  </td>

                  <td>{user.employeeId}</td>

                  <td>{user.designation}</td>

                  <td>{user.date}</td>

                  <td>
                    {/* {editing[user.objectId] === 'checkIn' ? (
                      <input
                        type="text"
                        value={editedValues[user.objectId]?.checkIn || user.checkIn}
                        onChange={(e) => handleInputChange(e, user.objectId, 'checkIn')}
                        className="w-1/3"
                      />
                    ) : ( */}
                      {user.checkIn}
                    {/* )}
                    <button
                      className="lg:text-xl text-xs"
                      onClick={() => {
                        if (editing[user.objectId] === 'checkIn') {
                          handleTimeUpdate(user.objectId, 'checkIn');
                        } else {
                          handleEdit(user.objectId, 'checkIn');
                        }
                      }}
                    >
                      {editing[user.objectId] === 'checkIn' ? <MdSaveAs /> : <MdModeEdit />}
                    </button> */}
                  </td>

                  <td>
                    {editing[user.objectId] === 'checkOut' ? (
                      <input
                        type="text"
                        value={editedValues[user.objectId]?.checkOut || ""}
                        onChange={(e) => handleInputChange(e, user.objectId, 'checkOut')}
                        className="lg:w-[65px] lg:border-[2px] border-[1px] border-black outline-none w-[90%] lg:rounded-md rounded-sm relative"
                      />
                    ) : (
                      user.checkOut
                    )}
                    <button
                      className="lg:text-xl text-xs lg:ml-1 ml-3 md:ml-1 absolute block md:inline"
                      onClick={() => {
                        if (editing[user.objectId] === 'checkOut') {
                          handleTimeUpdate(user.objectId, 'checkOut');
                        } else {
                          // if (user.checkOut.trim() !== '') 
                          // {
                            handleEdit(user.objectId, 'checkOut');
                          // }
                        }
                      }}
                    >
                      {editing[user.objectId] === 'checkOut' ? <MdSaveAs /> : <MdModeEdit />}
                    </button>
                  </td>


                  <td>{user.totalWorkingHours}</td>

                  <td>
                    <span className={`w-[80%] px-1 lg:py-1 mx-auto border-[1px] lg:rounded-md rounded-sm lg:text-xs text-[7px] flex items-center justify-center
                      ${user.status == "Present" ? "bg-[#BCFFD9] text-[#27AE60]" : ""}
                       ${user.status == "Absent" ? "bg-[#FFCBC4] text-[#D9432F]" : ""}
                        ${user.status == "Pending checkout" ? "bg-[#FFF3CC] text-[#ED8500]" : ""}`}>{user.status}</span>
                  </td>

                  <td>
                  </td>

                </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="font-lato font-bold text-xs text-[#C1C1C1] text-center py-4">
                              No Data Available!
                            </td>
                          </tr>
                        )}

            </tbody>
           

          </table>

          <nav className='flex justify-center text-[50%] lg:text-[100%]'>
          <button onClick={prevPage} disabled={currPage === 1} className='px-4 py-1 mx-1 disabled:opacity-50'><FaAngleLeft/></button>
          {num.map((n) => (
            <button
              key={n}
              onClick={() => setCurrPage(n)}
              className={`lg:px-4 px-2 lg:py-2 py-1 mx-1 rounded-full ${currPage === n ? 'bg-[#E8EDF2]' : ''}`}
            >
              {n}
            </button>
          ))}
          <button onClick={nextPage} disabled={currPage === npages} className='px-4 py-2 mx-1  disabled:opacity-50'><FaAngleRight/></button>
        </nav>

        <button 
        onClick={exportAttendance}
        className='lg:w-[20%] lg:h-[40px] h-[20px] lg:text-sm text-nowrap text-[8px] lg:rounded-md rounded-[4px] absolute lg:bottom-3 right-2 lg:right-4 text-white text-left font-semibold lg:p-2 p-1 bg-[#60A5FA] hover:text-[#60A5FA] hover:bg-[#F2F2F2]'>Export Attendance</button>
          </div>

    </div>
  )
}

export default AttendanceTable