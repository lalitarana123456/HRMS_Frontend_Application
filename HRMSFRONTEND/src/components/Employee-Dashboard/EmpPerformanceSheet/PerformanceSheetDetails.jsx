import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import Chart from "./Chart";
import MonthlyComments from "./MonthlyComments";
import YearlyComments from "./YearlyComments";
import YearlyPerformence from "./YearlyPerformence";
import EmployerSidebar from "../../Employer-Sidebar/EmployerSidebar";
import { RiTeamFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const PerformanceSheetDetails = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  // const empdata = localStorage.getItem("employeeData.yearlyOverallPerformancePercentage");
  // console.log(empdata);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("employeeData"));
    if (userData && !id) {
      setUser(userData);
    } else if (id) {
      // If there's an ID in the URL, fetch data for that specific user
      axios
        .get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          console.log("Id wise Data", response.data);
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
        });
    }
  }, [id, token]);

  useEffect(() => {
    if (token) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/performances/monthly`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the user data!", error);
        });
    }
  }, [token]);

  const overallPerformancePercentage =
    userData[userData.length - 1]?.overallPerformancePercentage;

  const [data, setData] = useState([]);

  //employer

  const getApiData = async () => {
    // const token = localStorage.getItem('token');

    // if (token) {
    //   if (token) {

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_LIVE
        }/api/v1/administrative/performance/YearlyAndMonthlyPerformance/${id}`,

        {
          // headers: {
          //   Authorization: `Bearer ${token}`, // Token ko header me add karo
          // },
        }
      );
      console.log("msg" + token);
      console.log(res.data);

      setData(res.data || []);

      console.log("Payroll State:", payroll);
    } catch (error) {
      console.error("Error fetching API:", error.message);
    }
    // } else {
    //   console.log("Token not found in local storage");
    // }
  };
  useEffect(() => {
    getApiData();
  }, []);
  const employeeData = JSON.parse(localStorage.getItem("employeeData"));
  const isEmployer = employeeData && employeeData.role === "Employer";

  return (
    <div className="flex w-full h-screen bg-[#D6EAE7]">
      {/* Fixed Sidebar */}
      <div className="w-[250px] md:w-[18%] h-screen fixed">
        {/* <Sidebar /> */}
        {isEmployer ? <EmployerSidebar /> : <Sidebar />}
      </div>

      {/* Scrollable Content */}
      <div className="ml-0 sm:ml-0 md:ml-0 lg:ml-[18%] w-full sm:w-full md:w-full lg:w-[82%] h-screen overflow-y-auto p-10">
        <p className="text-center mt-[-15px] lg:text-start text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-lato font-bold text-[#002446]">
          Performance Sheet
        </p>

        <div className="flex justify-between mb-5 mt-5">
          <p className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-lato font-bold text-[#899096]">
            Monthly Performance
          </p>

          {/* Button visible for specific roles only */}
          {[
            "IT Team Leader",
            "Assignment Team Leader",
            "Finance Team Leader",
            "Digital marketing team Leader",
            "Admin",
          ].includes(user?.designation) && (
            <Link to="/Team">
              <button
                className="border border-[#BEBEBE] flex items-center gap-2 px-4 text-white rounded-lg w-[100px] h-[35px] transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-400 hover:to-green-400"
                style={{
                  background:
                    "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)",
                }}
              >
                <RiTeamFill />
                <p className="text-[14px] font-lato font-extrabold">Team</p>
              </button>
            </Link>
          )}
        </div>

        <div className="flex justify-between w-full bg-white h-16 sm:h-16 md:h-20 lg:h-24 rounded-lg">
          <div className="gap-2 sm:gap-2 md:gap-4 flex ml-2">
            <div className="m-0 drop-shadow-lg py-2">
              <img
                // src={user?.profilePhoto || "/Ellipse.png"||{data.profilePhoto}}
                src={user?.profilePhoto || data?.profilePhoto || "/Ellipse.png"}
                alt="Profile"
                className="w-12 h-12 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full"
              />
            </div>

            <div className="leading-5 py-3">
              <p className="flex font-lato text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold md:text-[#002446] whitespace-nowrap overflow-hidden">
                {user?.firstName} &nbsp;{user?.lastName || data?.name}
              </p>
              <p className="text-[#747E94] text-xs sm:text-sm md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl font-medium font-lato">
                {user?.designation || data.designation}
              </p>
            </div>
          </div>

          <div className="mr-2 sm:mr-2 leading-5 py-3">
            <p className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-lato font-bold text-[#002446]">
              {user?.monthlyPerformance &&
              user?.monthlyPerformance[0]?.overallPerformancePercentage !==
                undefined
                ? `${user.monthlyPerformance[0].overallPerformancePercentage}%`
                : data?.monthlyPerformance &&
                  data?.monthlyPerformance[0]?.overallPerformancePercentage !==
                    undefined
                ? `${data.monthlyPerformance[0].overallPerformancePercentage}%`
                : "NA"}
            </p>

            <p className="text-[#747E94] text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-lato font-medium">
              Overall&nbsp;Performance
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-[100%] h-16 sm:h-26 md:h-20 lg:h-24 bg-[#F6F6F6] flex justify-center items-center rounded-b-lg">
          <div className="relative w-[95%] bg-white h-5 sm:h-8 rounded-full">
            <div
              className="absolute h-5 sm:h-8 bg-gradient-to-r from-[#1D5FA3] to-[#8BC4FF] rounded-[100px]"
              style={{
                width:
                  // Employee: use the employee's percentage
                  user?.monthlyPerformance &&
                  user.monthlyPerformance[0]?.overallPerformancePercentage !==
                    undefined
                    ? `${user.monthlyPerformance[0].overallPerformancePercentage}%`
                    : // Admin: use the admin's percentage
                    data?.monthlyPerformance &&
                      data.monthlyPerformance[0]
                        ?.overallPerformancePercentage !== undefined
                    ? `${data.monthlyPerformance[0].overallPerformancePercentage}%`
                    : "0%",
              }}
            ></div>
          </div>
        </div>

        <MonthlyComments />
        <div className="bg-white h-[2px] w-[100%] mx-auto mt-8 mb-3"></div>
        <YearlyPerformence />

        {/* Bar Chart */}
        <div className="p-5 bg-white rounded-[20px] shadow-xl mt-8 mb-5">
          <Chart />
        </div>

        <YearlyComments />
      </div>
    </div>
  );
};

export default PerformanceSheetDetails;
