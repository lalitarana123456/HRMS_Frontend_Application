import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home_Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('employeeData'));
        if (userData) {
            setUser(userData);
        }
    }, []);

    if (!user) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className='w-full md:w-[70%] flex'>
            <div className="w-full bg-white rounded-xl p-4 shadow-lg"
                style={{
                    boxShadow: '0px 3px 7.6px 1px rgba(0, 0, 0, 0.25)',
                }}>

                {/* this is for desktop nav */}
                <div className="hidden md:flex items-center justify-between">
                    <h2 className="text-[80%] md:text-[90%] lg:text-[100%] xl:text-[110%] 2xl:text-[125%] font-lato font-bold text-[#002446]">
                        My Profile
                    </h2>
                    <button
                        className="text-[#899096] hover:text-[#002446] transition-colors duration-200 ease-in-out"
                        aria-label="Edit Profile"
                        onClick={() => navigate('/User-Profile')}
                    >
                        <FaEdit className='size-3 md:size-3 lg:size-4' />
                    </button>
                </div>

                {/* this is for mobile nav */}
                <div className="md:hidden flex items-center justify-between">
                    <div></div>
                    <button
                        className="text-[#899096] hover:text-[#002446] transition-colors duration-200 ease-in-out"
                        aria-label="Edit Profile"
                    >
                        <FaEdit size={16} />
                    </button>
                </div>

                <div className="flex sm:flex-row items-start md:space-y-0 md:space-x-[-1%] lg:space-x-[-2%] xl:space-x-[-2%] 2xl:space-x-0">
                    <img 
                        className="object-cover mt-[-4%] sm:mt-[-3.5%] md:mt-0 rounded-full w-16 md:w-[20%] lg:w-[20%] xl:w-24 xl:h-24 2xl:w-28 2xl:h-28"
                        src={user.profilePhoto}
                        alt={`${user.firstName}'s Profile`}
                    />

                    <div className="flex-1 overflow-hidden mt-[-3%] md:mt-0">
                        <div className="md:flex md:space-x-2">
                            <p className="flex text-lg ml-7 sm:text-lg md:text-sm lg:text-sm xl:text-lg 2xl:text-2xl font-lato font-bold md:text-[#002446] overflow-hidden">
                                {user.firstName} &nbsp;{user.lastName}
                            </p>
                            <p className="font-lato ml-7 md:mt-1 lg:mt-1.5 xl:mt-1.5 2xl:mt-2 text-sm md:text-xs lg:text-xs xl:text-sm 2xl:text-base text-[#606060] md:underline overflow-hidden">
                                {user.designation}
                            </p>
                            <p className="md:hidden font-lato ml-7 text-sm sm:text-sm text-[#606060] md:underline overflow-hidden">
                                <span className="text-[#606060]">Employee ID:</span> {user.employeeId}
                            </p>
                        </div>

                        <div className="hidden md:block overflow-hidden ml-7">
                            <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden">
                                <span className='text-[#606060]'>Employee ID:</span> {user.employeeId}
                            </p>
                            <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden">
                                <span className='text-[#606060]'>Email:</span> <span className='text-[#06193F]'>{user.email}</span>
                            </p>
                            <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden">
                                <span className='text-[#606060]'>Date of Joining:</span> <span className='text-[#06193F]'>{user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : 'NA'}</span>
                            </p>
                            <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden">
                                <span className='text-[#606060]'>Employee Status:</span> <span className='text-[#06193F]'>{user.employeeStatus}</span>
                            </p>
                            <p className="font-lato md:text-xs lg:text-xs xl:text-sm 2xl:text-base overflow-hidden">
                                <span className='text-[#606060]'>Phone: </span>{user.contactNumber}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
