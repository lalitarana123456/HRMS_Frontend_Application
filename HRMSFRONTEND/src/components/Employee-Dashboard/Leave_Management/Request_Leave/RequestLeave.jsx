import React, { useState, useEffect, useRef } from "react";
import Policies from "../Policies";
import { FaChevronDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { GoBellFill } from "react-icons/go";
import { AiOutlineSwapRight } from "react-icons/ai";
import LeaveBalance from "../LeaveBalance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../Sidebar/Sidebar";
import { GrAttachment } from "react-icons/gr";

const RequestLeave = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] =
    useState("Select Leave Type");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [fileName, setFileName] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLeaveTypeSelect = (leaveType) => {
    setSelectedLeaveType(leaveType);
    setIsOpen(false);
    setLeaveInfo((prev) => ({
      ...prev,
      leaveType: leaveType,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [leaveInfo, setLeaveInfo] = useState({
    leaveType: "",
    startDate: null,
    endDate: null,
    description: "",
    document: null,
  });

  const handleLeaveChange = (e) => {
    const { name, value } = e.target;
    setLeaveInfo((prev) => ({ ...prev, [name]: value }));
  };

  // const handleDateChange = (date, name) => {
  //   setLeaveInfo((prev) => ({ ...prev, [name]: date }));
  // };

  const handleDateChange = (date, name) => {
    // Create a new date object with the local date adjusted
    const adjustedDate = new Date(date.setHours(0, 0, 0, 0));

    // setLeaveInfo((prev) => ({
    //   ...prev,
    //   [name]: adjustedDate,
    // }));

   
  setLeaveInfo((prev) => {
    if (name === "startDate") {
      return {
        ...prev,
        startDate: adjustedDate,
        endDate: prev.endDate && prev.endDate < adjustedDate ? adjustedDate : prev.endDate,
      };
    } else if (name === "endDate") {
      return {
        ...prev,
        endDate: adjustedDate < prev.startDate ? prev.startDate : adjustedDate,
      };
    }
    return prev;
  });

  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setLeaveInfo((prev) => ({ ...prev, document: files }));
    // if(file)
    // {
    //   setFileName(file.name)
    // }
    if (files.length > 0) {
      const fileNamesArray = Array.from(files).map((file) => file.name);
      setFileName(fileNamesArray);
    } else {
      setFileName([]);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    const { leaveType, startDate, endDate, description, document } = leaveInfo;

    if (!leaveType || !startDate || !endDate || !description) {
      toast.error("Please Fill All The Fields!");
      return;
    }

    // console.log({
    //   leaveType,
    //   startDate: startDate,
    //   endDate: endDate,
    //   description
    // })
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("leaveType", leaveInfo.leaveType);
    formData.append("startDate", leaveInfo.startDate);
    formData.append("endDate", leaveInfo.endDate);
    formData.append("description", leaveInfo.description);
    // formData.append('document', document)
    if (document && document.length > 0) {
      for (let i = 0; i < document.length; i++) {
        formData.append("documents", document[i]);
      }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/create`, formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log(response.data);
      const { message, error } = response.data;

      navigate("/leave");
      if (message) {
        toast.success(message || "Leave Request Submitted Successfully!");
        setLeaveInfo({
          leaveType: "",
          startDate: null,
          endDate: null,
          description: "",
          document: [],
        });
      } else if (error) {
        toast.error(error || "Failed To Submit Leave Request");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("An Error Occured While Submitting The Leave Request!");
      }
      // console.error(err);
    }
  };

  // const maxDate = new Date('2026-12-31');

  return (
    <>
      <div className="w-screen h-screen flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div
          id="main"
          className="flex-grow lg:h-screen bg-[#D5EAE7] lg:overflow-hidden lg:p-6 flex-col"
        >
          <div
            id="header"
            className="lg:w-[90%] lg:h-[33px] lg:mx-auto flex justify-between items-center lg:flex-row flex-col"
          >
            <div className="lg:hidden flex justify-between w-[90%] h-[44px] items-center mb-3 mt-2">
              <Link to="/leave" className="text-3xl">
                <MdOutlineKeyboardArrowLeft />
              </Link>

              <h1 className="font-lato text-xl font-bold">Leave Management</h1>

              <button className="text-2xl">
                <GoBellFill />
              </button>
            </div>

            <div
              id="heading"
              className="lg:w-[368px] lg:h-[48px] lg:text-3xl lg:font-bold lg:font-lato hidden lg:flex items-center gap-4"
            >
              <Link to={"/leave"}>
                <FaArrowLeft className="text-xl" />
              </Link>
              <p>Request Leave</p>
            </div>
            <button className="lg:w-[20%] lg:h-[35px] bg-[#D1FAE5] lg:text-xs lg:font-extrabold text-[#00BC5C] lg:rounded-[15px] w-[90%] h-[31px] lg:mx-0 mx-auto rounded-full text-[10px]">
              <LeaveBalance />
            </button>
          </div>

          <div
            id="infoCard"
            className="lg:w-[90%] lg:h-[90%] bg-[#F5F9F9] mx-auto lg:rounded-[20px] lg:drop-shadow-lg flex flex-col items-center mt-3 w-[95%] max-h-fit rounded-[15px]"
          >
            <form
              className="lg:w-[90%] lg:h-full lg:mx-auto flex items-center lg:mt-5 flex-col w-full h-[100%]"
              onSubmit={handleLeaveSubmit}
            >
              <div
                id="infoHeader"
                className="lg:w-[100%] lg:h-[51px] flex justify-between items-center mt-5 lg:flex-row flex-col md:w-[90%] w-full"
              >
                <div
                  id="leaveType"
                  className="relative lg:w-[45%] w-full md:w-[100%]"
                >
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="lg:w-[100%] lg:rounded-[20px] border border-[#D2D2D2] text-sm font-extrabold font-lato bg-white flex items-center justify-between lg:p-6 px-5 drop-shadow-lg md:w-[100%] w-full h-[40px] rounded-2xl"
                    value={leaveInfo.leaveType}
                  >
                    <p>{selectedLeaveType}</p>
                    <FaChevronDown />
                  </button>

                  {isOpen && (
                    <div
                      ref={dropdownRef}
                      className="lg:absolute lg:w-[100%] flex flex-col text-sm font-extrabold font-lato shadow-lg bg-[#F7F7F7] gap-2"
                    >
                      <button
                        onClick={() => handleLeaveTypeSelect("Maternity Leave")}
                        className="lg:py-3 py-2 bg-[#C8F1DC] mt-2 rounded-2xl flex p-6"
                      >
                        Maternity Leave
                      </button>
                      <button
                        onClick={() => handleLeaveTypeSelect("Sick Leave")}
                        className="lg:py-3 py-2 bg-[#FEF3C7] rounded-2xl flex p-6"
                      >
                        Sick Leave
                      </button>
                      <button
                        onClick={() => handleLeaveTypeSelect("Emergency Leave")}
                        className="lg:py-3 py-2 bg-[#FFDFDB] mb-2 rounded-2xl flex p-6"
                      >
                        Emergency Leave
                      </button>
                      <button
                        onClick={() =>
                          handleLeaveTypeSelect("Bereavement Leave")
                        }
                        className="lg:py-3 py-2 bg-[#F9EBFF] mb-2 rounded-2xl flex p-6"
                      >
                        Bereavement Leave
                      </button>
                      <button
                        onClick={() => handleLeaveTypeSelect("Menstrual Leave")}
                        className="lg:py-3 py-2 bg-[#EAF3FF] mb-2 rounded-2xl flex p-6"
                      >
                        Menstrual Leave
                      </button>
                      <button
                        onClick={() => handleLeaveTypeSelect("Personal Leave")}
                        className="lg:py-3 py-2 bg-[#FFF6E6] mb-2 rounded-2xl flex p-6"
                      >
                        Personal Leave
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 md:flex-row flex-col justify-between items-center lg:w-[45%] lg:h-[51px] md:h-[40px] md:rounded-[20px] md:border md:shadow-lg lg:border-[#D2D2D2] w-full md:mt-4 lg:mt-0 mt-2 bg-white">
                  <div
                    id="startDate"
                    className="md:w-[45%] md:h-[55px] md:border-none border md:bg-transparent border-[#D1D1D1] md:rounded-lg font-lato text-sm font-extrabold p-5 outline-none flex items-center md:justify-center md:shadow-none shadow-lg w-full h-[40px] rounded-full bg-white"
                  >
                    <DatePicker
                      selected={leaveInfo.startDate}
                      onChange={(date) => handleDateChange(date, "startDate")}
                      dateFormat="MMMM - dd - yyyy"
                      className="bg-transparent outline-none md:text-center"
                      minDate={new Date()}
                      // maxDate={maxDate}
                      placeholderText="From"
                    />
                  </div>

                  <AiOutlineSwapRight
                    className="my-auto hidden md:flex text-gray-400"
                    size={30}
                  />

                  <div
                    id="endDate"
                    className="md:w-[45%] md:h-[55px] md:border-none border md:bg-transparent border-[#D1D1D1] md:rounded-lg font-lato text-sm font-extrabold p-5 outline-none flex items-center md:justify-center md:shadow-none shadow-lg w-full h-[40px] rounded-full bg-white"
                  >
                    <DatePicker
                      selected={leaveInfo.endDate}
                      onChange={(date) => handleDateChange(date, "endDate")}
                      dateFormat="MMMM - dd - yyyy"
                      className="bg-transparent outline-none md:text-center"
                      minDate={new Date()}
                      // maxDate={maxDate}
                      placeholderText="To"
                    />
                  </div>
                </div>
              </div>

              <textarea
                name="description"
                className="lg:w-full lg:h-[80%] lg:rounded-2xl border border-[#CCCCCC] lg:mt-7 lg:font-medium font-lato text-black p-5 placeholder:text-[#C1C1C1] placeholder:font-medium outline-none lg:text-lg resize-none h-[146px] text-sm font-normal mt-5 rounded-3xl md:w-[90%] w-full overflow-y-scroll"
                placeholder="Leave A Brief Description."
                maxLength="500"
                value={leaveInfo.description}
                onChange={handleLeaveChange}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              />

              <div className="md:flex w-full h-[30%] md:justify-between md:w-[90%] lg:w-full items-center my-5 lg:my-0">
                <div className="md:w-[60%] h-full lg:flex lg:justify-between">
                  <div className="lg:w-[55%] lg:h-[40%] w-full h-[45px] md:w-[50%] border border-[#CECECE] rounded-[15px] flex justify-center my-auto">
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
                      className="text-black flex items-center gap-2 lg:text-[100%] text-[80%] font-lato font-bold cursor-pointer"
                    >
                      <GrAttachment className="text-xl" />
                      Attach Document(s)
                    </label>
                  </div>

                  <span className="lg:w-[40%] h-full w-[100%] text-[70%]">
                    {fileName.length > 0 && (
                      <p className="w-[100%]">{fileName.join(", ")}</p>
                    )}
                  </span>
                </div>

                <button
                  type="submit"
                  className="lg:w-[25%] lg:h-[40%] bg-black text-white rounded-[15px] font-lato font-bold w-full mt-3 h-[45px] md:w-[30%] md:my-5 lg:text-[100%] text-[80%] text-center"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* <div className='w-[95%] lg:w-[90%] mx-auto lg:mt-10 md:w-[90%] md:mt-10'><Policies /></div> */}
        </div>
        {/* <div className='w-[95%] mx-auto mt-14 lg:hidden'><Policies /></div> */}
      </div>
    </>
  );
};

export default RequestLeave;
