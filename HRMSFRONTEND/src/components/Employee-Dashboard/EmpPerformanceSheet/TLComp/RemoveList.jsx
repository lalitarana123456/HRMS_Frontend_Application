import React, { useState, useEffect } from "react";
import { FaArrowLeftLong, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { PiUserCircleMinusFill } from "react-icons/pi";
import { FaUserTimes } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../Sidebar/Sidebar";
import { useParams } from "react-router-dom";

function RemoveList() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchEmployees();
        const interval = setInterval(fetchEmployees, 60000);
        return () => clearInterval(interval);
    }, []);

    const { _id } = useParams();
    console.log(_id)
  

    const role = localStorage.getItem('role');

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authorization token not found in localStorage.");

            let url = 'http://localhost:5000/api/v1/teamLeader/employees/employeeUnderTl';

            if (role === 'Admin' || role === 'Employer') {
                if (!_id) throw new Error("Team Leader ID is required.");
                url += `?teamLeaderId=${_id}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const employeesData = response.data?.alignedEmployees || [];
            setEmployees(employeesData);
            setFilteredEmployees(employeesData);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch employees.");
        }
    };

    useEffect(() => {
        const filtered = employees.filter((emp) =>
            [emp.firstName, emp.lastName, emp.email, emp.employeeId]
                .some(field => field.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredEmployees(filtered);
        setCurrentPage(1);
    }, [searchQuery, employees]);

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const togglePopup = () => {
        if (selectedMembers.length === 0) {
            toast.error("No employees selected.");
            return;
        }
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (employeeId) => {
        setSelectedMembers((prev) =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const handleSelectAll = () => {
        if (selectedMembers.length === employees.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(employees.map(emp => emp.employeeId));
        }
    };

    const handleRemoveMembers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                'http://localhost:5000/api/v1/teamLeader/employees/remove',             
                {
                    data: {
                      employeeIds: selectedMembers,
                      teamLeaderId: _id,
                    },
                    headers: { Authorization: `Bearer ${token}` }
                  }
                );

            setEmployees(employees.filter(emp => !selectedMembers.includes(emp.employeeId)));
            setSelectedMembers([]);
            setIsOpen(false);
            toast.success("Selected members removed successfully.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove employees.");
        }
    };

    return (
        <div className="w-full flex bg-[#D6EAE7]">
            <Sidebar />
            <div className="p-8 w-[100%]">
                {/* Header */}
                <div className='flex gap-4'>
                    <Link to={`/Team/${_id}`} className='md:flex gap-2 hidden'>
                        <FaArrowLeftLong className='mt-1' />
                    </Link>

                    <p className="hidden md:block text-center sm:text-center md:text-start text-base font-bold text-[#002446]">Remove Member(s)</p>
                </div>
                <p className="md:hidden block text-center sm:text-center md:text-start text-base font-bold text-[#002446]">Team Dashboard</p>
                <p className="text-center sm:text-center md:text-start text-sm font-semibold lg:ml-8 ml-0 text-[#899096]">Manage Your Team</p>

                {/* Search & Remove Button */}
                <div className="w-full gap-3 h-14 bg-transparent md:bg-[#F5F9F9] rounded-xl mt-3 py-1 px-2 flex justify-between">
                    <div className="relative flex items-center">
                        <GoSearch className="absolute left-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            className="bg-white w-full md:w-[500px] lg:text-[100%] text-[60%] h-12 rounded-xl pl-10 p-3"
                            placeholder="Search Employee by Name, ID or E-Mail"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button onClick={togglePopup} className="bg-[#D9432F] text-white hidden sm:hidden md:block font-semibold p-2 rounded-xl">
                        Remove Member(s)
                    </button>

                    <div onClick={togglePopup} className="md:hidden block ">
                        <PiUserCircleMinusFill className="text-[#D9432F] size-10 items-center" />
                    </div>

                </div>

                <div className="justify-end items-end mt-8 flex gap-5 font-lato font-bold">
                    <span><input className="w-4 h-4" type="checkbox" onChange={handleSelectAll} checked={paginatedEmployees.every(emp => selectedMembers.includes(emp.employeeId))} /></span>
                    <span>Select All</span>
                </div>

                {/* Table for Desktop*/}
                <div className="overflow-x-auto hidden sm:hidden md:block rounded-xl mt-1 shadow-lg border bg-white">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#F5F9F9]">
                            <tr className="text-[#686868] text-sm font-bold">
                                <th className="h-10">
                                    <span>Select</span>
                                    {/* <span>
                                        <input type="checkbox" onChange={handleSelectAll} checked={paginatedEmployees.every(emp => selectedMembers.includes(emp.employeeId))} />
                                    </span> */}
                                </th>

                                <th className="h-10">
                                    <span className="flex mx-3 items-center md:flex-row flex-col cursor-pointer transition-all duration-300 hover:scale-105">
                                        <svg className="hidden md:block w-3 h-3 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#090a32" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                                        </svg>
                                        <span className="md:text-sm px-6">Name</span>
                                    </span>
                                </th>
                                <th className="h-12 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                    <span className="flex items-center gap-2 md:gap-2">
                                        <svg className='hidden md:block ' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#090a32" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z" /></svg>
                                        <span className="text-xs md:text-sm font-bold font-lato">Email ID</span>
                                    </span>
                                </th>
                                <th className="h-12 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                    <span className="flex items-center gap-2 md:gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#090a32" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z" /></svg>
                                        <span className="text-xs md:text-sm font-bold font-lato">Phone</span>
                                    </span>
                                </th>
                                <th className="h-12 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                    <span className="flex items-center gap-2 md:gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#090a32" d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2M8.715 8c1.151 0 2 .849 2 2s-.849 2-2 2s-2-.849-2-2s.848-2 2-2m3.715 8H5v-.465c0-1.373 1.676-2.785 3.715-2.785s3.715 1.412 3.715 2.785zM19 15h-4v-2h4zm0-4h-5V9h5z" /></svg>
                                        <span className="text-xs md:text-sm font-bold font-lato">Employee ID</span>
                                    </span>
                                </th>
                                <th className="h-12 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                    <span className="flex items-center gap-2 md:gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 56 56"><path fill="#090a32" d="m50.923 21.002l.046.131l.171.566l.143.508l.061.232l.1.42a23.93 23.93 0 0 1-2.653 17.167a23.93 23.93 0 0 1-13.57 10.89l-.404.12l-.496.128l-.717.17a1.89 1.89 0 0 1-2.288-1.558a2.127 2.127 0 0 1 1.606-2.389l.577-.145q.54-.142.929-.273a19.93 19.93 0 0 0 10.899-8.943a19.93 19.93 0 0 0 2.292-13.923l-.069-.313l-.092-.365l-.115-.418l-.138-.47a2.135 2.135 0 0 1 1.26-2.602a1.894 1.894 0 0 1 2.458 1.067M7.385 19.92q.065.02.128.044A2.127 2.127 0 0 1 8.78 22.55q-.27.909-.39 1.513a19.93 19.93 0 0 0 2.295 13.91a19.93 19.93 0 0 0 10.911 8.947l.306.097l.174.05l.39.106l.694.171a2.135 2.135 0 0 1 1.623 2.393a1.894 1.894 0 0 1-2.152 1.594l-.138-.025l-.576-.135l-.51-.13l-.446-.125l-.2-.06A23.93 23.93 0 0 1 7.22 39.972a23.93 23.93 0 0 1-2.647-17.197l.077-.32l.1-.375l.194-.665l.076-.25a1.89 1.89 0 0 1 2.365-1.246M28.051 12c8.837 0 16 7.163 16 16s-7.163 16-16 16s-16-7.163-16-16s7.164-16 16-16m0 4c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.628 0 12-5.373 12-12s-5.372-12-12-12m0-12a23.93 23.93 0 0 1 16.217 6.306l.239.227l.275.274l.31.322l.346.369a1.89 1.89 0 0 1-.205 2.76a2.127 2.127 0 0 1-2.873-.196q-.326-.345-.605-.617l-.35-.334l-.16-.143A19.93 19.93 0 0 0 28.051 8a19.93 19.93 0 0 0-13.204 4.976l-.114.102l-.253.24l-.287.285l-.495.515c-.76.809-2.014.9-2.883.21a1.894 1.894 0 0 1-.305-2.662l.09-.106l.405-.431l.368-.378q.262-.263.484-.465A23.93 23.93 0 0 1 28.05 4" /></svg>
                                        <span className="text-xs md:text-sm font-bold font-lato">Status</span>
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEmployees.map((employee) => (
                                <tr key={employee.employeeId} className="border-b">
                                    <td className="text-center"><input type="checkbox" checked={selectedMembers.includes(employee.employeeId)} onChange={() => handleCheckboxChange(employee.employeeId)} /></td>
                                    <td className="flex-shrink h-14">
                                        <div className="flex items-center flex-col md:flex-row cursor-pointer hover:scale-105 transition-transform duration-300">
                                            <img
                                                src={employee.profilePhoto} alt="profile photo"
                                                className="md:w-8 md:h-8 w-5 h-5 rounded-full border border-black md:m-2"
                                            />
                                            <span className="pl-2 py-1">{employee.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="pr-0 py-0">{employee.email}</td>
                                    <td className="px-0 py-0 ">{employee.contactNumber}</td>
                                    <td className="px-10">{employee.employeeId}</td>
                                    <td className="font-semibold flex items-center mt-5 px-2">
                                        <span
                                            className={`w-2 h-2 rounded-full mr-2 ${employee.status === "online" ? "bg-[#00D22D]" : "bg-[#D24D00]"}`}
                                        ></span>
                                        <span className={employee.status === "online" ? "text-[#00D22D]" : "text-[#D24D00]"}>
                                            {employee.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Numbers for desktop*/}
                <div className="md:flex justify-center mt-6 items-center gap-4 hidden sm:hidden">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                        <FaChevronLeft /> Prev
                    </button>
                    <span className="text-lg font-semibold text-gray-700">Page {currentPage} of {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                        Next <FaChevronRight />
                    </button>
                </div>
                {/* Mobile view emplyees list */}
                <div className="mt-1 sm:block md:hidden">
                    {filteredEmployees.map((item) => (
                        <div key={item._id} className="bg-white w-full rounded-xl shadow-md p-3 mb-4">
                            <div className='flex gap-4'>
                                {item.profilePhoto && (
                                    <img src={item.profilePhoto} alt={item.firstName} className="w-12 h-12 rounded-full" />
                                )}

                                <div>
                                    <p className="font-bold">{`${item.firstName} ${item.lastName}`}</p>
                                    <p className="text-sm text-gray-500">{item.email}</p>
                                    <p><strong>Phone:</strong> {item.contactNumber}</p>
                                    <p><strong>ID:</strong> {item.employeeId}</p>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        <span className={`inline-block w-2 h-2 rounded-full ${item.status === "Online" ? "bg-green-500" : "bg-red-500"}`}></span> {item.status}
                                    </p>
                                </div>

                                <div>
                                    <input type="checkbox" checked={selectedMembers.includes(item.employeeId)} onChange={() => handleCheckboxChange(item.employeeId)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Popup Confirmation */}
                {isOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-md w-[600px] max-h-[80vh] overflow-hidden">
                            <h2 className="text-lg font-bold mb-4">Confirm Removal</h2>
                            <div className="overflow-y-auto max-h-[300px] border">
                                <table className="w-full border-collapse">
                                    <thead className="bg-gray-200 sticky top-0">
                                        <tr>
                                            <th className="border p-2">Name</th>
                                            <th className="border p-2">Email</th>
                                            <th className="border p-2">Phone</th>
                                            <th className="border p-2">Employee ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.filter(emp => selectedMembers.includes(emp.employeeId)).map(emp => (
                                            <tr key={emp.employeeId}>
                                                <td className="flex-shrink h-14 px-0 md:px-4 py-0 md:py-2">
                                                    <div className="flex items-center flex-col md:flex-row cursor-pointer hover:scale-105 transition-transform duration-300">
                                                        <img
                                                            src={emp.profilePhoto} alt="profile photo"
                                                            className="md:w-8 md:h-8 w-5 h-5 rounded-full border border-black md:m-2"
                                                        />
                                                        <span className="pl-2 py-1">{emp.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-0 py-0">{emp.email}</td>
                                                <td className="px-0 py-0">{emp.contactNumber}</td>
                                                <td className="px-0 py-0">{emp.employeeId}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end gap-4 mt-4">
                                <button onClick={() => setIsOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md">
                                    Cancel
                                </button>
                                <button onClick={handleRemoveMembers} className="bg-red-500 text-white px-4 py-2 rounded-md">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default RemoveList;
