import React, { useState, useEffect } from 'react';

export default function Employee_Details({ isEditing, editData, setEditData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            }
        }));
    };
    

    return (
        <div className="md:bg-white md:shadow-[0px_3px_7.6px_1px_#00000040] shadow-none relative w-full sm:w-[80%] md:w-[99%] lg:w-[97%] xl:w-[97.5%] 2xl:w-full h-max sm:h-60 md:h-40 lg:h-44 xl:h-48 2xl:h-56 flex md:flex-row flex-col md:gap-0 gap-3 rounded-xl sm:p-2 md:p-2 p-0 py-3 lg:p-5"
       >
            <div className="md:w-[50%] shadow-[0px_3px_7.6px_1px_#00000040] md:shadow-none md:bg-transparent bg-white w-full block md:pr-10 pr-3 md:p-0 p-3 md:rounded-none rounded-xl">
                <p className="font-lato text-[#002446] text-xl font-bold">Employment Details</p>
                <div className="mt-3 flex justify-between">
                    <div className="leading-5">
                        <p className="font-lato text-[#707070] text-sm">Employee Status</p>
                        <p className="font-lato text-[#002446] text-sm">
                            {editData.employeeStatus || 'NA'}
                        </p>
                    </div>
                    <div className="leading-5">
                        <p className="font-lato text-[#707070] text-sm">Leader</p>
                        <p className="font-lato text-[#002446] text-sm">
                            {editData.teamLeader || 'NA'}
                        </p>
                    </div>
                </div>
                <div className='md:hidden block mt-2'>
                <p className="font-lato text-[#707070] text-sm">Employement Status</p>
                        <p className="font-lato text-[#27AE60] text-sm">
                            {editData.employeeStatus || 'NA'}
                        </p>
                </div>
            </div>

            
            <div className="md:w-[50%] md:bg-transparent bg-white w-full block md:px-3 px-3 md:rounded-none rounded-xl sm:px-8 md:border-l-2 border-[#A6BFCF9C] shadow-[0px_3px_7.6px_1px_#00000040] md:shadow-none">
                <p className="font-lato text-[#002446] text-xl font-bold">Address</p>
                <div className="mt-3 flex md:flex-row flex-col gap-3 justify-between">
                    <div className="md:w-[50%] w-full">
                        <div className="leading-5">
                            <p className="font-lato text-[#707070] text-sm">Address Line</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="completeAddress"
                                    value={editData.address?.completeAddress || ''}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 w-full"
                                />
                            ) : (
                                <p className="font-lato text-[#06193F] text-sm">{editData.address?.completeAddress || 'NA'}</p>
                            )}
                        </div>
                        <div className="leading-5 md:mt-5 mt-3">
                            <p className="font-lato text-[#707070] text-sm">Postal Code</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={editData.address?.postalCode || ''}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 w-full"
                                />
                            ) : (
                                <p className="font-lato text-[#06193F] text-sm">{editData.address?.postalCode || 'NA'}</p>
                            )}
                        </div>
                    </div>
                    <div className="leading-5">
                        <p className="font-lato text-[#707070] text-sm">City</p>
                        {isEditing ? (
                            <input
                                type="text"
                                name="city"
                                value={editData.address?.city || ''}
                                onChange={handleChange}
                                className="border rounded px-2 py-1 w-full"
                            />
                        ) : (
                            <p className="font-lato text-[#06193F] text-sm">{editData.address?.city || 'NA'}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
