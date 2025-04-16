import React, { useState, useEffect } from 'react';
import { IoMdMail } from "react-icons/io";
import { MdLocalPhone, MdPhoneInTalk } from "react-icons/md";
import { FaCalendar } from "react-icons/fa6";

export default function Contact_Info({ isEditing, editData, setEditData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white h-max md:h-60 w-full sm:w-[80%] md:w-[52%] lg:w-[50%] xl:w-[51%] 2xl:w-[51%] rounded-xl sm:p-2 md:p-2 p-3 lg:p-5"
            style={{
                boxShadow: '0px 3px 7.6px 1px rgba(0, 0, 0, 0.25)',
            }}>
            <p className="font-lato text-[#002446] text-xl font-bold">Contact Information</p>
            <div className="mt-3 md:flex block justify-between ">
                <div className='flex md:flex-col flex-row md:gap-0 gap-3 md:m-0 mt-3'>
                    <p className="md:block hidden text-sm text-gray-500">Email address</p>
                    <IoMdMail className='text-2xl text-[#002446AB] md:hidden block' />
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={editData.email || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    ) : (
                        <p className="font-lato text-[#002446]">{editData.email || 'NA'}</p>
                    )}
                </div>
                <div className='flex md:flex-col flex-row md:gap-0 gap-3 md:m-0 mt-3'>
                    <p className="md:block hidden text-sm text-gray-500">Phone</p>
                    <MdLocalPhone className='text-2xl text-[#002446AB] md:hidden block' />
                    {isEditing ? (
                        <input
                            type="text"
                            name="contactNumber"
                            value={editData.contactNumber || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    ) : (
                        <p className="font-lato text-[#002446]">{editData.contactNumber || 'NA'}</p>
                    )}
                </div>
            </div>


            <div className="md:mt-14 mt-0 md:flex justify-between">
                <div className='flex md:flex-col flex-row md:gap-0 gap-3 md:m-0 mt-3'>
                    <p className="md:block hidden text-sm text-gray-500">Date of Joining</p>
                    <FaCalendar className='text-2xl text-[#002446AB] md:hidden block' />
                    <p className="font-lato text-[#002446]">
                        {editData.dateOfJoining
                            ? new Date(editData.dateOfJoining).toLocaleDateString()
                            : 'NA'}
                    </p>
                </div>
                <div className='flex md:flex-col flex-row md:gap-0 gap-3 md:m-0 mt-3 mb-3'>
                    <p className="md:block hidden text-sm text-gray-500">Alternate Phone</p>
                    <MdPhoneInTalk className='text-2xl text-[#002446AB] md:hidden block' />
                    {isEditing ? (
                        <input
                            type="text"
                            name="alternativeNumber"
                            value={editData.alternativeNumber || ''}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    ) : (
                        <p className="font-lato text-[#002446]">
                            {editData.alternativeNumber || 'NA'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
