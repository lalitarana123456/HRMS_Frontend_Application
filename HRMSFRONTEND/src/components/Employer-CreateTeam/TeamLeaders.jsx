import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RiArrowUpDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import EmployerSidebar from "../Employer-Sidebar/EmployerSidebar";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const TeamLeaders = () => {
  const [teamLeads, setTeamLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = teamLeads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.fullName.toLowerCase().includes(query) ||
      lead.employeeId.toLowerCase().includes(query) ||
      lead.designation.toLowerCase().includes(query)
    );
  });


  const [currPage, setCurrPage] = useState(1);
  const recPerPage = 5;
  const lastInd = currPage * recPerPage;
  const firstInd = lastInd - recPerPage;
  const rec = filteredLeads.slice(firstInd, lastInd);
  const npages = Math.ceil(teamLeads.length / recPerPage);
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

  const [sortModalVisible, setSortModalVisible] = useState(false);

  const handleSort = () => {
    const sortedLeads = [...teamLeads].sort((a, b) =>
      a.fullName.localeCompare(b.fullName)
    );
    setTeamLeads(sortedLeads);
    setSortModalVisible(false);
  };

  useEffect(() => {
    const getTeamLeads = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/teamLeader/employees/teamlead-list",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          const data = response.data.teamLeaders;
          setTeamLeads(data);
          console.log("Data:", data);
        } else {
          console.log("Error While Fetching Data:", response.data.message);
          toast.error("Error While Fetching Data!");
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Error Fecthing Data", error.message);
      }
    };
    getTeamLeads();
  }, []);

  const navigate = useNavigate();


  return (
    <div id="main" className="w-screen h-screen flex bg-[#D6EBE7]">
      <div id="sidebar">
        <EmployerSidebar />
      </div>

      <div id="content" className="lg:p-10 flex flex-col gap-6 flex-grow">
        <h1 className="font-lato font-bold lg:text-[30px] lg:text-left text-center pt-5 lg:pt-0">
          Create Team
        </h1>

        <div
          id="functionalities"
          className="flex flex-row justify-between items-center w-full px-4"
        >
          <div
            id="searchBar"
            className="flex w-[70%] lg:h-full h-[80%] bg-white items-center p-2 rounded-xl"
          >
            <IoSearchOutline className="text-lg mr-2" />
            <input
              type="search"
              placeholder="Search Employee by Name, ID or Designation"
              className="w-full outline-none lg:text-[100%] text-[60%]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* <div
            id="sort-filter"
            className="flex w-[10%] h-full lg:bg-[#F9F9F9] lg:rounded-xl lg:gap-0 gap-1"
          >
            <button
              id="sort"
              onClick={() => setSortModalVisible(!sortModalVisible)}
              className="w-[80%] lg:h-full h-[80%] m-auto bg-[#F9F9F9] rounded-md"
            >
              <RiArrowUpDownLine className="text-xl mx-auto m-1" />
            </button>
          </div> */}
        </div>

        {sortModalVisible && (
          <div className="absolute z-50 bg-[#FFFFFF] lg:w-[15%] w-[30%] lg:right-5 lg:top-40 right-2 top-28">
            <p className="lg:h-10 h-7 flex items-center justify-center bg-[#F1F7FF] font-bold lg:text-lg text-[60%]">
              Sort
            </p>
            <button
              onClick={handleSort}
              className="w-full p-2 text-black font-lato font-medium lg:text-sm text-[50%]"
            >
              Alphabetically A-Z
            </button>
          </div>
        )}

        <div
          id="table"
          className="lg:w-[100%] lg:h-[277px] lg:mx-auto mx-2 flex flex-col"
        >
          <table className="border-collapse lg:border border-gray-200 lg:rounded-[15px] rounded-lg drop-shadow-lg overflow-hidden bg-white rounded-b-none border-0">
            <thead className="bg-[#F5F9F9]">
              <tr className="font-lato lg:text-sm text-[8px] lg:font-bold h-14">
                <th>
                  <span className="flex items-center justify-center lg:gap-2 lg:flex-row flex-col">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3  lg:w-6 lg:h-6"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#090a32"
                        d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2S7.5 4.019 7.5 6.5M20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1z"
                      />
                    </svg>
                    Name
                  </span>
                </th>

                <th>
                  <span className="flex items-center justify-center lg:gap-2 lg:flex-row flex-col text-nowrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3  lg:w-6 lg:h-6"
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
                  <span className="flex items-center justify-center lg:gap-2 lg:flex-row flex-col">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3  lg:w-6 lg:h-6"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#090a32"
                        d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z"
                      />
                    </svg>
                    Designation
                  </span>
                </th>

                <th>
                  <span className="flex items-center justify-center lg:gap-2 lg:flex-row flex-col">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3  lg:w-6 lg:h-6"
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

            <tbody className="flex-shrink">
              {rec.length > 0 ? (
                rec.map((lead, index) => (
                  <tr
                    className="lg:border-b font-lato lg:text-base lg:font-bold lg:text-[#9C9C9C] text-center h-14 text-[8px] border-y-4 lg:border-y-0 lg:border-gray-300 border-[#D5EAE7]"
                    key={index}
                  >
                    <td className="">
                      <span className="flex items-center flex-col lg:flex-row">
                        <img
                          src={lead.profilePhoto}
                          alt=""
                          className="lg:w-[40px] lg:h-[40px] w-[20px] h-[20px] rounded-full border border-black lg:m-2"
                        />
                        {lead.fullName}
                      </span>
                    </td>

                    <td>{lead.employeeId}</td>

                    <td>{lead.designation}</td>

                    <td>
                      <div
                        className="p-[1px] lg:rounded-lg rounded-md flex"
                        style={{
                          background:
                            "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)",
                        }}
                      >
                        <button
                          onClick={() => navigate(`/Team/${lead?._id}`)}
                          className="w-full lg:py-1 lg:px-0 px-1 text-gray-600 lg:text-sm text-[8px] font-medium bg-white lg:rounded-lg rounded-md hover:text-gray-800 transition-all duration-300 hover:bg-custom-gradient"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="font-lato font-bold text-xs text-[#C1C1C1] text-center py-4"
                  >
                    No Data Available!
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <nav className='flex justify-center text-[50%] lg:text-[100%] my-4'>
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
        </div>
      </div>
    </div>
  );
};

export default TeamLeaders;
