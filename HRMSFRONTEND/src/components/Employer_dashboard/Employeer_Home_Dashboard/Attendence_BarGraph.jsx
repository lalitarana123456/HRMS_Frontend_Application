import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const BarChart = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (token && role === 'Employer') {
            axios
                .get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/administartive/attendance/department-wise`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setAttendanceData(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const data = {
        labels: attendanceData.map((item) => item.designation),
        datasets: [
            {
                label: 'Attendance',
                data: attendanceData.map((item) => parseFloat(item.percentage)),
                backgroundColor: ['#00E396', '#60A5FA', '#A735CA', '#FF0000', '#FF73DA', '#FF9500', '#28A745'],
                borderWidth: 1,
                barThickness: 'flex',
                maxBarThickness: 50,
                minBarLength: 5,
                borderRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: { enabled: true },
            datalabels: {
                display: true,
                color: '#000',
                font: { size: 14 },
                align: 'top',
                anchor: 'end',
                formatter: (value) => `${value}%`,
            },
        },
        scales: {
            x: {
                display: true,
                grid: { display: false },
                barPercentage: 0.6, // Ensures bars have spacing
                categoryPercentage: 0.7, // Controls spacing between categories
            },
            y: {
                display: false,
                grid: { display: false },
            },
        },
    };

    return (
        <div className="w-full h-[320px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] bg-white rounded-2xl mt-6 p-3 drop-shadow-lg">
            <p className="text-lg sm:text-2xl px-4 sm:px-6 mb-2">
                Attendance <span className="text-sm text-[#A1A1A1]">{attendanceData.length > 0 ? attendanceData[0].month : ''}</span>
            </p>

            <div className="flex justify-center items-center h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] bg-[#E3F0ED] rounded-2xl">
                {loading ? <p>Loading...</p> : <Bar data={data} options={options} />}
            </div>
        </div>
    );
};

export default BarChart;
