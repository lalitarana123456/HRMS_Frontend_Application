import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ChartDataLabels);

const TeamPerformanceLineChart = () => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (token && role === "Employer") {
      axios
        .get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/administrative/performance/designation-wise`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const formattedData = formatChartData(response.data);
          // console.log("Line Chart",formattedData)
          setChartData(formattedData);
          setLoading(false);
          // console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token, role]);

  // Format the API data to match the chart's structure
  const formatChartData = (data) => {
    const teamDesignations = [
      "UI/UX", "Front-End", "Back-End", "Research", "HR", "Social Media"
    ];

    const formattedData = {
      labels: months,
      datasets: teamDesignations.map((designation) => {
        const designationData = data.filter(item => item.designation === designation);
        const percentages = months.map(month => {
          const monthData = designationData.find(item => item.month.startsWith(month));
          return monthData ? parseFloat(monthData.percentage.replace('%', '')) : 0;
        });
        
        return {
          label: designation,
          data: percentages,
          pointRadius: 4,
          backgroundColor: getDesignationColor(designation),
          borderColor: getDesignationColor(designation),
          tension: 0.4,
        };
      }),
    };

    return formattedData;
  };

  // Helper function to get the color for each designation
  const getDesignationColor = (designation) => {
    const colorMapping = {
      "UI/UX": "#34D399",
      "Front-End": "#008FFB",
      "Back-End": "#A735CA",
      "Research": "#FF0000",
      "HR": "#FF73DA",
      "Social Media": "#FF9500",
    };
    return colorMapping[designation] || "#000000";
  };

  const handlePointClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      setSelectedMonthIndex(clickedIndex);
      setShowPopup(true);
    }
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="relative bg-white shadow-lg p-4 sm:p-6 rounded-2xl md:w-[60%] lg:w-[75%] max-w-[100%] h-auto drop-shadow-md">
      <h1 className="text-base sm:text-lg md:text-xl font-bold mb-4">Team Performance</h1>

      <div className="relative w-full h-[300px] sm:h-80 md:h-80 lg:h-[500px] xl:h-[500px] 2xl:h-[500px]">
        {loading ? (
          <div>Loading...</div>
        ) : chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 12,
                    font: {
                      size: 10, // Adjust font size for mobile
                    },
                  },
                },
                datalabels: {
                  display: false,
                },
                tooltip: { enabled: false },
              },
              onClick: handlePointClick,
              scales: {
                x: {
                  ticks: {
                    color: (ctx) => (ctx.index === selectedMonthIndex ? "#2563EB" : "#374151"),
                    font: {
                      size: 10,
                      weight: (ctx) => (ctx.index === selectedMonthIndex ? "bold" : "normal"),
                    },
                  },
                  grid: { display: false },
                },
                y: {
                  ticks: {
                    font: { size: 10 },
                  },
                  min: 0,
                  max: 100,
                  grid: { display: true },
                },
              },
            }}
          />
        ) : (
          <div>No data available</div>
        )}
      </div>

      {showPopup && (
        <div className="absolute bg-white shadow-lg rounded-lg top-20 left-14 sm:top-24 sm:left-16 w-32 sm:w-32 md:w-32 lg:w-36 xl:w-36 border border-gray-300 z-10 p-2">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-500">{months[selectedMonthIndex]}</h2>
            <button className="text-gray-500 hover:text-gray-800 text-sm" onClick={closePopup}>
              ✕
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {chartData?.datasets.map((dataset) => (
              <li key={dataset.label} className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: dataset.backgroundColor }}></span>
                  <span className="text-xs text-gray-600">{dataset.label}</span>
                </span>
                <span className="text-xs text-gray-600">{dataset.data[selectedMonthIndex]}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TeamPerformanceLineChart;
