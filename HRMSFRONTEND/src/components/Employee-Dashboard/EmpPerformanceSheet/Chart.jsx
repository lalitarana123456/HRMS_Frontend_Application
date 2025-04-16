import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

export default function Chart() {
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const id = "6799cd55ed830c0a04f52b89"; // Employee ID

  // Media queries for responsive design
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/performances/monthly`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.log("No token found in localStorage");
    }
  }, [token]);

  useEffect(() => {
    const getApiData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/administrative/performance/YearlyAndMonthlyPerformance/${id}`
        );
        setData(res.data?.monthlyPerformance || []);
      } catch (error) {
        console.error("Error fetching API:", error.message);
      }
    };
    getApiData();
  }, []);

  // Define month name
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Map function in months data
  const chartData = months.map((month) => {
    const userMonthData = userData.find((item) => item.month === month);
    const apiMonthData = data.find((item) => item.month === month);
    
    return {
      month,
      percentage: userMonthData?.overallPerformancePercentage || apiMonthData?.overallPerformancePercentage || 0
    };
  });

  const labelFontSize = isLargeScreen ? 16 : isDesktop ? 14 : 12;

  return (
    <div className="w-full mx-auto mt-5" style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={isDesktop ? 350 : 180}>
        <BarChart data={chartData} barCategoryGap="10%" maxBarSize={70} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={{ fontSize: labelFontSize }}
          />
          <YAxis domain={[0, 100]} tickLine={false} axisLine={false} hide />
          <Bar dataKey="percentage" fill="#60A5FA" radius={[5, 5, 0, 0]}>
            <LabelList
              dataKey="percentage"
              position="top"
              formatter={(value) => `${value}%`}
              style={{ fontSize: labelFontSize, fill: "#AAAAAA", fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
