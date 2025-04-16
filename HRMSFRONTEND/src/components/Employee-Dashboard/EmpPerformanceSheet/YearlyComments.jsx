import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Comments() {
    const [userData, setUserData] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            axios
                .get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/performances/yearly`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    setUserData(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the user data!', error);
                });
        } else {
            console.log('No token found in localStorage');
        }
    }, [token]);

    // Categories to display
    const sortedCategories = ['Recommendation', 'Warning', 'Alert'];


    const [data,setData]=useState([]);
  

    //employer 
    
        const getApiData = async () => {
    
          // const token = localStorage.getItem('token');
      
      
          // if (token) {
          //   if (token) {
             
           
            try {
              const res = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/administrative/performance/YearlyAndMonthlyPerformance/${id}`
                
    
      
    ,
                {
                  // headers: {
                  //   Authorization: `Bearer ${token}`, // Token ko header me add karo
      
                  // },
      
                });
              console.log("msg" + token);
              console.log(res.data);
            
               setData(res.data||[]);
             
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
        }, [])
      

    return (
        <div className="bg-white w-full mb-10 p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 rounded-lg mt-[-10px] h-auto">
            <p className="text-[#747E94] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold font-lato mb-2">
                Comments
            </p>

            {data||userData.length > 0 ? (
                <div className="space-y-5">
                    {/* Recommendation Section */}
                    <div className="relative bg-[#C8F1DC] px-6 py-2 sm:px-6 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-4 xl:px-8 xl:py-4 2xl:px-8 2xl:py-4 shadow-md rounded-lg">
                        <div className="absolute top-0 left-0 h-full w-2 bg-[#36A163] rounded-l-lg"></div>
                        <p className="font-lato font-bold text-sm sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#176CED]">
                            Recommendation : Certification opportunity
                        </p>

                        <div className="h-auto overflow-y-auto">
                            <ol className="list-decimal pl-3 sm:pl-5 md:pl-5 lg:pl-5 xl:pl-5 2xl:pl-5 h-10 overflow-y-auto sm:h-14 md:h-16 lg:h-14 xl:h-14 2xl:h-14">
                                {userData
                                    .filter(comment => comment.commentCategory === 'Recommendation')
                                    .reverse()
                                    .map(comment => (
                                        <li key={comment._id} className="font-lato font-medium text-sm sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#176CED]">
                                            {comment.commentText}
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    </div>

                    {/* Warning Section */}
                    <div className="relative bg-[#FEF3C7] px-6 py-2 sm:px-6 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-4 xl:px-8 xl:py-4 2xl:px-8 2xl:py-4 shadow-md rounded-lg">
                        <div className="absolute top-0 left-0 h-full w-2 bg-[#DAAE57] rounded-l-lg"></div>
                        <p className="font-lato font-bold text-sm sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#176CED]">
                            Warning : Approaching Deadline
                        </p>

                        <div className="h-auto overflow-y-auto">
                            <ol className="list-decimal pl-3 sm:pl-5 md:pl-5 lg:pl-5 xl:pl-5 2xl:pl-5 h-10 overflow-y-auto sm:h-14 md:h-16 lg:h-14 xl:h-14 2xl:h-14">
                                {userData
                                    .filter(comment => comment.commentCategory === 'Warning')
                                    .reverse()
                                    .map(comment => (
                                        <li key={comment._id} className="font-lato font-medium text-sm sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#176CED]">
                                            {comment.commentText}
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    </div>

                    {/* Alerts Section */}
                    <div className="relative bg-[#FFDFDB] px-6 py-2 sm:px-6 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-4 xl:px-8 xl:py-4 2xl:px-8 2xl:py-4 shadow-md rounded-lg">
                        <div className="absolute top-0 left-0 h-full w-2 bg-[#D9432F] rounded-l-lg"></div>
                        <p className="font-lato font-bold text-sm sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#176CED]">
                            Alerts : Focus on collaboration
                        </p>

                        <div className="h-auto overflow-y-auto">
                            <ol className="list-decimal pl-3 sm:pl-5 md:pl-5 lg:pl-5 xl:pl-5 2xl:pl-5 h-10 overflow-y-auto sm:h-14 md:h-16 lg:h-14 xl:h-14 2xl:h-14">
                                {userData
                                    .filter(comment => comment.commentCategory === 'Alert')
                                    .reverse()
                                    .map(comment => (
                                        <li key={comment._id} className="font-lato font-medium text-sm sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#176CED]">
                                            {comment.commentText}
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">No comments available</p>
            )}
        </div>
    );
}
