import React, { useEffect, useRef, useState } from 'react';
import { RiArrowUpDownFill } from "react-icons/ri";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { GoDotFill } from "react-icons/go";
import { FaArrowLeft, FaArrowsUpDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import axios from 'axios';
import Button, { Apply } from './Button/Button';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from '../Sidebar/Sidebar';

const Payroll = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [payslip, setPayslip] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [filterTable, setFilterTable] = useState([]);

  const filterPanelRef = useRef(null);


  // Fetch API data
  const getApiData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/payslips/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayslip(res.data.data);
        setFilterTable(res.data.data);
      } catch (error) {
        console.error("Error fetching API:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Token not found in local storage");
    }
  };

  // useEffect(() => {
  //   // Fetch data when the component mounts
  //   getApiData();
  // }, []);

  useEffect(() => {
    getApiData();
    const handleClickOutside = (event) => {
      // Check if the dropdown exists and the click was outside it
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFilterVisible(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup: remove the listener when the component unmounts or when isOpen changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  const recPerPage = 6;
  const lastInd = currPage * recPerPage;
  const firstInd = lastInd - recPerPage;
  const rec = filterTable.slice(firstInd, lastInd);
  const npages = Math.ceil(filterTable.length / recPerPage);
  const num = [...Array(npages).keys()].map((n) => n + 1);

  const nextPage = () => {
    if (currPage < npages) setCurrPage(currPage + 1);
  };

  const prevPage = () => {
    if (currPage > 1) setCurrPage(currPage - 1);
  };

  const formatYear = (date) => (date ? date.getFullYear() : "");
  const formatMonthName = (date) =>
    date ? date.toLocaleString("default", { month: "long" }) : "";

  const reset = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setFilterTable(payslip);
    setCurrPage(1);
  };

  // Toggle filter panel visibility
  const toggleFilter = () => {
    if (isFilterVisible) {
      setIsFilterVisible(false);
      setIsOpen(false);
    } else {
      setIsFilterVisible(true);
      setIsOpen(true);
    }
  };

  // Apply filter based on selected month and year
  const filter = () => {
    if (!selectedMonth && !selectedYear) {
      setFilterTable(payslip);
      setCurrPage(1);
      return;
    }
    const filteredData = payslip.filter((item) => {
      const itemDate = new Date(item.payrollRuns);
      const matchesMonth =
        selectedMonth === null ||
        itemDate.getMonth() === selectedMonth.getMonth();
      const matchesYear =
        selectedYear === null ||
        itemDate.getFullYear() === selectedYear.getFullYear();

      return matchesMonth && matchesYear;
    });
    setFilterTable(filteredData);
    setCurrPage(1);
  };

  // PDF Export function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Payroll Data", 14, 10);

    const tableColumn = [
      "payrollRuns",
      "payType",
      "deductions",
      "hourlyRate",
      "grossSalary",
      "Action",
    ];
    const tableRows = [];

    filterTable.forEach((item) => {
      const rowData = [
        item.payrollRuns || "N/A",
        item.payType || "N/A",
        item.deductions || "N/A",
        item.hourlyRate || "N/A",
        item.grossSalary || "N/A",
        item.status || "N/A",
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("PayRollData.pdf");
  };

  const downloadPayslip = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/payslips/download-pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const file = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = 'payslip.pdf';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading the payslip:', error);
    }
  };

  return (
    <div className='w-[100%] flex md:h-screen bg-[#D5EAE7] min-h-screen md:gap-5  overflow-y-auto  scrollbar-thin scrollbar-thumb-black scrollbar-track-black'
    // onClick={() => {
    //   setIsOpen(false)
    //   setIsFilterVisible(false);
    // }}
    >
      <Sidebar />

      <div className='md:pr-20  md:p-10 p-2 w-[100%]  md:h-screen min-h-screen flex-shrink h-full  '
      >

        <div className='flex  '>
          {/* <button className='md:hidden'>
           <FaArrowLeft />
        </button> */}
          <div className='flex   justify-between    p-2 md:p-0 w-[100%] md:w-full '>

            <div className='md:hidden flex w-[100%]  justify-center   items-center  -mt-2'>
              <p className='md:hidden text-center m-auto  w-[100%] font-lato font-bold md:text-[40px] md:leading-[48px] text-[20px] leading-6'>
                Payroll & Slip
                {/* <span className='font-lato font-bold text-2xl hidden md:block text-[#8B8B8B]'>November 2024</span> */}
              </p>
              {/* <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 18.77v-1h1.616V9.845q0-1.96 1.24-3.447T11 4.546V4q0-.417.291-.708q.291-.292.707-.292t.709.292T13 4v.546q1.904.365 3.144 1.853t1.24 3.447v7.923H19v1zm6.997 2.615q-.668 0-1.14-.475t-.472-1.14h3.23q0 .67-.475 1.142q-.476.472-1.143.472"/></svg>
          </div> */}
            </div>
            <p className=' hidden md:block  font-lato font-bold md:text-[40px] md:leading-[48px] text-[20px] leading-6'>
              Payroll and Payslip
              <span className='font-lato font-bold text-2xl hidden md:block text-[#8B8B8B]'>    {`${formatMonthName(selectedMonth)} ${formatYear(selectedYear)}`}</span>
            </p>
            {/* 
          <div className=' flex justify-end gap-2 items-center  md:hidden'>
            <FaSearch />
            <FaBell />

          </div> */}

            <div className=' md:justify-end hidden md:flex gap-4 '>



              <div className='md:gap-4 gap-2 md:flex flex justify-end  w-[100%] '>
                <button
                  onClick={() => exportToPDF(rec)}
                  className=' shadow-xl w-[89px] h-9  md:w-32 md:h-11 rounded-2xl border bg-[#F0FFFC] text-[10px] md:text-sm text-center font-extrabold'>
                  Export
                </button>
                <button
                  onClick={downloadPayslip}
                  className=' shadow-xl w-[89px] h-9  md:w-32 md:h-11 rounded-2xl border text-[10px] bg-custom-gradient text-[#FFFFFF] md:text-sm text-center font-extrabold'>
                  Pay Slips
                </button>
              </div>

              {/* <Button /> */}

            </div>
          </div>
        </div>
        {/* serach */}
        <div className='  absolute  right-8 md:right-16   gap-1 md:flex  md:justify-end mt-14   md:mt-4 md:pr-20'>
          <button
            onClick={toggleFilter}>

            <svg
              className=''
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" transform="rotate(90)">
              <path fill="currentColor" d="M6 9.5A2 2 0 0 1 7.937 11H13.5a.5.5 0 0 1 .09.992L13.5 12l-5.563.001a2 2 0 0 1-3.874 0L2.5 12a.5.5 0 0 1-.09-.992L2.5 11h1.563A2 2 0 0 1 6 9.5m0 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2m4-8A2 2 0 0 1 11.937 4H13.5a.5.5 0 0 1 .09.992L13.5 5l-1.563.001a2 2 0 0 1-3.874 0L2.5 5a.5.5 0 0 1-.09-.992L2.5 4h5.563A2 2 0 0 1 10 2.5m0 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2" /></svg>
            {/* <RiArrowUpDownFill /> */}

          </button>
        </div>
        {isFilterVisible && (
          <div
            ref={filterPanelRef}
            className="absolute  z-10 md:ml-[30%]   md:top-40 md:w-[30%] w-[90%]   h-auto md:p-5  "
          >



            {isOpen && (
              <div className='bg-white w-[100%] z-10 relative md:-mt-14   h-[40%]  lg:w-[90%] md:w-[100%] md:h-96 md:ml-[98%] xl:ml-[50%] xxl:ml-[60%]   lg:ml-[40%] rounded-b-3xl rounded-s-3xl '>
                <div className='flex justify-between items-center  h-6 p-5  pt-10  mt-24 md:mt-1'>
                  <p className='font-inter text-[20px] font-normal leading-[24.2px] '> Filter Payroll Records</p>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setIsFilterVisible(false);

                    }} className=''>
                    <svg
                      className='md:text-black text-red-600'
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" /></svg>
                  </button>
                </div>

                <div className='flex flex-col gap-3 w-full md:-mt-0 '>
                  <div className='mt-2 flex flex-col w-full gap-3 m-auto'>
                    <laber className="font-inter text-[16px] font-normal leading-[19.36px] text-[#9C9C9C] ml-4 ">Select Month</laber>
                    <DatePicker
                      selected={selectedMonth}
                      onChange={(date) => setSelectedMonth(date)}
                      dateFormat="MMMM"
                      showMonthYearPicker
                      showMonthDropdown

                      customInput={
                        <input
                          value={formatMonthName(selectedMonth)}
                          readOnly

                          className="p-3 text-base border ml-4 border-gray-300 rounded-md w-[90%] md:w-[90%] md::text-sm md:p-4"
                        />
                      }
                    />

                  </div>

                  <div className='m-auto w-full mt-2 flex flex-col  gap-3  '>
                    <laber className="font-inter text-[16px] font-normal ml-4 leading-[19.36px] text-[#9C9C9C]  ">Select Year</laber>

                    <DatePicker
                      selected={selectedYear}
                      onChange={(date) => setSelectedYear(date)}
                      dateFormat="yyyy"
                      showYearPicker
                      customInput={
                        <input
                          value={formatYear(selectedYear)}
                          readOnly
                          className="p-3 text-base border ml-4 border-gray-300 rounded-md w-[90%] md:w-[90%]  md:text-sm md:p-4"

                        />
                      }
                    />
                  </div>
                </div>

                {/* button */}
                <div className='md:flex  md:flex-row flex flex-col items-center p-4 justify-center gap-4 md:p-10 md:mt-5 md:justify-end'>
                  <Apply
                    onClick={reset}
                    name="Reset" backGround="bg-white" text="text-black" border="border border-[#999999]" />

                  <Apply
                    onClick={filter}
                    name="ApplyFilter " backGround="bg-black" text="text-white" />
                </div>

              </div>
            )}

          </div>
        )}


        {/* <button><HiMiniBars3BottomLeft /></button> */}

        <div className='md:hidden w-[100%] h-screen     mt-0  scrollbar-thin scrollbar-thumb-black scrollbar-track-black '>

          {/* pay buttton */}
          <div className='  flex justify-between items-center    md:hidden mt-1 md:mt-0  gap-1 md:gap-4'>
            <span className='font-lato font-bold text-sm  w-[40%] p-1 md:hidden text-[#8B8B8B]'>    {`${formatMonthName(selectedMonth)} ${formatYear(selectedYear)}`}</span>

            <div className='md:gap-4 gap-2 flex justify-end w-[98%] '>
              <button
                onClick={() => exportToPDF(rec)}
                className=' shadow-xl w-24 h-9 leading-[14.4px]  md:w-32 md:h-11 rounded-2xl border bg-[#F0FFFC] text-[12px] md:text-sm text-center font-bold'>
                Export
              </button>
              <button
                onClick={downloadPayslip}
                className=' shadow-xl  w-24 h-9 leading-[14.4px] md:w-32 md:h-11 rounded-2xl border text-[12px] bg-custom-gradient text-[#FFFFFF] md:text-sm text-center font-bold'>
                Pay Slips
              </button>
            </div>


            {/* <Button /> */}

          </div>

          {/* card mobile views */}
          {/* <div className=' md:hidden w-[100%] h-screen  p-0 m-0   '> */}

          <div className=' m-auto  mt-14 w-[100%]'>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="loader"></div>
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : filterTable && filterTable.length > 0 ? (
              filterTable.map((data, index) => (
                <div
                  key={index}
                  className="bg-[#FFFFFF] h-32 shadow-lg mt-5 p-2 rounded-xl w-[100%] border-2 border-green-200"
                >
                  <p className="font-lato pt-4 text-[14px] leading-[19.2px] font-normal">
                    {data.payrollRuns}
                  </p>
                  <div className="flex justify-between items-center pt-1">
                    <p className="font-lato text-[14px] text-[#000000] leading-[16.2px] font-normal opacity-40">
                      {data.payType}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-6 justify-between">
                    <div className="flex gap-4">
                      <span className="font-lato text-[14px] text-[#000000] leading-[16.2px] font-normal">
                        Earnings:
                        <span className="font-lato text-[12px] text-[#27AE60] leading-[16.2px] font-normal">
                          {data.grossSalary / 1000}k
                        </span>
                      </span>
                      <span className="font-lato text-[14px] text-[#000000] leading-[16.2px] font-normal">
                        Deductions:
                        <span className="font-lato text-[12px] text-[#AE2C27] leading-[16.2px] font-normal">
                          {data.deductions}/-
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center">
                      {data.status === "Paid" && (
                        <span className="text-green-600 text-[10px] font-bold">
                          <GoDotFill />
                        </span>
                      )}
                      {data.status === "Unpaid" && (
                        <span className="text-red-600 text-[10px] font-bold">
                          <GoDotFill />
                        </span>
                      )}
                      {data.status === "Half Paid" && (
                        <span className="text-blue-700 text-[10px] font-bold">
                          <GoDotFill />
                        </span>
                      )}
                      {data.status === "Holiday" && (
                        <span className="text-yellow-600 text-[10px] font-bold">
                          <GoDotFill />
                        </span>
                      )}
                      <p className="font-lato text-[16px] leading-[19.2px] text-[#CFCFCF] font-bold">
                        {data.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Data is not available...</p>

            )}

          </div>

          {/* </div> */}

        </div>





        <div className='w-[100%] h-fit hidden md:block m-auto mt-14 flex-shrink  '>
          <table className='w-[100%]' border="1">
            <thead className='w-48'>
              <tr className='h-14 bg-[#EDEDED]'>
                <th className='w-48 '><div className='flex justify-center gap-1 items-center text h-14 font-bold text-black '>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none">
                    <path stroke="currentColor" strokeWidth="1.5" d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z" />
                    <path stroke="currentColor" sstrokeLinecap="round" strokeWidth="1.5" d="M7 4V2.5M17 4V2.5M2.5 9h19" />
                    <path fill="currentColor" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0" /></g></svg>
                  <span className='text-[#686868] text-lg'>Payroll Runs</span></div></th>
                <th className='w-48'><div className='  text-black flex justify-center gap-2 items-center text-lg font-bold  h-14'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M8 13c-1.86 0-3.41 1.28-3.86 3H2v2h2.14c.45 1.72 2 3 3.86 3s3.41-1.28 3.86-3H22v-2H11.86c-.45-1.72-2-3-3.86-3m0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2M19.86 6c-.45-1.72-2-3-3.86-3s-3.41 1.28-3.86 3H2v2h10.14c.45 1.72 2 3 3.86 3s3.41-1.28 3.86-3H22V6zM16 9c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2" /></svg>
                  <span className='text-[#686868] text-lg'>Pay Type</span></div></th>
                <th className='w-48'><div className='flex justify-center gap-2 items-center text-lg font-bold text-black h-14'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 26"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M4 13a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1" /><path d="M13 24c6.075 0 11-4.925 11-11S19.075 2 13 2S2 6.925 2 13s4.925 11 11 11m0 2c7.18 0 13-5.82 13-13S20.18 0 13 0S0 5.82 0 13s5.82 13 13 13" /></g></svg>
                  <span className='text-[#686868] text-lg'>Deductions</span></div></th>
                <th className='w-48'><div className='flex justify-center gap-2 items-center text-lg font-bold text-black h-14'><svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 256 256"><path fill="currentColor" d="M128 88a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m112-96H16a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h224a8 8 0 0 0 8-8V64a8 8 0 0 0-8-8m-46.35 128H62.35A56.78 56.78 0 0 0 24 145.65v-35.3A56.78 56.78 0 0 0 62.35 72h131.3A56.78 56.78 0 0 0 232 110.35v35.3A56.78 56.78 0 0 0 193.65 184M232 93.37A40.8 40.8 0 0 1 210.63 72H232ZM45.37 72A40.8 40.8 0 0 1 24 93.37V72ZM24 162.63A40.8 40.8 0 0 1 45.37 184H24ZM210.63 184A40.8 40.8 0 0 1 232 162.63V184Z" /></svg>
                  <span className='text-[#686868] text-lg'>Earnings</span></div></th>
                <th className='w-48'><div className='flex justify-center gap-2 items-center text-lg font-bold text-black h-14 '><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" sstrokeLinecap="round" strokeWidth="1.5"><path d="M3.172 20.828C4.343 22 6.229 22 10 22h4c3.771 0 5.657 0 6.828-1.172S22 17.771 22 14c0-1.17 0-2.158-.035-3m-1.137-3.828C19.657 6 17.771 6 14 6h-4C6.229 6 4.343 6 3.172 7.172S2 10.229 2 14c0 1.17 0 2.158.035 3M12 2c1.886 0 2.828 0 3.414.586S16 4.114 16 6M8.586 2.586C8 3.172 8 4.114 8 6" /><path d="M12 17.333c1.105 0 2-.746 2-1.666S13.105 14 12 14s-2-.746-2-1.667c0-.92.895-1.666 2-1.666m0 6.666c-1.105 0-2-.746-2-1.666m2 1.666V18m0-8v.667m0 0c1.105 0 2 .746 2 1.666" /></g>
                </svg><span className='text-[#686868] text-lg'>Total Pay</span></div></th>
                <th className='w-48'><div className='flex justify-center gap-2 items-center text-lg font-bold text-black h-14'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m21.6 23l-3.075-3.05q-.45.275-.962.413T16.5 20.5q-1.65 0-2.825-1.175T12.5 16.5t1.175-2.825T16.5 12.5t2.825 1.175T20.5 16.5q0 .575-.15 1.088t-.425.962L23 21.6zM5.5 20.5q-1.65 0-2.825-1.175T1.5 16.5t1.175-2.825T5.5 12.5t2.825 1.175T9.5 16.5t-1.175 2.825T5.5 20.5m0-2q.825 0 1.412-.587T7.5 16.5t-.587-1.412T5.5 14.5t-1.412.588T3.5 16.5t.588 1.413T5.5 18.5m11 0q.825 0 1.413-.587T18.5 16.5t-.587-1.412T16.5 14.5t-1.412.588T14.5 16.5t.588 1.413t1.412.587m-11-9q-1.65 0-2.825-1.175T1.5 5.5t1.175-2.825T5.5 1.5t2.825 1.175T9.5 5.5T8.325 8.325T5.5 9.5m11 0q-1.65 0-2.825-1.175T12.5 5.5t1.175-2.825T16.5 1.5t2.825 1.175T20.5 5.5t-1.175 2.825T16.5 9.5m-11-2q.825 0 1.413-.587T7.5 5.5t-.587-1.412T5.5 3.5t-1.412.588T3.5 5.5t.588 1.413T5.5 7.5m11 0q.825 0 1.413-.587T18.5 5.5t-.587-1.412T16.5 3.5t-1.412.588T14.5 5.5t.588 1.413T16.5 7.5m0-2" /></svg>
                  <span className='text-[#686868] text-lg'>Actions</span></div></th>
              </tr>
            </thead>
            <tbody>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="loader"></div>
                  <p className="text-gray-500 text-sm">Loading...</p>
                </div>
              )  : filterTable?.length === 0 ? (
                    <tr className="text-center w-full ">
                      <td colSpan="7" className="text-gray-500 font-semibold py-4">Data is not available...</td>
                    </tr>):
              
            (
                rec.map((data, index) => (
                  <tr key={index} className="bg-[#FFFFFF] border-b border-gray-300">
                    <td className="w-48 h-16 text-center text-sm font-bold text-[#9C9C9C]">{data.payrollRuns}</td>
                    <td className="w-48 h-16 text-center text-sm font-bold text-[#9C9C9C]">{data.payType}</td>
                    <td className="w-48 h-16 text-center text-sm font-bold text-[#9C9C9C]">{data.deductions}</td>
                    <td className="w-48 h-16 text-center text-sm font-bold text-[#9C9C9C]">{data.hourlyRate}</td>
                    <td className="w-48 h-16 text-center text-sm font-bold text-[#9C9C9C]">{data.grossSalary}</td>
                    <td className="w-48">
                      <div className="flex justify-center gap-2 items-center text-sm font-bold text-[#CFCFCF]">
                        {data.status === "Paid" && (
                          <span className="text-[10px] font-bold text-green-600">
                            <GoDotFill />
                          </span>
                        )}
                        {data.status === "Unpaid" && (
                          <span className="text-[10px] font-bold text-red-600">
                            <GoDotFill />
                          </span>
                        )}
                        {data.status === "Half Paid" && (
                          <span className="text-[10px] font-bold text-blue-700">
                            <GoDotFill />
                          </span>
                        )}
                        {data.status === "Holiday" && (
                          <span className="text-[10px] font-bold text-yellow-600">
                            <GoDotFill />
                          </span>
                        )}
                        {data.status}
                      </div>
                    </td>
                  </tr>
                ))
              ) }
            </tbody>
          </table>
          <nav className='flex justify-center mt-4'>
            <button onClick={prevPage} disabled={currPage === 1} className='px-4 py-2 mx-1 cursor-pointer rounded disabled:opacity-50'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z" /></svg></button>
            {num.map((n) => (
              <button
                key={n}
                onClick={() => setCurrPage(n)}
                className={`px-4 py-2 flex items-center mx-1 rounded ${currPage === n ? ' text-black bg-gray-200 rounded-full' : 'bg-gray-200'}`}
              >
                {n}
              </button>
            ))}
            <button onClick={nextPage} disabled={currPage === npages} className='px-4 py-2 mx-1  cursor-pointer rounded disabled:opacity-50'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z" /></svg></button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
