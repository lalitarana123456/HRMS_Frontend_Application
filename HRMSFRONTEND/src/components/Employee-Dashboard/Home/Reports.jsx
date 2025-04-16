import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TbStarFilled, TbStarHalfFilled, TbStar } from "react-icons/tb";
import CardsSlider from './CardsSlider';

export default function Reports() {
    const [userData, setUserData] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [lastTwoLeaves, setLastTwoLeaves] = useState([]);
    const [payrollDetails, setPayrollDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/performances/yearly`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/leaveBalance`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/payslips/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ])
                .then(([yearlyPerformance, leaveBalanceRes, leaveHistory, payslips]) => {
                    setUserData(yearlyPerformance.data);
                    setLeaveBalance(leaveBalanceRes.data.leaveBalance);

                    const sortedLeaves = leaveHistory.data.leaves?.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    ) || [];
                    setLastTwoLeaves(sortedLeaves.slice(0, 2));

                    setPayrollDetails(payslips.data.data[0] || null);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        } else {
            console.log('No token found in localStorage');
            setLoading(false);
        }
    }, [token]);

    const latestReport = userData[userData.length - 1] || {};
    const overallPerformancePercentage = latestReport?.overallPerformancePercentage ?? 0;

    return (
        <>
            <div className="relative w-full">

                <div className="hidden w-full h-auto sm:h-96 md:h-48 lg:h-52 xl:h-52 2xl:h-56 relative z-20 bg-white md:rounded-xl md:flex flex-wrap" style={{ boxShadow: '0px 3px 7.6px 1px #00000040' }}>

                    {/* Leave Report Section */}
                    <div className="md:w-1/3 p-3">
                        <h2 className="text-center font-bold text-[#002446]">Leave Report</h2>
                        <p className="text-[#606060]">Remaining Leave:</p>
                        <p className="font-bold text-[#365FFF]">{loading ? "Loading..." : `${leaveBalance ?? "NA"} Days`}</p>

                        <p className="text-[#606060]">Last Leave Taken:</p>
                        {loading ? (
                            <p>Loading...</p>
                        ) : lastTwoLeaves.length > 0 ? (
                            lastTwoLeaves.map((leave) => (
                                <p key={leave._id}>{leave.leaveType ?? 'NA'} on {leave.startDate ?? 'NA'}</p>
                            ))
                        ) : (
                            <p>NA</p>
                        )}
                        <div className="flex justify-end">
                            <div
                                className="flex justify-end p-[1.1px] rounded-lg w-28"
                                style={{ background: "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)" }}
                            >
                                <button
                                    className="w-28 py-1 lg:py-2 text-gray-600 text-sm font-medium bg-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2D54EE] hover:to-[#88FFE9] hover:text-gray-800"
                                    onClick={() => navigate('/leave')}
                                >
                                    View <span className="ml-1">more</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payroll Details Section */}
                    <div className="md:w-1/3 p-3 border-l-2 border-gray-300">
                        <h2 className="text-center font-bold text-[#002446]">Payroll Details</h2>
                        <p className="text-[#606060]">Total Salary:</p>
                        <p className="font-bold text-[#00D22D]">
                            {loading ? "Loading..." : `₹ ${payrollDetails?.grossSalary?.toLocaleString('en-IN') ?? "NA"}`}
                        </p>
                        <p className="text-[#606060]">Deductions:</p>
                        <p className="font-bold text-[#EC3A3A]">
                            {loading ? "Loading..." : `₹ ${payrollDetails?.deductions?.toLocaleString('en-IN') ?? "NA"}`}
                        </p>

                        <div className="flex justify-end mt-6">
                            <div
                                className="flex justify-end p-[1.1px] rounded-lg w-28"
                                style={{ background: "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)" }}
                            >
                                <button
                                    className="w-28 py-1 lg:py-2 text-gray-600 text-sm font-medium bg-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2D54EE] hover:to-[#88FFE9] hover:text-gray-800"
                                    onClick={() => navigate('/payroll')}
                                >
                                    View <span className="ml-1">more</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Performance Report Section */}
                    <div className="md:w-1/3 p-3 border-l-2 border-gray-300">
                        <h2 className="text-center font-bold text-[#002446]">Performance Report</h2>
                        <div className="flex gap-5">
                            <p className="text-[#606060]">Overall Rating:</p>
                            <div className="flex gap-1 mt-1">
                                {loading ? "Loading..." : (
                                    <>
                                        {Array(Math.floor(latestReport?.overallStarRating ?? 0))
                                            .fill(0)
                                            .map((_, index) => (
                                                <TbStarFilled key={`full-star-${index}`} className="text-yellow-400" />
                                            ))}
                                        {latestReport?.overallStarRating % 1 >= 0.5 && (
                                            <TbStarHalfFilled className="text-yellow-400" />
                                        )}
                                        {Array(5 - Math.ceil(latestReport?.overallStarRating ?? 0))
                                            .fill(0)
                                            .map((_, index) => (
                                                <TbStar key={`empty-star-${index}`} className="text-gray-400" />
                                            ))}
                                    </>
                                )}
                            </div>

                        </div>

                        <p className="text-[#606060]">Goals Progress:</p>
                        <div className="w-full bg-gray-200 rounded-full h-6 mt-2">
                            <div
                                className="bg-gradient-to-r from-[#1D5FA3] to-[#8BC4FF] h-full rounded-full"
                                style={{ width: `${loading ? 0 : overallPerformancePercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-center text-sm text-[#B1B1B1] mt-1">
                            {loading ? "Loading..." : `${overallPerformancePercentage}% completed`}
                        </p>

                        <div className="flex justify-end mt-4">
                            <div
                                className="flex justify-end p-[1.1px] rounded-lg w-28"
                                style={{ background: "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)" }}
                            >
                                <button
                                    className="w-28 py-1 lg:py-2 text-gray-600 text-sm font-medium bg-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2D54EE] hover:to-[#88FFE9] hover:text-gray-800"
                                    onClick={() => navigate('/Employee Performence Sheet Details')}
                                >
                                    View <span className="ml-1">more</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-20 mt-7 mb-56 block md:hidden">
                    <CardsSlider />
                </div>
            </div>
        </>
    );
}
