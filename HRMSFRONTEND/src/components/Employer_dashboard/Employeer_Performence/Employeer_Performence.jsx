import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { IoFilterOutline } from "react-icons/io5";
import { RiArrowUpDownLine } from "react-icons/ri";
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaRegStar } from "react-icons/fa";
import EmployerSidebar from '../../Employer-Sidebar/EmployerSidebar';

const Employeer_Performence = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [payroll, setPayroll] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [isChecked, setIsChecked] = useState({
    UIUX: false,
    FrontEnd: false,
    BackEnd: false,
    HR: false,
    SocialMedia: false,
    Finance: false,
    Research: false
  });
  const [isFilter, setIsFilter] = useState(false);

  const filterToggle = () => {
    setIsFilter(!isFilter);
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log(!isOpen);
  }

  const handleChecked = (option) => {
    setIsChecked((prev) => {
      const updatedState = {
        ...prev,
        [option]: !prev[option],
      };

      const selectedDesignation = Object.keys(updatedState).filter(
        (key) => updatedState[key]
      );

      if (selectedDesignation.length === 0) {
        setSelectedDesignation(null);
      } else {
        setSelectedDesignation(selectedDesignation);
      }
      setCurrPage(1);

      return updatedState;
    });
  }

  // search and designation filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredPayroll = payroll.filter((data) => {
    if (!data || !data.fullName || !data.employeeId || !data.department || !data.designation) return false;
    if (searchQuery.length < 3) return true;

    return (
      data.fullName.toLowerCase().includes(searchQuery) ||
      data.employeeId.toLowerCase().includes(searchQuery) ||
      data.department.toLowerCase().includes(searchQuery) ||
      data.designation.toLowerCase().includes(searchQuery)
    );
  }).filter((data) => {
    if (!selectedDesignation) return true;
    return selectedDesignation.includes(data.designation);
  });

  // pagination
  const recPerPage = 6;
  const lastInd = currPage * recPerPage;
  const firstInd = lastInd - recPerPage;
  const payrollArray = Array.isArray(filteredPayroll) ? filteredPayroll : [];
  const rec = payrollArray?.slice(firstInd, lastInd);
  const npages = Math.ceil(payrollArray?.length / recPerPage);
  const num = [...Array(npages).keys()].map((n) => n + 1);

  const nextPage = () => {
    if (currPage < npages) {
      setCurrPage(currPage + 1);
    }
  };

  const prevPage = () => {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    }
  };


  const getApiData = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/perform/performance-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", res.data);
        setPayroll(res.data);
      } catch (error) {
        console.error("Error fetching API:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Token not found in local storage");
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  useEffect(() => {
    setCurrPage(1);
  }, [searchQuery, selectedDesignation]);



  const handleSort = (order) => {
    let sortedData = [...payroll];
    sortedData.sort((a, b) => order === 'asc'
      ? (a.yearlyPerformance?.overallStarRating || 0) - (b.yearlyPerformance?.overallStarRating || 0)
      : (b.yearlyPerformance?.overallStarRating || 0) - (a.yearlyPerformance?.overallStarRating || 0));
    setSortOrder(order);
    setPayroll(sortedData);
    setIsSortOpen(false);
  };

  const navicate = useNavigate();
  const { ObjectId } = useParams();
  console.log(ObjectId);
  return (
    <>
      <div className='flex'>
        <EmployerSidebar />

        <div id='main' className='w-screen h-screen flex-row flex bg-[#D6EAE7] overflow-x-auto overflow-y-auto'>
          <div className='flex-grow md:p-10 w-full flex flex-col gap-6'>
            <h1 className='font-lato font-bold md:text-[40px] md:text-start text-center pt-1 md:pt-0 leading-[40px]'>Performance Sheet</h1>
            <div
              id="functionalities"
              className='flex  flex-shrink md:w-[98%] p-2 md:p-0  justify-between'>
              {/* searchbar */}
              <div
                className='flex  md:w-[70%]  md:mx-0 h-11 bg-white items-center md:p-2 rounded-xl border border-[#EDE9E9]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#4F7A94" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
                <input
                  type="text"
                  placeholder='Search by name, email or employee id '
                  className='w-full outline-none font-lato text-[16px] leading-[19.2px] text-[#4F7A94] px-2'
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              {/* filter and sort button */}
              <div className='flex md:w-[20%] w-[15%] h-11 bg-[#F9F9F9] rounded-xl'>
                <button onClick={filterToggle} className='w-[50%] h-[80%] md:h-full m-auto rounded-md bg-white'>
                  <IoFilterOutline className='md:text-[30px] mx-auto' />
                </button>

                {isFilter && (
                  <div className=' absolute rounded-t-xl xl:left-[68%] left-[30%] lg:left-[55%] md:left-[50%] xl:top-[23%] md:top-[25%] top-[23%] lg:top-[25%] w-[60%] flex flex-col justify-end md:w-[18%] bg-[#FFFFFF]'>
                    <p className='font-lato font-medium md:text-[20px] flex items-center justify-center m-auto leading-[24px] w-full rounded-t-xl h-14 text-center bg-[#F1F7FF]'>Filter by Department</p>
                    <div className='flex flex-col gap-1 shadow-lg h-[100%] pb-3'>
                      {/* dropdown */}
                      <div className={`relative pt-4 h-[90%] ${isOpen ? "rounded-lg" : "rounded-none"} w-[90%] m-auto`} >
                        <div className={`flex p-3  ${isOpen ? "rounded-t-lg" : "rounded-lg"} w-full ${isOpen ? "bg-custom-gradient" : "bg-[#FFFFFF]"} p-2  border-[#EDEDED] border`}>
                          <button
                            onClick={handleToggle}
                            className={`w-full  md:text-[20px] text-sm text-left font-medium leading-6  ${isOpen ? "text-white" : "text-[#6B6B6B]"}`}>IT - Team
                          </button>
                          <svg
                            onClick={handleToggle}
                            className={`cursor-pointer transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" /></svg>
                        </div>
                        {(isOpen &&
                          <div className='gap-3 flex flex-col  rounded-b-lg justify-center p-4 bg-[#FFFFFF] shadow-lg'>
                            {["Front-End", "Back-End", "UI/UX"].map((dept) => (
                              <div key={dept} className='w-full flex justify-between'>
                                <label>{dept}</label>
                                <input
                                  type='radio'
                                  className={`md:w-5 md:h-6 ${isChecked[dept] ? "accent-black" : "accent-gray-50"} cursor-pointer`}
                                  onClick={() => handleChecked(dept)}
                                  checked={isChecked[dept]}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className='flex flex-col gap-3 w-[90%] m-auto h-[90%] '>
                        {["HR", "Social Media", "Finance", "Research"].map((dept) => (
                          <div
                            key={dept}
                            className={`flex w-full h-11 rounded-lg justify-between p-4 items-center cursor-pointer ${isChecked[dept] ? "bg-custom-gradient" : "bg-[#FFFFFF] "} border border-[#EDEDED]`}>
                            <p className='font-lato font-medium md:text-[20px] leading-6'>{dept}</p>
                            <input
                              type='radio'
                              className={`md:w-5 md:h-6 ${isChecked[dept] ? "accent-black" : "accent-gray-50"} cursor-pointer`}
                              onClick={() => handleChecked(dept)}
                              checked={isChecked[dept]}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="border-2 h-11"></div>

                <button onClick={() => setIsSortOpen(!isSortOpen)} className='w-[50%] h-[80%] md:h-full m-auto'>
                  <RiArrowUpDownLine className='md:text-[30px] lg:mx-auto' />
                </button>
                {isSortOpen && (
                  <div className='absolute right-16 mt-10 w-40 h-36 bg-white border rounded-md shadow-lg'>
                    <div className='w-full h-8 rounded-t-lg bg-[#F1F7FF]'>
                      <p className='font-semibold text-center'>Sort by Rating</p>
                    </div>
                    <div className='p-1'>
                      <label className='flex justify-between cursor-pointer border p-2 border-[#F1F7FF] rounded-xl'>
                        <span className='text-xl'>Low to High</span>
                        <input type="radio" name="sort" value="asc" onClick={() => handleSort('asc')} checked={sortOrder === 'asc'} className='size-5 mt-1' />
                      </label>
                      <label className='flex justify-between cursor-pointer border border-[#F1F7FF] p-2 mt-2 rounded-xl'>
                        <span className='text-xl'>High to Low</span>
                        <input type="radio" name="sort" value="desc" onClick={() => handleSort('desc')} checked={sortOrder === 'desc'} className='size-5 mt-0' />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='md:w-[98%] md:h-[60%] flex-shrink flex flex-col'>
              <table className="w-full h-full bg-white border border-gray-200 md:rounded-2xl rounded-lg overflow-hidden p-0 md:p-4">
                <thead className="bg-[#F5F9F9]">
                  <tr className="font-lato text-[#686868] md:text-sm text-[8px] font-bold">
                    <th className="h-10 px-0 md:px-4 py-0 md:py-2">
                      <span className="flex mx-3 items-center md:flex-row flex-col cursor-pointer transition-all duration-300 hover:scale-105">
                        <svg className="hidden md:block w-3 h-3 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="#090a32" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                        </svg>
                        <span className="text-xs px-6">Name</span>
                      </span>
                    </th>

                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                      <span className="flex items-center gap-2 md:gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="hidden md:block  w-4 h-4 md:w-5 md:h-5"
                          viewBox="0 0 24 24"
                        >
                          <path fill="#090a32" d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2M8.715 8c1.151 0 2 .849 2 2s-.849 2-2 2s-2-.849-2-2s.848-2 2-2m3.715 8H5v-.465c0-1.373 1.676-2.785 3.715-2.785s3.715 1.412 3.715 2.785zM19 15h-4v-2h4zm0-4h-5V9h5z" />
                        </svg>
                        <span className="text-xs md:text-xs font-bold font-lato">Employee ID</span>
                      </span>
                    </th>

                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                      <span className="flex items-center gap-2 md:gap-2">
                        <svg className="hidden md:block  w-3 h-3 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="#090a32" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                        </svg>
                        <span className="text-xs md:text-xs font-bold font-lato">Designation</span>
                      </span>
                    </th>

                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                      <span className="flex items-center gap-2 md:gap-2">
                        <svg className='hidden md:block ' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#090a32" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z" /></svg>
                        <span className="text-xs md:text-xs font-bold font-lato">Dipartment</span>
                      </span>
                    </th>


                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                      <span className="flex items-center gap-2 md:gap-2">
                        <svg className="hidden md:block  w-3 h-3 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="#090a32" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                        </svg>
                        <span className="text-xs md:text-xs font-bold font-lato">Monthly Report</span>
                      </span>
                    </th>

                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                      <span className="flex items-center gap-2 md:gap-2">
                        <svg className="hidden md:block  w-3 h-3 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="#090a32" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                        </svg>
                        <span className="text-xs md:text-xs font-bold font-lato">Yearly Report</span>
                      </span>
                    </th>

                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                      <span className="flex items-center gap-2 md:gap-2">
                        <svg className='hidden md:block ' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#090a32" d="M16.5 20.5q-1.65 0-2.825-1.175T12.5 16.5t1.175-2.825T16.5 12.5t2.825 1.175T20.5 16.5q0 .575-.15 1.088t-.425.962L22.3 20.9q.15.125.225.313t.075.387t-.075.375t-.225.325q-.125.125-.312.2t-.388.075t-.375-.075t-.325-.2l-2.375-2.35q-.45.275-.962.413T16.5 20.5m-11 0q-1.65 0-2.825-1.175T1.5 16.5t1.175-2.825T5.5 12.5t2.825 1.175T9.5 16.5t-1.175 2.825T5.5 20.5m0-2q.825 0 1.412-.587T7.5 16.5t-.587-1.412T5.5 14.5t-1.412.588T3.5 16.5t.588 1.413T5.5 18.5m11 0q.825 0 1.413-.587T18.5 16.5t-.587-1.412T16.5 14.5t-1.412.588T14.5 16.5t.588 1.413t1.412.587m-11-9q-1.65 0-2.825-1.175T1.5 5.5t1.175-2.825T5.5 1.5t2.825 1.175T9.5 5.5T8.325 8.325T5.5 9.5m11 0q-1.65 0-2.825-1.175T12.5 5.5t1.175-2.825T16.5 1.5t2.825 1.175T20.5 5.5t-1.175 2.825T16.5 9.5m-11-2q.825 0 1.413-.587T7.5 5.5t-.587-1.412T5.5 3.5t-1.412.588T3.5 5.5t.588 1.413T5.5 7.5m11 0q.825 0 1.413-.587T18.5 5.5t-.587-1.412T16.5 3.5t-1.412.588T14.5 5.5t.588 1.413T16.5 7.5m0-2" /></svg>
                        <span className="text-xs md:text-xs font-bold font-lato">Action</span>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="flex-shrink h-10">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="text-gray-500 text-sm text-center py-4">Loading...</td>
                    </tr>
                  ) : payrollArray?.length === 0 ? (
                    <tr className="text-center w-full">
                      <td colSpan="7" className="text-gray-500 font-semibold py-4">Data is not available...</td>
                    </tr>
                  ) : (
                    rec.map((data, index) => (
                      <tr key={index} className="md:border-b flex-shrink md:font-lato pt-4 md:text-base font-bold md:text-[#9C9C9C] mb-10 text-center md:h-16 h-8 text-[8px] hover:bg-gray-100 transition-all duration-300">
                        <td className="flex-shrink h-14 px-0 md:px-4 py-0 md:py-2">
                          <div className="flex items-center flex-col md:flex-row cursor-pointer hover:scale-105 transition-transform duration-300">
                            <img
                              src={data.profilePhoto} alt="profile photo"
                              className="md:w-8 md:h-8 w-5 h-5 rounded-full border border-black md:m-2"
                            />
                            <span className="pl-2 py-1">{data.fullName}</span>
                          </div>
                        </td>
                        <td className="text-xs md:text-xs flex-shrink px-0 md:px-4 py-0 md:py-2">{data.employeeId}</td>
                        <td className="text-xs md:text-xs flex-shrink px-0 md:px-4 py-0 md:py-2">{data.designation}</td>
                        <td className="text-xs md:text-xs flex-shrink px-0 md:px-4 py-0 md:py-2">{data.department}</td>
                        <td className="text-xs md:text-xs flex-shrink px-0 md:px-4 py-0 md:py-2">
                          <div className="w-full border border-[#DADADA] rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300">
                            <div
                              className="h-2 rounded-xl"
                              style={{
                                width: `${data.monthlyPerformance?.overallPerformancePercentage || 0}%`,
                                background: `linear-gradient(to right, #1D5FA3, #8BC4FF)`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="pt-6 pl-2 md:pl-10 p-2 md:p-0 md:px-4 py-0 md:py-5">
                          <div className="flex items-center gap-0.5 md:gap-1">
                            {[...Array(5)].map((_, index) => (
                              index < data.yearlyPerformance?.overallStarRating
                                ? <FaStar key={index} className="text-yellow-500 cursor-pointer hover:scale-110 transition-transform duration-300" />
                                : <FaRegStar key={index} className="text-gray-300 cursor-pointer hover:scale-110 transition-transform duration-300" />
                            ))}
                          </div>
                        </td>

                        <td className="px-0 md:px-4 py-0 md:py-2">
                          <div
                            className="p-[1.1px] rounded-lg"
                            style={{
                              background: "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)",
                            }}
                          >
                            <button
                              onClick={() => navicate(`/EmployeePerformenceSheetDetails/${data?.ObjectId}`)}
                              className="w-full py-2 text-gray-600 text-xs md:text-xs font-medium bg-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2D54EE] hover:to-[#88FFE9] hover:text-gray-800 hover:scale-105"
                            >
                              View <span className="ml-1">more</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>



              <nav className='flex justify-center mt-4'>
                <button onClick={prevPage} disabled={currPage === 1} className='px-4 py-2 mx-1 rounded disabled:opacity-50'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z" />
                  </svg>
                </button>
                {num.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrPage(n)}
                    className={`px-4 py-2 mx-1 rounded-full ${currPage === n ? 'bg-[#E8EDF2] text-black w-10 text-center h-10' : ''}`}
                  >
                    {n}
                  </button>
                ))}
                <button onClick={nextPage} disabled={currPage === npages} className='px-4 py-2 mx-1 rounded disabled:opacity-50'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z" />
                  </svg>
                </button>
              </nav>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Employeer_Performence;
