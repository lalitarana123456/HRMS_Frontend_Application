import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaRegUser, FaCamera } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from '../../Sidebar/Sidebar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddEmployee() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
    };

    const { _id } = useParams();
    console.log(_id)

    const handleSaveMember = async () => {
        const token = localStorage.getItem("token");
        const employeeData = {
            fullName,
            email,
            contactNumber,
            employeeId,
            teamLeaderId: _id,
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/teamLeader/employees/addEmployee',
                employeeData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success("Employee added successfully!");
            setTimeout(() => navigate(`/Team/${_id}`), 1000);
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error("API Error:", error.response.data.message);
                toast.error(error.response.data.message || "An error occurred.");
            } else {
                toast.error("Error adding employee:", error);
                toast.error("Failed to add employee. Please try again.");
            }
        }
    };

    return (

        <div className='w-[100%] flex bg-[#D6EAE7]'>
            <Sidebar />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <div className="p-8 w-full h-full">
                <div className="flex sm:gap-72 md:gap-4">
                    <Link to={`/Team/${_id}`} className="mt-5 lg:mt-2">
                        <FaArrowLeftLong />
                    </Link>
                    <p className="hidden md:block text-center sm:text-center md:text-start text-xs sm:text-base md:text-lg lg:text-xl font-bold text-[#002446]">
                        Add Members
                    </p>
                </div>
                <p className="md:hidden block text-center sm:text-center md:text-start text-base sm:text-base md:text-lg lg:text-xl font-bold text-[#002446]">
                    Add Members
                </p>
                <p className="text-center sm:text-center md:text-start text-xs sm:text-sm md:text-sm lg:text-base font-semibold text-[#899096] ml-8">
                    Enter the details of the new team member below
                </p>

                {/* Desktop and Tab View */}
                <div className="hidden md:block w-full h-[460px] bg-white rounded-lg mt-5">
                    <div className="flex items-center justify-center relative">
                        <div className="w-24 h-24 mt-2 bg-[#F3F4F6] rounded-full overflow-hidden flex items-center justify-center relative">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile Preview"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <FaRegUser className="text-4xl text-[#909090]" />
                            )}
                            {preview && (
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white text-xs p-1 rounded-full hover:bg-red-600"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                        {!preview && (
                            <label className="absolute mt-[65px] ml-16 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                                <FaCamera />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <p className="text-blue-600 text-center">Upload Photo</p>

                    <div>
                        <div className="flex justify-between px-16 mt-5">
                            <div>
                                <label htmlFor="fullName" className="block text-[18px] font-medium">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-0 sm:w-48 md:w-60 lg:w-72 xl:w-[400px] h-10 px-6 py-2 border-[1px] border-[#B4B4B4] rounded-xl placeholder-gray-400 focus:outline-none"
                                    placeholder="Enter Full Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-[18px] font-medium">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-0 sm:w-48 md:w-60 lg:w-72 xl:w-[400px] h-10 px-6 py-2 border-[1px] border-[#B4B4B4] rounded-xl placeholder-gray-400 focus:outline-none"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between px-16 mt-8">
                            <div>
                                <label htmlFor="contactNumber" className="block text-[16px] font-medium">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="contactNumber"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    className="w-0 sm:w-48 md:w-60 lg:w-72 xl:w-[400px] h-10 px-6 py-2 border-[1px] border-[#B4B4B4] rounded-xl placeholder-gray-400 focus:outline-none"
                                    placeholder="Enter Contact Number"
                                />
                            </div>

                            <div>
                                <label htmlFor="employeeId" className="block text-[18px] font-medium">
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    id="employeeId"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    className="sm:w-48 md:w-60 lg:w-72 xl:w-[400px] h-10 px-6 py-2 border-[1px] border-[#B4B4B4] rounded-xl placeholder-gray-400 focus:outline-none"
                                    placeholder="Enter Employee ID"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="justify-between flex px-14 py-8">
                        <Link to={`/Team/${_id}`} >
                            <button className="hover:bg-cyan-100 text-black border-1 border font-semibold py-[5px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300">
                                Cancel
                            </button>
                        </Link>

                        <div>
                            <button
                                onClick={handleSaveMember}
                                className="bg-[#313131] hover:bg-black text-white border-1 border font-semibold py-[5px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Save Member
                            </button>
                        </div>
                    </div>
                </div>


                {/* Mobile view only */}

                <div className="md:hidden block w-full mt-5">
                    <div className="flex items-center justify-center relative">
                        <div className="w-16 h-16 mt-2 bg-[#F3F4F6] rounded-full overflow-hidden flex items-center justify-center relative">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile Preview"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <FaRegUser className="text-4xl text-[#909090]" />
                            )}
                            {preview && (
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white text-xs p-1 rounded-full hover:bg-red-600"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                        {!preview && (
                            <label className="absolute w-6 h-6 mt-[55px] ml-16 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                                <FaCamera className="size-3 mt-[-3px] ml-[-2px]" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <p className="text-blue-600 text-center">Upload Photo</p>

                    <div className="p-5">
                        <label htmlFor="fullName" className="block text-[18px] font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full h-10 px-6 py-2 border-[1px] border-[#B4B4B4] rounded-xl placeholder-gray-400 focus:outline-none"
                            placeholder="Enter Full Name"
                        />
                        <label htmlFor="email" className="block text-[18px] font-medium">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-10 px-6 py-2 border-[1px] border-[#B4B4B4] rounded-xl placeholder-gray-400 focus:outline-none"
                            placeholder="Enter email address"
                        />
                        <label htmlFor="contactNumber" className="block text-[16px] font-medium">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="contactNumber"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="w-full h-10 px-6 py-2 border-[1px] border-[#B4B4B4] rounded-xl placeholder-gray-400 focus:outline-none"
                            placeholder="Enter Contact Number"
                        />
                        <label htmlFor="employeeId" className="block text-[18px] font-medium">
                            Employee ID
                        </label>
                        <input
                            type="text"
                            id="employeeId"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="w-full h-10 px-6 py-2 border-[1px] border-[#B4B4B4] rounded-xl placeholder-gray-400 focus:outline-none"
                            placeholder="Enter Employee ID"
                        />
                    </div>

                    <div className="justify-between flex p-5">
                        <Link to={`/Team/${_id}`} >
                            <button className="hover:bg-cyan-100 border-[#BEBEBE] text-black border-1 border font-semibold py-[5px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300">
                                Cancel
                            </button>
                        </Link>

                        <div>
                            <button
                                onClick={handleSaveMember}
                                className="bg-[#313131] hover:bg-black text-white border-[#BEBEBE] border font-semibold py-[5px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Save Member
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AddEmployee;
