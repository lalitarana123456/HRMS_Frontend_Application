import React from 'react';
import { FaRegEdit, FaSave } from "react-icons/fa";
import axios from 'axios';

export default function Nav({ isEditing, setIsEditing, handleSave }) {
    const userRole = localStorage.getItem('role');

    if (userRole === 'Employer') {
        return null;
    }

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        }
        setIsEditing(!isEditing);
    };

    return (
        <nav className="flex w-full">
            <div className="container mx-auto flex md:justify-between justify-end mt-[-5px] gap-8 items-center">
                <h1 className="font-lato text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] font-bold text-[#002446]">
                    My Profile
                </h1>

                <button
                    className="flex items-center justify-center gap-2 md:py-1 md:px-3 py-2 px-4 md:bg-transparent bg-white rounded-full border border-[#A29F9F] text-[#494949] hover:bg-slate-300 transition-all text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw]"
                    onClick={toggleEdit}
                >
                    {isEditing ? (
                        <>
                            <FaSave className='text-base' />
                            <span className='text-base'>Save</span>
                        </>
                    ) : (
                        <>
                            <FaRegEdit className='text-base' />
                            <span className='text-base'>Edit</span>
                        </>
                    )}
                </button>
            </div>
        </nav>
    );
}
