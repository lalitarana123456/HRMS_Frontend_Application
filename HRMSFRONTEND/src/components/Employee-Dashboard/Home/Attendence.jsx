import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Attendance() {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [timeSpent, setTimeSpent] = useState({ hours: "00", minutes: "00", seconds: "00" });
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupOptions, setPopupOptions] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkedInState = localStorage.getItem("isCheckedIn");
        if (checkedInState === "true") {
            setIsCheckedIn(true);
            fetchTimer();
        }

        let timerInterval;
        if (isCheckedIn) {
            timerInterval = setInterval(fetchTimer, 1000);
        }

        return () => clearInterval(timerInterval);
    }, [isCheckedIn]);

    const fetchTimer = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/attendence/checkin-time`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const timeParts = response.data.timeSpent.split(":");
            setTimeSpent({
                hours: timeParts[0],
                minutes: timeParts[1],
                seconds: timeParts[2],
            });
        } catch (error) {
            console.error("Error fetching timer:", error);
        }
    };

    const handleAttendance = async (action) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/attendence/handleAttendance`,
                { action },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data.attendance);
            setAttendanceData(response.data.attendance);
                  
            if (response.data.message === "Incomplete attendance record for yesterday.") {
                setShowPopup(true);
                setPopupOptions(response.data.options);
            } else {
                setShowPopup(false);
            }

            if (action === "check-in") {
                setIsCheckedIn(true);
                localStorage.setItem("isCheckedIn", "true");
                fetchTimer(); // Start timer immediately after check-in
            } else if (action === "check-out") {
                setIsCheckedIn(false);
                localStorage.removeItem("isCheckedIn");
                setTimeSpent({ hours: "00", minutes: "00", seconds: "00" });
            }

            toast.success(response.data.message);
        } catch (error) {
            toast.error("Error in attendance!");
        }
        setLoading(false);
    };

    const handlePopupOption = async (userChoice) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/attendence/handleAttendance`,
                { userChoice },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
           
            console.log(response);
            

            if (userChoice === 1) {
                setIsCheckedIn(true);
                localStorage.setItem("isCheckedIn", "true");
                fetchTimer(); // Resume timer
                toast.success("Attendance continued from the previous day.");
            } else if (userChoice === 2) {
                setIsCheckedIn(false);
                localStorage.removeItem("isCheckedIn");
                setTimeSpent({ hours: "00", minutes: "00", seconds: "00" });
                toast.success("Previous attendance closed, and started current date attendance.");
            }
        } catch (error) {
            toast.error("You have selected the wrong option");
        }
        setShowPopup(false);
        setLoading(false);
    };

    return (
        <div
            className="w-full md:w-full bg-white rounded-xl p-4 shadow-lg"
            style={{
                boxShadow: "0px 3px 7.6px 1px #00000040",
                marginTop: window.innerWidth <= 915 ? "10px" : "0",
            }}
        >
            <h2 className="text-center md:text-start text-[100%] md:text-[90%] lg:text-[100%] xl:text-[110%] 2xl:text-[125%] font-lato font-bold text-[#002446]">
                Attendance
            </h2>

            <div className="mt-2 flex md:flex-row flex-col justify-between md:gap-0 gap-4">
                <div className="flex-1 flex md:flex-col flex-row md:justify-normal justify-between">
                    <div className="flex flex-col">
                        <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden">
                            <span>Date:</span>{" "}
                            <span className="text-[#06193F] md:inline block ">
                                {/* {attendanceData?.date ? new Date(attendanceData.date).toLocaleDateString() : "NA"} */}
                                {new Date().toLocaleDateString()} 
                            </span>
                        </p>
                        <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden">
                            <span>In Time:</span>{" "}
                            <span className="text-[#06193F] md:inline block">
                                {attendanceData?.timerStart ? new Date(attendanceData.timerStart).toLocaleTimeString() : "NA"}
                            </span>
                        </p>
                    </div>

                    <div>
                        <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden">
                            <span>Out Time:</span>{" "}
                            <span className="text-[#06193F] md:inline block">
                                {attendanceData?.timerStop ? new Date(attendanceData.timerStop).toLocaleTimeString() : "NA"}
                            </span>
                        </p>

                        <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden">
                            <span>On Leave:</span>{" "}
                            <span className="text-[#00D22D] md:inline block">
                                {attendanceData?.onLeave || "No"}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex-1 mt-4 md:mt-0">
                    <div className="flex justify-center md:justify-end gap-4">
                        {["hours", "minutes", "seconds"].map((unit, index) => (
                            <div key={index} className="p-1 md:h-8 md:w-10 h-12 w-16 bg-[#06305730] flex items-center justify-center rounded-md">
                                <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden font-semibold">
                                    {timeSpent[unit]}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center md:justify-end mt-4 overflow-hidden">
                        <button
                            onClick={() => handleAttendance(isCheckedIn ? "check-out" : "check-in")}
                            disabled={loading || showPopup}
                            className="font-lato text-sm md:w-32 w-48 h-8 text-white font-bold rounded-lg bg-gradient-to-r from-[#2D54EE] to-[#88FFE9] hover:from-[#88FFE9] hover:to-[#2D54EE] transition-all duration-300 z-10 relative"
                        >
                            {isCheckedIn ? "CHECK OUT" : "CHECK IN"}
                        </button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 space-y-2 rounded-lg shadow-lg text-center max-w-xs w-full">
                        <p className="text-lg font-bold text-red-500">Incomplete attendance record for yesterday.</p>
                        <button onClick={() => handlePopupOption(1)} className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Resume Attendance
                        </button>
                        <button onClick={() => handlePopupOption(2)} className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Close Yesterday & Start New
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
