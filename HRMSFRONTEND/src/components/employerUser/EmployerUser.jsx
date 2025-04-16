import axios from "axios";
import React, { useState, useEffect } from "react";

import { IoFilterOutline } from "react-icons/io5";
import { RiArrowUpDownLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import EmployerSidebar from "../Employer-Sidebar/EmployerSidebar";
import { Sorting } from "../employerPayroll/Duration";

const EmployerUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [empData, setEmpData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [payroll, setPayroll] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  const [isChecked, setIsChecked] = useState({
    UIUX: false,
    FrontEnd: false,
    BackEnd: false,
    HR: false,
    SocialMedia: false,
    Finance: false,
    Research: false,
  });
  const [isFilter, setIsFilter] = useState(false);
  const [filteredPayroll, setFilteredPayroll] = useState(payroll);
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  const filterToggle = () => {
    setIsFilter(!isFilter);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log(!isOpen);
  };

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
        setSelectedDesignation(null); // Show all data
      } else {
        setSelectedDesignation(selectedDesignation); // Show data based on selected designations
      }
      setCurrPage(1);

      return updatedState;
    });
  };
  const recPerPage = 6;
  const lastInd = currPage * recPerPage;
  const firstInd = lastInd - recPerPage;

  // serach and designation filter//

  useEffect(() => {
    const updatedPayroll = payroll.filter((data) => {
      const matchesSearch =
        searchQuery.length >= 2
          ? data.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.employeeId?.toString().includes(searchQuery) ||
            data.designation
              ?.toLowerCase()
              ?.includes(searchQuery.toLowerCase()) ||
            data.department?.toLowerCase()?.includes(searchQuery.toLowerCase())
          : true;

      const matchesDepartment = selectedDesignation
        ? selectedDesignation.includes(data.designation)
        : true;

      return matchesSearch && matchesDepartment;
    });
    setFilteredPayroll(updatedPayroll);
  }, [payroll, searchQuery, selectedDesignation]);

  const handleSort = () => {
    const sortedData = [...filteredPayroll].sort((a, b) =>
      isSortedAsc
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName)
    );
    setFilteredPayroll(sortedData);
    setIsSortedAsc(!isSortedAsc);
    setCurrPage(1);
  };

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

  // const handleClick = () => {
  //   navigate(`/Main_Profile/${id}`);
  //   };

  const { id } = useParams();
  // console.log(employeeId);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const getApiData = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      if (token) {
        setIsLoading(true);

        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/admin/`,

            {
              headers: {
                Authorization: `Bearer ${token}`, // Token ko header me add karo
              },
            }
          );
          console.log("msg" + token);
          console.log(res.data.data);

          setPayroll(res.data.data || []);

          console.log("Payroll State:", payroll);
        } catch (error) {
          console.error("Error fetching API:", error);
        } finally {
          setIsLoading(false); // Stop loading
        }
      } else {
        console.log("Token not found in local storage");
      }
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  useEffect(() => {
    setCurrPage(1);
  }, [searchQuery]);

  return (
    <>
      <div
        id="main"
        className="w-screen h-screen flex-row flex bg-[#D6EAE7] relative"
      >
        <EmployerSidebar />

        <div className="flex-grow md:p-10 w-full flex flex-col overflow-y-auto  gap-6">
          <h1 className="font-lato font-bold md:text-[40px] md:text-left text-center pt-1 md:pt-0 leading-[48px]">
            Users
          </h1>

          <div
            id="functionalities"
            className="flex  flex-shrink md:w-[98%] p-2 md:p-0  justify-between"
          >
            {/* searchbar */}
            <div className="flex  w-[70%] mx-2 md:mx-0 h-11 bg-white items-center md:p-2 rounded-xl border border-[#EDE9E9]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4F7A94"
                  d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
                />
              </svg>
              <input
                type="text"
                placeholder="Search "
                className="w-full outline-none font-lato text-[16px] leading-[19.2px] text-[#4F7A94] px-2   "
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <div className="flex md:w-[20%] w-20   md:h-11 bg-[#F9F9F9] rounded-xl ">
              <button
                onClick={filterToggle}
                className="w-[50%] h-full md:h-full m-auto rounded-md bg-white"
              >
                <IoFilterOutline className="md:text-[30px] mx-auto" />
              </button>

              <div class="border-2 h-11"></div>

              <button
                onClick={handleSort}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="w-[50%]  h-[80%] md:h-full m-auto"
              >
                <RiArrowUpDownLine className="md:text-[30px] mx-auto" />
                {showTooltip && (
                  <div className="relative md:right-0 top-full -left-20 md:left-0  bg-white w-full  ">
                    <Sorting />
                  </div>
                )}
              </button>
              {/* filtern by department */}
            </div>
          </div>

          {isFilter && (
            <div className=" absolute  xl:left-[57%] left-[30%] lg:left-[55%] md:left-[50%] xl:top-[23%] md:top-[25%] top-[23%] lg:top-[25%] w-[60%] flex flex-col justify-end md:w-[28%]    bg-[#FFFFFF]">
              <p className="font-lato font-medium md:text-[20px] flex items-center justify-center m-auto leading-[24px] w-full rounded-xl h-14 text-center bg-[#F1F7FF]">
                Filter by Department
              </p>
              <div className="flex flex-col gap-3 shadow-lg h-[100%]  ">
                {/* dropdown */}
                <div
                  className={`relative pt-4  h-[90%]   ${
                    isOpen ? "rounded-lg" : "rounded-none"
                  } w-[90%] m-auto`}
                >
                  <div
                    className={`flex p-3  ${
                      isOpen ? "rounded-t-lg" : "rounded-lg"
                    } w-full ${
                      isOpen ? "bg-custom-gradient" : "bg-[#FFFFFF]"
                    } p-2  border-[#EDEDED] border`}
                  >
                    <button
                      onClick={handleToggle}
                      className={`w-full  md:text-[20px] text-sm text-left font-medium leading-6  ${
                        isOpen ? "text-white" : "text-[#6B6B6B]"
                      }`}
                    >
                      IT - Team
                    </button>
                    <svg
                      onClick={handleToggle}
                      className={`cursor-pointer transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                      />
                    </svg>
                  </div>
                  {isOpen && (
                    <div className="gap-3 flex flex-col  rounded-b-lg justify-center p-4 bg-[#FFFFFF]  shadow-lg">
                      {["Front-End", "Back-End", "UI/UX"].map((dept) => (
                        <div key={dept} className="w-full flex justify-between">
                          <label>{dept}</label>
                          <input
                            type="radio"
                            className={`md:w-5 md:h-6 ${
                              isChecked[dept]
                                ? "accent-black"
                                : "accent-gray-50"
                            } cursor-pointer`}
                            onClick={() => handleChecked(dept)}
                            checked={isChecked[dept]}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* rest content.. */}
                <div className="flex flex-col gap-3 w-[90%] m-auto h-[90%] ">
                  {["HR", "Social Media", "Finance", "Research"].map((dept) => (
                    <div
                      key={dept}
                      className={`flex w-full h-11 rounded-lg justify-between p-4 items-center cursor-pointer ${
                        isChecked[dept] ? "bg-custom-gradient" : "bg-[#FFFFFF] "
                      } border border-[#EDEDED]`}
                    >
                      <p className="font-lato font-medium md:text-[20px] leading-6">
                        {dept}
                      </p>
                      <input
                        type="radio"
                        className={`md:w-5 md:h-6 ${
                          isChecked[dept] ? "accent-black" : "accent-gray-50"
                        } cursor-pointer`}
                        onClick={() => handleChecked(dept)}
                        checked={isChecked[dept]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div
            id="table"
            className="md:w-[98%] md:h-[60%] md:mx-auto mx-2 flex flex-col"
          >
            <table class="table-auto w-full h-full bg-white border-collapse  border border-gray-200 rounded-2xl overflow-hidden">
              <thead className="bg-[#F5F9F9]">
                <tr className="font-lato w-[19%] text-[#686868] md:text-sm text-[8px] font-bold md:h-14  flex-shrink ">
                  <th className=" ">
                    <span className="flex mx-3  items-center  md:flex-row flex-col">
                      <svg
                        className="w-3 h-3  md:w-6 md:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#090a32"
                          d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
                        />
                      </svg>
                      <span className="md:text-sm text-[8px]  md:px-6">
                        Name
                      </span>
                    </span>
                  </th>

                  <th class=" ">
                    <span className="flex items-center justify-center md:gap-2 md:flex-row flex-col">
                      <svg
                        className="w-3 h-3  md:w-6 md:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#090a32"
                          d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2M8.715 8c1.151 0 2 .849 2 2s-.849 2-2 2s-2-.849-2-2s.848-2 2-2m3.715 8H5v-.465c0-1.373 1.676-2.785 3.715-2.785s3.715 1.412 3.715 2.785zM19 15h-4v-2h4zm0-4h-5V9h5z"
                        />
                      </svg>
                      Employee ID
                    </span>
                  </th>

                  <th>
                    <span className="flex items-center justify-center md:gap-2 md:flex-row flex-col">
                      <svg
                        className="w-3 h-3  md:w-6 md:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#090a32"
                          d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
                        />
                      </svg>
                      Designation
                    </span>
                  </th>

                  <th>
                    <span className="flex items-center justify-center md:gap-2 md:flex-row flex-col">
                      <svg
                        className="w-3 h-3  md:w-6 md:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#090a32"
                          d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
                        />
                      </svg>
                      Employee Status
                    </span>
                  </th>

                  <th>
                    <span className="flex items-center justify-center md:gap-2 md:flex-row flex-col">
                      <svg
                        className="w-3 h-3  md:w-6 md:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#090a32"
                          d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z"
                        />
                      </svg>
                      Department
                    </span>
                  </th>

                  <th>
                    <span className="flex items-center justify-center md:gap-2 md:flex-row flex-col">
                      <svg
                        className="w-3 h-3  md:w-6 md:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#090a32"
                          d="m21.6 23l-3.075-3.05q-.45.275-.962.413T16.5 20.5q-1.65 0-2.825-1.175T12.5 16.5t1.175-2.825T16.5 12.5t2.825 1.175T20.5 16.5q0 .575-.15 1.088t-.425.962L23 21.6zM5.5 20.5q-1.65 0-2.825-1.175T1.5 16.5t1.175-2.825T5.5 12.5t2.825 1.175T9.5 16.5t-1.175 2.825T5.5 20.5m0-2q.825 0 1.412-.587T7.5 16.5t-.587-1.412T5.5 14.5t-1.412.588T3.5 16.5t.588 1.413T5.5 18.5m11 0q.825 0 1.413-.587T18.5 16.5t-.587-1.412T16.5 14.5t-1.412.588T14.5 16.5t.588 1.413t1.412.587m-11-9q-1.65 0-2.825-1.175T1.5 5.5t1.175-2.825T5.5 1.5t2.825 1.175T9.5 5.5T8.325 8.325T5.5 9.5m11 0q-1.65 0-2.825-1.175T12.5 5.5t1.175-2.825T16.5 1.5t2.825 1.175T20.5 5.5t-1.175 2.825T16.5 9.5m-11-2q.825 0 1.413-.587T7.5 5.5t-.587-1.412T5.5 3.5t-1.412.588T3.5 5.5t.588 1.413T5.5 7.5m11 0q.825 0 1.413-.587T18.5 5.5t-.587-1.412T16.5 3.5t-1.412.588T14.5 5.5t.588 1.413T16.5 7.5m0-2"
                        />
                      </svg>
                      Action
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className=" flex-shrink">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="loader"></div>
                    <p className="text-gray-500 text-sm">Loading...</p>
                  </div>
                ) : payrollArray?.length === 0 ? (
                  <tr className="text-center w-full ">
                    <td
                      colSpan="7"
                      className="text-gray-500 font-semibold py-4"
                    >
                      Data is not available...
                    </td>
                  </tr>
                ) : (
                  rec.map((data, index) => (
                    <tr
                      key={index}
                      className="md:border-b  border-y-4 md:border-y-0 md:border-gray-300 border-[#D5EAE7] flex-shrink md:font-lato pt-4 md:text-base font-bold md:text-[#9C9C9C] mb-10 text-center md:h-16 h-8 text-[8px]"
                    >
                      <td className=" ">
                        <div className="flex  items-center flex-col md:flex-row ">
                          <img
                            src={data.profilePhoto}
                            alt="profile photo"
                            loading="lazy"
                            className="md:w-10 md:h-10 w-5 h-5 rounded-full border  border-black md:m-2"
                          />
                          <span className=" px-2 py-1  ">{data.fullName}</span>
                        </div>
                      </td>
                      <td className="">{data.employeeId}</td>

                      {/* <td>{user.type}</td> */}

                      <td>{data.designation}</td>

                      <td>{data.employeeStatus}</td>

                      <td>{data.department}</td>

                      <td className="">
                        <div
                          className="p-[1px] rounded-lg  m-2 "
                          style={{
                            background:
                              "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)",
                          }}
                        >
                          <button
                            onClick={() =>
                              navigate(`/Main_Profile/${data.employeeId}`)
                            }
                            className="w-full py-2 p-0 text-gray-600 text-sm font-medium bg-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2D54EE] hover:to-[#88FFE9] hover:text-gray-800"
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
            <nav className="flex justify-center  mt-4 text-sm">
              <button
                onClick={prevPage}
                disabled={currPage === 1}
                className="md:px-4 py-2 mx-1   rounded disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z"
                  />
                </svg>
              </button>
              {num.map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrPage(n)}
                  className={`md:px-4 px-2 py-2 mx-1 rounded-full ${
                    currPage === n
                      ? "bg-[#E8EDF2] text-black w-10 text-center h-10"
                      : ""
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currPage === npages}
                className="px-4 py-2 mx-1  rounded disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerUser;
