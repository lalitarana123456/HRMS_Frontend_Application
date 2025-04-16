import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defualtuser from '../../../../assets/Defualt_User.webp';

function OnLeaveComp() {
    const [usersOnLeave, setUsersOnLeave] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role === 'Employer') {
            axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/leaves/approved-leaves`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const leaveData = response.data.map(user => ({
                        id: user.id,
                        name: user.fullName,
                        role: user.department,
                        leaveType: user.leaveType,
                        profilePhoto:user.profilePhoto

                    }));
                    setUsersOnLeave(leaveData);
                    console.log(leaveData);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching approved leaves:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='bg-white h-96 w-full sm:w-full md:w-[50%] rounded-2xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] p-4'>
            <p className='text-center text-xl font-semibold'>On Leave</p>
            <div className='space-y-2 overflow-y-auto h-40 sm:h-52 md:h-80'>
                {usersOnLeave.map((user) => (
                    <div
                        key={user.id}
                        className='flex justify-between bg-[#DCEDEA] p-1 px-2 rounded-lg'
                    >
                        <div className='flex gap-3'>
                            <img
                                src={user.profilePhoto}
                                alt="Default User"
                                className='2xl:w-10 2xl:h-10 xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-9 md:h-9 sm:w-10 sm:h-10 w-10 h-10  rounded-full'
                            />
                            <div>
                                <p className='text-xs sm:text-xs md:text-xs lg:text-base xl:text-base 2xl:text-base'>{user.name}</p>
                                <p className='text-xs text-[#818181]'>{user.role}</p>
                            </div>
                        </div>
                        <p className='mt-2.5 text-xs sm:text-xs md:text-xs lg:text-base xl:text-base 2xl:text-base text-[#D50000]'>{user.leaveType}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OnLeaveComp;
