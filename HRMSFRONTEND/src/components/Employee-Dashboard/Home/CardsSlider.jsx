import React, { useState, useEffect } from "react";
import { FaUserClock, FaStar } from "react-icons/fa";
import { HiCash } from "react-icons/hi";
import { useSwipeable } from "react-swipeable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbStarFilled, TbStarHalfFilled } from "react-icons/tb";

const Carousel3D = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [userData, setUserData] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [lastTwoLeaves, setLastTwoLeaves] = useState([]);
  const [payrollDetails, setPayrollDetails] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/performances/yearly`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error('Error fetching yearly performance data:', error);
        });

      axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/leaveBalance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          setLeaveBalance(response.data.leaveBalance);
        })
        .catch(error => {
          console.error('Error fetching leave balance:', error);
        });

      axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const allLeaves = response.data.leaves || [];
          const sortedLeaves = allLeaves.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLastTwoLeaves(sortedLeaves.slice(0, 2));
        })
        .catch(error => {
          console.error('Error fetching leave history:', error);
        });

      axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/payslips/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const payslips = response.data.data || [];
          setPayrollDetails(payslips[0]); // Store the first payroll in state
        })
        .catch(error => {
          console.error('Error fetching payslip data:', error);
        });
    } else {
      console.log('No token found in localStorage');
    }
  }, [token]);

  const overallPerformancePercentage = userData[userData.length - 1]?.overallPerformancePercentage;
  const latestReport = userData[userData.length - 1];

  const cards = [
    {
      title: "Leave Report",
      content: (
        <>
          <p className="text-gray-500 text-start">
            Remaining Leave: <span className="text-[#002446] text-lg font-bold ">{leaveBalance || 'NA'} Days</span>
          </p>
          <p className="text-gray-500 text-start">
            Last Leave Taken:{" "}
            {lastTwoLeaves.map((leave) => (
              <p key={leave._id} className="text-[70%] sm:text-[40%] md:text-[50%] lg:text-[80%] xl:text-[90%] 2xl:text-[100%] font-lato">
                {leave.leaveType || 'NA'} on {leave.startDate || 'NA'}
              </p>
            ))}
          </p>
        </>
      ),
      icon: <FaUserClock className="text-2xl text-[#002446]" />,
    },
    {
      title: "Payroll Details",
      content: (
        <>
          {payrollDetails ? (
            <>
              <p className="text-gray-500 text-start">
                Previous Salary Paid:{" "}
                <span className="text-green-600 font-bold text-lg">
                  ₹ {payrollDetails.grossSalary.toLocaleString("en-IN") || "NA"}
                </span>
              </p>
              <p className="text-gray-500 text-start">
                Deductions: <span className="text-red-600 font-bold text-lg">
                  ₹ {payrollDetails.deductions.toLocaleString("en-IN") || 'NA'}
                </span>
              </p>
              <p className="text-gray-500 text-start">
                {payrollDetails.payrollRuns}
              </p>
            </>
          ) : (
            <p>Loading payroll details...</p>
          )}
        </>
      ),
      icon: <HiCash className="text-2xl text-[#002446]" />,
    },
    {
      title: "Performance Report",
      content: (
        <>
          <div className="flex gap-5">
            <p className="text-[#606060]">Overall Rating:</p>
            <div className="flex gap-1 mt-1">
              {Array(Math.floor(latestReport?.overallStarRating ?? 0))
                .fill(0)
                .map((_, index) => (
                  <TbStarFilled key={`full-star-${index}`} className="text-yellow-400" />
                ))}
              {latestReport?.overallStarRating % 1 >= 0.5 && <TbStarHalfFilled className="text-yellow-400" />}
            </div>
          </div>
          <p className="text-gray-500 text-start">
            Goals Progress:{" "}
            <div className="h-5 w-full bg-white border border-gradient-to-r from-[#1D5FA3] to-[#8BC4FF] rounded-full">
              <div
                className="bg-gradient-to-r from-[#1D5FA3] to-[#8BC4FF] h-full rounded-full"
                style={{ width: `${overallPerformancePercentage || 0}%` }}
              ></div>
            </div>
          </p>
          <p className="text-[#B1B1B1]">{overallPerformancePercentage || 0}% completed</p>
        </>
      ),
      icon: <FaStar className="text-2xl text-[#002446]" />,
    },
  ];

  const navigateRoutes = {
    "Leave Report": "/leave",
    "Payroll Details": "/payroll",
    "Performance Report": "/Employee Performence Sheet Details",
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
  });

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const hintTimeout = setTimeout(() => setShowHint(false), 2000);
    return () => clearTimeout(hintTimeout);
  }, []);

  return (
    <div
      {...swipeHandlers}
      className="relative mt-[-125px]  sm:mt-10 w-full h-96 overflow-hidden flex flex-col justify-center items-center"

    >
      {/* 3D Slider */}
      <div className="relative w-full h-full flex justify-center items-center perspective-1000">
        {cards.map((card, index) => {
          const offset = (index - currentIndex + cards.length) % cards.length;
          const isActive = offset === 0;

          const translateX =
            offset === 0
              ? 0
              : offset === 1
                ? 250
                : -250;

          const translateZ = isActive ? 0 : -200;
          const rotateY = offset === 0 ? 0 : offset === 1 ? -20 : 20;
          const scale = isActive ? 1 : 0.8;
          const opacity = isActive ? 1 : 0.6;

          return (
            <div
              key={index}
              className={`absolute w-full sm:w-96 md:h-60 sm:h-full rounded-xl bg-white shadow-md p-4 flex flex-col justify-between items-center transition-transform duration-500`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: isActive ? 10 : 5,
                boxShadow: "0px 3px 7.6px 1px #00000040",
                marginTop: window.innerWidth <= 915 ? "10px" : "0",
              }}
            >
              <div className="w-full flex flex-row items-center justify-center gap-2">
                <span className="text-[#002446]">{card.icon}</span>
                <h3 className="text-[#002446] font-semibold text-lg">
                  {card.title}
                </h3>
              </div>

              <div className="w-full text-center">{card.content}</div>

              <div
                className="flex justify-end p-[1px] rounded-lg w-28"
                style={{ background: "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)" }}
              >
                <button
                  className="w-28 py-2 text-gray-600 text-sm font-medium bg-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2D54EE] hover:to-[#88FFE9] hover:text-gray-800"
                  onClick={() => navigate(navigateRoutes[card.title] || "/")}
                >
                  View <span className="ml-1">more</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-0 flex gap-2">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? "bg-blue-600" : "bg-gray-400"
              }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel3D;
