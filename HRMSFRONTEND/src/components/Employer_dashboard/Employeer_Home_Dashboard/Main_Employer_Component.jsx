import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Info_In_Numbers from './Info_In_Numbers';
import LeaveRequestsComp from './Employee_Status/LeaveRequestsComp';
import PayrollStatusComp from './Employee_Status/PayrollStatusComp';
import OnLeaveComp from './Employee_Status/OnLeaveComp';
import TeamPerformanceLineChart from './Team_Performence_LineChart';
import Attendence_BarGraph from './Attendence_BarGraph';
import Notifications from './Notifications';
import EmployerSidebar from '../../Employer-Sidebar/EmployerSidebar';

function Main_Employer_Component() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/announce/fetching`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.announcements) {
        setNotifications(
          response.data.announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Open notifications popup box
  const handleOpenNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleCloseNotification = () => setIsNotificationOpen(false);

  // Close notification popup box when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        handleCloseNotification();
      }
    }

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationOpen]);

  // Open Notification
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  };

  // Post notification
  const handleSend = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/announce/announcements`,
        { title, content: description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.announcement) {
        setNotifications((prevNotifications) => [
          response.data.announcement,
          ...prevNotifications,
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }

      setTitle("");
      setDescription("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error posting notification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-screen h-screen">
      <EmployerSidebar className="fixed"/>
      <div className="p-5 w-full    space-y-5 bg-gradient-to-r from-[#D5EBE7] to-[#F2F6F5] overflow-y-auto">
        
        <div className="p-4 ml-20 sm:ml-20 md:ml-10 -mt-3 sm:-mt-3 md:-mt-4 lg:mt-0 lg:ml-0">
          <div className="flex justify-between">
            <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-lato font-bold">
              Dashboard
            </p>
            <div className="flex gap-3 md:hidden relative">
              {/* Add Button */}
              <p className="text-2xl font-bold cursor-pointer" onClick={handleOpenModal}>
                +
              </p>

              {/* Notification Bell Icon with Badge */}
              <div className="relative cursor-pointer" onClick={handleOpenNotification}>
                <FaBell className="mt-2 text-2xl" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    {notifications.length}
                  </span>
                )}
              </div>

              {/* Get All Notification */}
              {isNotificationOpen && (
                <div
                  ref={notificationRef}
                  className="absolute right-0 top-10 bg-white w-64 shadow-lg rounded-lg p-3 z-50 max-h-96 overflow-y-auto"
                >
                  <div className="flex justify-between items-center border-b pb-2 mb-2">
                    <h3 className="text-lg font-bold">Notifications</h3>
                    <IoMdClose className="text-xl cursor-pointer" onClick={handleCloseNotification} />
                  </div>
                  {notifications.length > 0 ? (
                    <div className="space-y-2">
                      {notifications.map((notification, index) => (
                        <div
                          key={notification._id}
                          className={`flex p-3 rounded-xl shadow-md relative ${index % 2 === 0 ? "bg-[#C8F1DC]" : "bg-[#FFF0C0]"
                            }`}
                        >
                          {/* Side color bar */}
                          <div
                            className={`absolute inset-y-0 left-0 w-2 rounded-tl-3xl ${index % 2 === 0 ? "bg-[#36A163]" : "bg-[#D2A102]"
                              }`}
                          ></div>
                          <div className="ml-4">
                            <p className={`${index % 2 === 0 ? "text-[#B07248]" : "text-[#27AE60]"}`}>
                              <strong>{notification.title}:</strong>
                            </p>
                            <p className={`${index % 2 === 0 ? "text-[#B07248]" : "text-[#27AE60]"}`}>
                              {notification.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">No new notifications.</p>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post Notification */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative z-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Notification</h2>
                <IoMdClose className="text-2xl cursor-pointer" onClick={handleCloseModal} />
              </div>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded mb-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded mb-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleSend}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Components */}
        <Info_In_Numbers />
        <div className="md:flex gap-3">
          <TeamPerformanceLineChart />
          <Notifications />
        </div>
        <Attendence_BarGraph />
        <div className="md:flex space-y-5 md:space-y-0 gap-0 md:gap-5">
          <LeaveRequestsComp />
          <OnLeaveComp />
        </div>
      </div>
      </div>
    </>
  );
}

export default Main_Employer_Component;
