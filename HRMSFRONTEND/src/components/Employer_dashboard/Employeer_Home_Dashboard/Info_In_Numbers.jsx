import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Info_In_Numbers() {
    const [totalEmployees, setTotalEmployees] = useState(null);
    const [totalLeaves, setTotalLeaves] = useState(null);
    const [newJoinies, setNewJoinies] = useState(null);
    const [fullTimers, setFullTimers] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem('token');
    // console.log("Token", token)

    useEffect(() => {
        if (!token) {
            console.warn('No token found, restricting access.');
            return;
        }

        setIsAuthenticated(true);

        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const employeesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employees/count`, config);
                setTotalEmployees(employeesResponse.data.totalEmployees);

                // console.log(employeesResponse);

                const leavesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employees/leaves/count`, config);
                setTotalLeaves(leavesResponse.data.leaveCount);

                const joiniesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employees/Intern/count`, config);
                setNewJoinies(joiniesResponse.data.internEmployees);
                // console.log("New Joinees API Response:", joiniesResponse.data);

                const fullTimersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employees/fulltime/count`, config);
                setFullTimers(fullTimersResponse.data.fullTimeEmployees);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {!isAuthenticated ? (
                <p className="text-center text-red-500 font-semibold">Access Denied. Please log in.</p>
            ) : (
                <div className='flex gap-1 sm:gap-2 md:gap-3 lg:gap-5 xl:gap-6'>
                    {/* Total Employees */}
                    <div className='bg-[#E9FFE7] w-[25%] h-[20%] sm:w-[30%] sm:h-[25%] md:w-[30%] md:h-[25%] lg:w-[35%] lg:h-[30%] xl:w-[40%] xl:h-[35%] 2xl:w-[40%] 2xl:h-[35%] py-4 sm:py-5 md:py-4 lg:py-5 xl:py-5 2xl:py-5 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] rounded-2xl'>
                        <p className='text-center text-[9px] sm:text-[70%] md:text-[90%] lg:text-base xl:text-lg 2xl:text-2xl font-lato font-semibold'>Total Employees</p>
                        <p className='text-center text-[9px] sm:text-[70%] md:text-[90%] lg:text-base xl:text-lg 2xl:text-2xl font-semibold text-[#0C8F00]'>{totalEmployees}</p>
                    </div>

                    {/* Number of Leave */}
                    <div className='bg-[#E9FFE7] w-[25%] h-[20%] sm:w-[30%] sm:h-[25%] md:w-[30%] md:h-[25%] lg:w-[35%] lg:h-[30%] xl:w-[40%] xl:h-[35%] 2xl:w-[40%] 2xl:h-[35%] py-4 sm:py-5 md:py-4 lg:py-5 xl:py-5 2xl:py-5 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] rounded-2xl'>
                        <p className='text-center text-[9px] sm:text-[70%] md:text-[90%] lg:text-base xl:text-lg 2xl:text-2xl font-semibold'>Number of Leave</p>
                        <p className='text-center text-[9px] sm:text-[70%] md:text-[90%] lg:text-base xl:text-lg 2xl:text-2xl font-semibold text-[#C10000]'>{totalLeaves}</p>
                    </div>

                    {/* New Joinee */}
                    <div className='bg-[#E9FFE7] w-[25%] h-[20%] ssm:w-[30%] sm:h-[25%] md:w-[30%] md:h-[25%] lg:w-[35%] lg:h-[30%] xl:w-[40%] xl:h-[35%] 2xl:w-[40%] 2xl:h-[35%] py-4 sm:py-5 md:py-4 lg:py-5 xl:py-5 2xl:py-5 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] rounded-2xl'>
                        <p className='text-center text-[9px] sm:text-[70%] md:text-[90%] lg:text-base xl:text-lg 2xl:text-2xl font-semibold'>New Joinee</p>
                        <p className='text-center text-[9px] sm:text-[70%] md:text-[90%] lg:text-base xl:text-lg 2xl:text-2xl font-semibold text-[#0088C7]'>{newJoinies}</p>
                    </div>

                    {/* Full Timers */}
                    <div className='bg-[#E9FFE7] w-[25%] h-[20%] sm:w-[30%] sm:h-[25%] md:w-[30%] md:h-[25%] lg:w-[35%] lg:h-[30%] xl:w-[40%] xl:h-[35%] 2xl:w-[40%] 2xl:h-[35%] py-4 sm:py-5 md:py-4 lg:py-5 xl:py-5 2xl:py-5 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] rounded-2xl'>
                        <p className='text-center text-[9px] sm:text-[70%] md:text-[90%] lg:text-base xl:text-lg 2xl:text-2xl font-semibold'>Full Timers</p>
                        <p className='text-center text-[9px] sm:text-[70%] md:text-[90%] lg:text-base xl:text-lg 2xl:text-2xl font-semibold text-[#B07248]'>{fullTimers}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Info_In_Numbers;
