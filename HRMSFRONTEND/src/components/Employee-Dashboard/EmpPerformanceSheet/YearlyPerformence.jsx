import React, { useState, useEffect } from 'react';
import axios from 'axios';
import task from "/task.jpg";
import task2 from "/task2.jpg";
import task3 from "/task3.png";
import task4 from "/task4.png";

const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);

    return [...Array(totalStars)].map((_, index) => (
        <span
            key={index}
            className={`text-[20px] ${index < filledStars ? 'text-yellow-500' : 'text-[#B8AF94]'}`}
        >
            ★
        </span>
    ));
};

export default function YearlyPerformance() {
    const [performanceData, setPerformanceData] = useState(null);
    const [data, setData] = useState([]);
    const token = localStorage.getItem('token');
    const id = "6799cd55ed830c0a04f52b89"; // Employee ID

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First API call
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/performances/yearly`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.length > 0) {
                    setPerformanceData(response.data[0]);
                } else {
                    throw new Error("No data in first API");
                }
            } catch (error) {
                console.error("First API failed, trying second API:", error.message);
                
                try {
                    // Second API call (fallback)
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/administrative/performance/YearlyAndMonthlyPerformance/${id}`);
                    const yearlyPerformance = res.data.yearlyPerformance.find(item => item.year === 2025); // Get latest year
                    if (yearlyPerformance) {
                        setPerformanceData(yearlyPerformance);
                    } else {
                        console.error("No yearly performance data found");
                    }
                } catch (error) {
                    console.error("Second API also failed:", error.message);
                }
            }
        };

        fetchData();
    }, []);

    if (!performanceData) {
        return <p>Loading...</p>;
    }

    const { taskCompletion, attendanceRating, efficiencyScore, teamCollaborationRating } = performanceData;

    const pData = [
        { id: 1, h: "Tasks completed", icon: task, rating: taskCompletion },
        { id: 2, h: "Attendance Rate", icon: task2, rating: attendanceRating },
        { id: 3, h: "Efficiency Score", icon: task3, rating: efficiencyScore },
        { id: 4, h: "Team Collaboration", icon: task4, rating: teamCollaborationRating },
    ];

    return (
        <>
            <p className="mb-5 mt-4 text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-lato font-bold text-[#899096]">Yearly Performance</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
                {pData.map((data) => (
                    <div className="bg-white p-3 sm:p-2 md:p-3 lg:p-4 xl:p-4 2xl:p-5 w-full h-24 sm:h-16 md:h-20 lg:h-24 xl:h-24 2xl:h-28 rounded-2xl shadow-md" key={data.id}>
                        <div className="flex justify-center">
                            <img src={data.icon} alt={data.h} className="size-4 sm:size-4 md:size-5 lg:size-5 xl:size-5 2xl:size-6"/>
                            <p className="text-[#06193F8F] font-lato text-[79%] sm:text-[70%] md:text-[100%] lg:text-[75%] xl:text-[100%] 2xl:text-[110%] ml-2">
                                {data.h}
                            </p>
                        </div>
                        <div className="flex justify-center gap-1">
                            {renderStars(data.rating)}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
