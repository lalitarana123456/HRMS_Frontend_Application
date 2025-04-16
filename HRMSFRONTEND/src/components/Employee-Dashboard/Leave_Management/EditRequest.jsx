import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { FaArrowLeft } from 'react-icons/fa6';
import { RiCloseLargeFill } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GrAttachment } from "react-icons/gr";


const EditRequest = ({dataId}) => {

  const [action, setAction] = useState('edit');
  const [isVisible, setIsVisible] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState('Select Leave Type');
  const dropdownRef = useRef(null);
  const navigate = useNavigate()
  const [fileName, setFileName] = useState([])

  const toggleDropdown = () => 
  {
    setIsOpen(!isOpen);
  };

  const handleLeaveTypeSelect = (leaveType) => 
  {
    setSelectedLeaveType(leaveType);
    setIsOpen(false);
    setLeaveInfo((prev) => 
    ({
      ...prev,
      leaveType: leaveType,
    }));
  };

  const handleModify = () => setAction('modify');
  const handleCancle = () => setAction('cancle');
  const backToEdit = () => setAction('edit');
  
  const confirmation = () => 
  {
    // setAction('confirmation');
    handleDeleteRequest();
  };

  const closePopup = () => 
  {
    setIsVisible(false);
    // navigate("/leave")
  };

  const handleClick = (e) => 
  {
    if (e.target.id === 'main') 
    {
      closePopup();
    }
  };

  // const { leaveId } = useParams();
  // console.log(leaveId);
  // const { Id } = useParams();
  const [leaveInfo, setLeaveInfo] = useState
  ({
    leaveType: '',
    startDate: null,
    endDate: null,
    document: null,
  });

  const handleFileChange = (e) =>
    {
      const files = e.target.files;
      setLeaveInfo((prev) => ({...prev, document: files}));
      // if(file)
      // {
      //   setFileName(file.name)
      // }
      if(files.length > 0)
      {
        const fileNamesArray = Array.from(files).map(file => file.name); 
        setFileName(fileNamesArray);
      }
      else
      {
        setFileName([])
      }
    };

  const handleEditRequest = async (e) => 
  {
    e.preventDefault();
    const { leaveType, startDate, endDate, document } = leaveInfo;

    if (!leaveType || !startDate || !endDate) 
    {
      toast.error('Please Fill All The Fields!');
      return;
    }
    console.log
    ({
      leaveType,
      startDate: startDate,
      endDate: endDate,
    });

    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('leaveType', leaveInfo.leaveType);
    formData.append('startDate', leaveInfo.startDate);
    formData.append('endDate', leaveInfo.endDate);
    // formData.append('document', document)
    if(document && document.length > 0)
    {
      for (let i = 0; i < document.length; i++)
      {
        formData.append('documents', document[i]);
      }
    }

    if (!token) 
    {
      toast.error('You are not authorized. Please log in.');
      return;
    }

    try 
    {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/modify/?leaveId=${dataId}`,
        {
          leaveType: leaveInfo.leaveType,
          startDate: leaveInfo.startDate,
          endDate: leaveInfo.endDate,
        },
        {
          headers: 
          {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',

          },
        }
      );
      const {message, error} = response.data;
      // navigate("/leave")
      closePopup();
      if (message) 
      {
        toast.success(message || 'Leave Request Updated Successfully!');
        setLeaveInfo({ leaveType: '', startDate: null, endDate: null, document: []});
      } else 
      {
        toast.error(error || 'Failed To Update Leave Request!');
      }
    } catch (err) 
    {
        if(err.response && err.response.data && err.response.data.error)
        {
          toast.error(err.response.data.error);
        }
        else
        {
          toast.error("An Error Occured While Submitting The Leave Request!");
        }
        // console.error(err);
    }
  };

    const handleDeleteRequest = async () => 
    {
      const token = localStorage.getItem('token');
      if (!token) 
      {
        toast.error("You Are Not Authorized, Please Log-In!");
        return;
      }
  
      try 
      {
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/cancel?leaveId=${dataId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const {message, error} = response.data;
        if (message) 
        {
          toast.success("Leave Request Cancelled Successfully!");
          closePopup()
        } 
        else 
        {
          toast,error(error);
        }
      } 
      catch (err) 
      {
        console.error("Error deleting leave request:", err.response || err);
        if (err.response) 
        {
          toast.error(`Error: ${err.response.data.error}`);
        } 
        else 
        {
          toast.error("An unexpected error occurred!");
        }
      }
    };


  const handleDateChange = (date, name) => 
  {
    setLeaveInfo((prev) => ({ ...prev, [name]: date }));
  };

  return (
    
    isVisible && (
      <div
      id="main"
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50"
      onClick={handleClick}>

        {action === 'edit' && (
          <div
          id="edit"
          className="lg:w-[30%] lg:h-[15%] w-[90%] h-[10%] rounded-3xl flex justify-center gap-10  bg-white md:w-[50%] md:h-[10%] px-7">
            
            {/* <button
            onClick={handleModify}
            className="lg:bg-custom-gradient rounded-3xl font-lato lg:font-medium lg:text-2xl lg:px-1 text-[10px] font-extrabold">
              <span className="flex lg:px-14 px-10 rounded-2xl bg-white p-2 lg:border-none border border-black">Modify</span>
            </button> */}


            <button
            onClick={handleModify}
            className="lg:text-lg w-[50%] h-[50%] border-2 my-auto text-sm"
            style={{
              // borderRadius: '0.375rem',
              borderImageSource: 'linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)',
              borderImageSlice: 1,
            }}>
            Modify
          </button>

            <button
            onClick={handleCancle}
            className="lg:text-lg w-[50%] h-[50%] border-2 text-[#DD5A49] border-[#DD5A49] my-auto text-sm text-nowrap">
              Cancel Request
            </button>
          
          </div>
        )}

        {action === 'modify' && (
          
          <form
          onSubmit={handleEditRequest}
          id="modify"
          className="lg:w-[35%] lg:h-[70%] h-[45%] w-[90%] bg-white rounded-3xl flex flex-col justify-center items-center gap-5 relative md:w-[50%] md:h-[30%]">
            
            <button
            onClick={backToEdit}
            className="absolute lg:top-4 lg:left-5 top-2 left-2">
              <FaArrowLeft className='lg:text-lg text-lg'/>
            </button>

            <div id="leaveType" className="w-[90%]">
              
              <button
              type="button"
              onClick={toggleDropdown}
              className="w-full lg:h-[41px] h-[31px] rounded-[20px] border border-[#D2D2D2] text-[10px] lg:text-base font-medium lg:font-extrabold font-lato bg-white flex items-center justify-between p-6 drop-shadow-lg"
              value={leaveInfo.leaveType}>
                <p>{selectedLeaveType}</p>
                <FaChevronDown />
              </button>

              {isOpen && (

                <div
                ref={dropdownRef}
                className="absolute w-[90%] max-h-full overflow-y-scroll flex flex-col lg:text-base text-[10px] font-medium lg:font-extrabold font-lato shadow-lg bg-[#F7F7F7] gap-2 z-10"
                style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                  
                  <button
                  onClick={() => handleLeaveTypeSelect('Maternity Leave')}
                  className="lg:py-3 py-3 bg-[#C8F1DC] mt-2 rounded-2xl flex p-6">
                    Maternity Leave
                  </button>
                  
                  <button
                  onClick={() => handleLeaveTypeSelect('Sick Leave')}
                  className="lg:py-3 py-3 bg-[#FEF3C7] rounded-2xl flex p-6">
                    Sick Leave
                  </button>

                  <button
                  onClick={() => handleLeaveTypeSelect('Emergency Leave')}
                  className="lg:py-3 py-3 bg-[#FFDFDB] mb-2 rounded-2xl flex p-6">
                    Emergency Leave
                  </button>

                  <button 
                  onClick={() => handleLeaveTypeSelect("Bereavement Leave")} 
                  className="lg:py-3 py-3 bg-[#F9EBFF] mb-2 rounded-2xl flex p-6">
                    Bereavement Leave
                  </button>

                  <button 
                  onClick={() => handleLeaveTypeSelect("Menstrual Leave")} 
                  className="lg:py-3 py-3 bg-[#EAF3FF] mb-2 rounded-2xl flex p-6">
                    Menstrual Leave
                  </button>

                  <button 
                  onClick={() => handleLeaveTypeSelect("Personal Leave")} 
                  className="lg:py-3 py-3 bg-[#FFF6E6] mb-2 rounded-2xl flex p-6">
                    Personal Leave
                  </button>

                </div>

              )}

            </div>

            <div 
            className="flex w-[90%] lg:h-[20%] h-[51px] rounded-xl bg-black items-center justify-between px-2">

              <p 
              className="text-white font-lato lg:text-sm text-[10px] lg:font-extrabold font-medium">
                Change Dates:{' '}
              </p>

              <div
              id="startDate"
              className="lg:w-[40%] lg:h-[70%] w-[40%] h-[30%] border border-[#D1D1D1] rounded-lg font-lato text-[9px] font-extrabold p-4 outline-none flex items-center justify-between shadow-lg bg-white lg:text-xs lg:ml-0 mr-1">
                <DatePicker
                selected={leaveInfo.startDate}
                onChange={(date) => handleDateChange(date, 'startDate')}
                dateFormat="MMMM - dd - yyyy"
                className="bg-transparent outline-none"
                minDate={new Date()}
                placeholderText="From"/>
              </div>

              <div
              id="endDate"
              className="lg:w-[40%] lg:h-[70%] w-[40%] h-[30%] border border-[#D1D1D1] rounded-lg font-lato text-[9px] font-extrabold p-4 outline-none flex items-center justify-between shadow-lg bg-white lg:text-xs">
                <DatePicker
                selected={leaveInfo.endDate}
                onChange={(date) => handleDateChange(date, 'endDate')}
                dateFormat="MMMM - dd - yyyy"
                className="bg-transparent outline-none"
                minDate={new Date()}
                placeholderText="To"/>
              </div>

            </div>

                      <div
                      className='lg:w-[100%] lg:h-[20%] w-[100%] h-[20%] flex flex-col items-center'>
                      
                      <div 
                      className="border lg:w-[50%] lg:h-[75%] w-[50%] h-[60%] border-[#CECECE] rounded-[15px] flex justify-center mb-1">
                        <input
                        type="file"
                        id="file-upload"
                        name="document"
                        onChange={handleFileChange}
                        multiple
                        className="hidden"
                        />
            
                        <label
                        htmlFor="file-upload"
                        className="text-black flex items-center gap-2 lg:text-[100%] text-nowrap md:text-[65%] text-[80%] font-lato font-bold cursor-pointer"
                        >
                          <GrAttachment className="text-xl" />
                          Attach Document(s)
                        </label>
                      </div>
            
                      <span className='text-[60%] text-center'>
                        {fileName.length > 0 && (
                            <p className=''>{fileName.join(', ')}</p>
                          )}
                        </span>
            
                      </div>

            <button
            type="submit"
            className="lg:w-[40%] lg:h-[15%] lg:text-lg w-[30%] h-[41px] text-[10px] bg-black text-white font-lato rounded-lg">
              Submit
            </button>

          </form>

        )}

        {action === 'cancle' && (
          
          <form 
          className="lg:w-[30%] lg:h-[35%] w-[90%] h-[25%]  rounded-3xl flex justify-center lg:gap-28 gap-14 lg:p-8  bg-white items-center flex-col relative md:w-[50%] md:h-[20%]">
            
            <h1 className="rounded-3xl font-lato font-medium lg:text-lg text-lg px-1">
              Are You Sure?
            </h1>

            <button
            onClick={backToEdit}
            className="absolute lg:top-4 lg:right-14 top-7 right-9">
              <RiCloseLargeFill />
            </button>

            <div className="flex gap-32">

              <button
              type='button'
              onClick={confirmation}
              className="border-2 border-[#009A57] lg:px-6 px-5 lg:py-2 py-1 rounded-2xl lg:text-base text-[10px] text-[#009A57]">
                Yes
              </button>

              <button
              type='button'
              onClick={closePopup}
              className="border-2 border-[#D9432F] lg:px-6 px-5 lg:py-2 py-1 rounded-2xl lg:text-base text-[10px] text-[#D9432F]">
                No
              </button>

            </div>

          </form>

        )}

        {/* {action === 'confirmation' && (
          
          <div className="lg:w-[30%] lg:h-[15%] w-[90%] h-[5%] rounded-3xl flex justify-center gap-28 p-8 bg-white items-center">
            
            <p className="font-lato lg:text-2xl text-lg">
              Your Request Has Been Cancelled!
            </p>

          </div>

        )} */}

      </div>

    )
  );
};

export default EditRequest;

