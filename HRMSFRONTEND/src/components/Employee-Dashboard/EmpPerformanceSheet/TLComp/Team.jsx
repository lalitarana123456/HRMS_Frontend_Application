import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { GoSearch } from "react-icons/go";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../Sidebar/Sidebar';
import { PiUserCirclePlusFill, PiUserCircleMinusFill } from "react-icons/pi";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Team() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

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

            console.log(response.data);

            const employeesData = response.data?.alignedEmployees || [];

            if (employeesData.length === 0) {
                setEmployees([]);
                setFilteredEmployees([]);
                setErrorMessage("No employees under your supervision.");
                return;
            }

            setEmployees(employeesData);
            setFilteredEmployees(employeesData);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch employees.");
            setErrorMessage(error.response?.data?.message || "Failed to fetch employees.");
        }
    };

    useEffect(() => {
        fetchEmployees();
        const interval = setInterval(fetchEmployees, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = employees.filter(employee =>
            employee.firstName.toLowerCase().includes(query) ||
            employee.lastName.toLowerCase().includes(query) ||
            employee.email.toLowerCase().includes(query) ||
            employee.employeeId.toLowerCase().includes(query)
        );
        setFilteredEmployees(filtered);
        setCurrentPage(1);
    }, [searchQuery, employees]);

    const handleViewClick = (_id) => {
        navigate(`/LeaderMonth/${_id}`);
    };

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const linkTo = role === 'Employer' ? '/team-leaders' : '/Employee Performence Sheet Details';

    return (
        <div className='w-[100%] flex bg-[#D6EAE7]'>
            <Sidebar />
            <div className='lg:p-8 p-4 w-[100%]'>
                <div className='flex gap-4'>
                    <Link to={linkTo} className='md:flex gap-2 hidden'>
                        <FaArrowLeftLong className='mt-1' />
                    </Link>

                    <p className="hidden md:block text-center sm:text-center md:text-start text-base font-bold text-[#002446]">Team Dashboard</p>
                </div>
                <p className="md:hidden block text-center sm:text-center md:text-start text-base font-bold text-[#002446]">Team Dashboard</p>
                <p className="text-center sm:text-center md:text-start text-sm font-semibold text-[#899096] lg:ml-8 ml-0">Manage your team</p>


                <div className='overflow-hidden w-full bg-transparent md:bg-[#F5F9F9] rounded-xl mt-3 drop-shadow-lg py-1 px-2 flex justify-between'>
                    <div className='relative flex items-center'>
                        <GoSearch className='absolute left-3 text-gray-400 w-5 h-5' />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='bg-white border w-56 text-[60%] lg:text-[100%] sm:w-96 md:w-[250px] lg:w-[330px] xl:w-[580px] 2xl:w-[800px] h-10 rounded-xl pl-10 p-3 mr-1'
                            placeholder='Search Employee by Name, ID or E-Mail'
                        />
                    </div>
                    
                    {role === 'Employer' && (
                    <div className='mt-1 md:flex sm:hidden hidden'>
                        <button
                        onClick={() => navigate(`/AddEmployee/${_id}`)}>
                            <button className="bg-[#313131] hover:bg-black text-white font-semibold py-2 px-4 rounded-xl">
                                <span className='font-bold'>+</span> &nbsp; Add New Member
                            </button>
                        </button>
                        <button
                        onClick={() => navigate(`/RemoveEmployee/${_id}`)}
                        className='ml-3'>
                            <button className="bg-[#D9432F] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl">
                                Remove Members
                            </button>
                        </button>
                    </div>
                    )}

{role === 'Employer' && (
                    <div className='mt-1 flex md:hidden gap-2'>
                        <Link to={`/AddEmployee/${_id}`}>
                            <button className="text-[#00D22D]">
                                <PiUserCirclePlusFill className='size-10' />
                            </button>
                        </Link>
                        <Link to={`/RemoveEmployee/${_id}`}>
                            <button className="text-[#D9432F]">
                                <PiUserCircleMinusFill className='size-10' />
                            </button>
                        </Link>
                    </div>
)}
                </div>


                <div className='w-full hidden sm:hidden md:block'>
                    <div className="overflow-x-auto rounded-xl mt-8 shadow-lg border bg-white">
                        <table className="w-full border-collapse">
                            <thead className="bg-[#F5F9F9]">
                                <tr className="font-lato text-[#686868] md:text-sm text-[8px] font-bold">
                                    <th className="h-10 px-0 md:px-4 py-0 md:py-2">
                                        <span className="flex mx-3 items-center md:flex-row flex-col cursor-pointer transition-all duration-300 hover:scale-105">
                                            <svg className="hidden md:block w-3 h-3 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="#090a32" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                                            </svg>
                                            <span className="md:text-sm px-6">Name</span>
                                        </span>
                                    </th>

                                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <span className="flex items-center gap-2 md:gap-2">
                                            <svg className='hidden md:block ' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#090a32" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z" /></svg>
                                            <span className="text-xs md:text-sm font-bold font-lato">Email ID</span>
                                        </span>
                                    </th>

                                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <span className="flex items-center gap-2 md:gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#090a32" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z" /></svg>
                                            <span className="text-xs md:text-sm font-bold font-lato">Phone</span>
                                        </span>
                                    </th>

                                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <span className="flex items-center gap-2 md:gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#090a32" d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2M8.715 8c1.151 0 2 .849 2 2s-.849 2-2 2s-2-.849-2-2s.848-2 2-2m3.715 8H5v-.465c0-1.373 1.676-2.785 3.715-2.785s3.715 1.412 3.715 2.785zM19 15h-4v-2h4zm0-4h-5V9h5z" /></svg>
                                            <span className="text-xs md:text-sm font-bold font-lato">Employee ID</span>
                                        </span>
                                    </th>


                                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <span className="flex items-center gap-2 md:gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 56 56"><path fill="#090a32" d="m50.923 21.002l.046.131l.171.566l.143.508l.061.232l.1.42a23.93 23.93 0 0 1-2.653 17.167a23.93 23.93 0 0 1-13.57 10.89l-.404.12l-.496.128l-.717.17a1.89 1.89 0 0 1-2.288-1.558a2.127 2.127 0 0 1 1.606-2.389l.577-.145q.54-.142.929-.273a19.93 19.93 0 0 0 10.899-8.943a19.93 19.93 0 0 0 2.292-13.923l-.069-.313l-.092-.365l-.115-.418l-.138-.47a2.135 2.135 0 0 1 1.26-2.602a1.894 1.894 0 0 1 2.458 1.067M7.385 19.92q.065.02.128.044A2.127 2.127 0 0 1 8.78 22.55q-.27.909-.39 1.513a19.93 19.93 0 0 0 2.295 13.91a19.93 19.93 0 0 0 10.911 8.947l.306.097l.174.05l.39.106l.694.171a2.135 2.135 0 0 1 1.623 2.393a1.894 1.894 0 0 1-2.152 1.594l-.138-.025l-.576-.135l-.51-.13l-.446-.125l-.2-.06A23.93 23.93 0 0 1 7.22 39.972a23.93 23.93 0 0 1-2.647-17.197l.077-.32l.1-.375l.194-.665l.076-.25a1.89 1.89 0 0 1 2.365-1.246M28.051 12c8.837 0 16 7.163 16 16s-7.163 16-16 16s-16-7.163-16-16s7.164-16 16-16m0 4c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.628 0 12-5.373 12-12s-5.372-12-12-12m0-12a23.93 23.93 0 0 1 16.217 6.306l.239.227l.275.274l.31.322l.346.369a1.89 1.89 0 0 1-.205 2.76a2.127 2.127 0 0 1-2.873-.196q-.326-.345-.605-.617l-.35-.334l-.16-.143A19.93 19.93 0 0 0 28.051 8a19.93 19.93 0 0 0-13.204 4.976l-.114.102l-.253.24l-.287.285l-.495.515c-.76.809-2.014.9-2.883.21a1.894 1.894 0 0 1-.305-2.662l.09-.106l.405-.431l.368-.378q.262-.263.484-.465A23.93 23.93 0 0 1 28.05 4" /></svg>
                                            <span className="text-xs md:text-sm font-bold font-lato">Status</span>
                                        </span>
                                    </th>
                                    {role === 'Team Leader' && ( 
                                    <th className="h-12 px-1 md:px-4 py-0 md:py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <span className="flex items-center gap-2 md:gap-2">
                                            <svg className='hidden md:block ' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#090a32" d="M16.5 20.5q-1.65 0-2.825-1.175T12.5 16.5t1.175-2.825T16.5 12.5t2.825 1.175T20.5 16.5q0 .575-.15 1.088t-.425.962L22.3 20.9q.15.125.225.313t.075.387t-.075.375t-.225.325q-.125.125-.312.2t-.388.075t-.375-.075t-.325-.2l-2.375-2.35q-.45.275-.962.413T16.5 20.5m-11 0q-1.65 0-2.825-1.175T1.5 16.5t1.175-2.825T5.5 12.5t2.825 1.175T9.5 16.5t-1.175 2.825T5.5 20.5m0-2q.825 0 1.412-.587T7.5 16.5t-.587-1.412T5.5 14.5t-1.412.588T3.5 16.5t.588 1.413T5.5 18.5m11 0q.825 0 1.413-.587T18.5 16.5t-.587-1.412T16.5 14.5t-1.412.588T14.5 16.5t.588 1.413t1.412.587m-11-9q-1.65 0-2.825-1.175T1.5 5.5t1.175-2.825T5.5 1.5t2.825 1.175T9.5 5.5T8.325 8.325T5.5 9.5m11 0q-1.65 0-2.825-1.175T12.5 5.5t1.175-2.825T16.5 1.5t2.825 1.175T20.5 5.5t-1.175 2.825T16.5 9.5m-11-2q.825 0 1.413-.587T7.5 5.5t-.587-1.412T5.5 3.5t-1.412.588T3.5 5.5t.588 1.413T5.5 7.5m11 0q.825 0 1.413-.587T18.5 5.5t-.587-1.412T16.5 3.5t-1.412.588T14.5 5.5t.588 1.413T16.5 7.5m0-2" /></svg>
                                            <span className="text-xs md:text-sm font-bold font-lato">Action</span>
                                        </span>
                                    </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {paginatedEmployees.map((employee) => (
                                    <tr key={employee.employeeId} className="border-b hover:bg-gray-100 transition">
                                        <td className="flex-shrink h-14 px-0 md:px-4 py-0 md:py-2">
                                            <div className="flex items-center flex-col md:flex-row cursor-pointer hover:scale-105 transition-transform duration-300">
                                                <img
                                                    src={employee.profilePhoto} alt="profile photo"
                                                    className="md:w-8 md:h-8 w-5 h-5 rounded-full border border-black md:m-2"
                                                />
                                                <span className="pl-2 py-1">{employee.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-0 py-0">{employee.email}</td>
                                        <td className="px-0 py-0">{employee.contactNumber}</td>
                                        <td className="px-16">{employee.employeeId}</td>
                                        <td className="px-7 font-semibold flex items-center mt-5">
                                            <span
                                                className={`w-2 h-2 rounded-full mr-2 ${employee.status === "online" ? "bg-[#00D22D]" : "bg-[#D24D00]"}`}
                                            ></span>
                                            <span className={employee.status === "online" ? "text-[#00D22D]" : "text-[#D24D00]"}>
                                                {employee.status}
                                            </span>
                                        </td>
                                        {role === "Team Leader" && (
                                        <td className="p-5 py-0">
                                            <div
                                                className="p-[1.1px] rounded-lg"
                                                style={{
                                                    background: "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)",
                                                }}
                                            >
                                                <button
                                                    onClick={() => handleViewClick(employee._id)}
                                                    className="w-full py-2 text-gray-600 text-sm font-medium bg-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2D54EE] hover:to-[#88FFE9] hover:text-gray-800 hover:scale-105"
                                                >
                                                    View
                                                </button>
                                            </div>
                                            
                                        </td>
                                    )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-6 items-center gap-4">
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
                </div>

                {/* Employee Cards for Mobile */}
                {!errorMessage && filteredEmployees.length > 0 && (
                    <div className="mt-4 sm:block md:hidden">
                        {filteredEmployees.map((item) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-md p-4 mb-4">
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
                                </div>
                                {role === "Team Leader" && (
                                <div
                                    className="p-[1px] rounded-lg"
                                    style={{
                                        background: "linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)",
                                    }}
                                >
                                    <button
                                        onClick={() => handleViewClick(item.employeeId)}
                                        className="w-full py-2 text-gray-600 text-sm font-medium bg-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2D54EE] hover:to-[#88FFE9] hover:text-gray-800 hover:scale-105"
                                    >
                                        View
                                    </button>
                                </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Team;