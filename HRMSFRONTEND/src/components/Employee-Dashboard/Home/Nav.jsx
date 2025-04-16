import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import classNames from "classnames";  // Install this if not available: npm install classnames

export default function Nav() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const [announcementsRes, eventsRes,notificationsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/announce/fetching`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/upcomingevent/events`),
                    axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/performances/notifications`,
                  {  headers: { Authorization: `Bearer ${token}`} }),
                ]);

                let fetchedNotifications = [];

                if (announcementsRes.data?.announcements) {
                    fetchedNotifications = announcementsRes.data.announcements.map(item => ({
                        _id: item._id,
                        title: item.title,
                        content: item.content,
                        createdAt: item.createdAt
                    }));
                }
                console.log(announcementsRes.data);

                if (eventsRes.data?.events) {
                    const eventNotifications = eventsRes.data.events.map(event => ({
                        _id: event._id,
                        title: event.title,
                        content: event.description,
                        createdAt: event.createdAt
                    }));
                    fetchedNotifications = [...fetchedNotifications, ...eventNotifications];
                }

                if (notificationsRes.data?.notifications?.length) {
                    const performanceNotifications = notificationsRes.data.notifications.map(notif => ({
                        _id: notif?._id || "no-id",
                        title: notif?.title || "No Title",
                        content: notif?.message || "No Content",
                        createdAt: notif?.createdAt || new Date().toISOString()
                    }));

                   
                    fetchedNotifications = [...fetchedNotifications, ...performanceNotifications];
                }
                console.log(notificationsRes.data);

                // Sort notifications (Newest first)
                fetchedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setNotifications(fetchedNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <>
            {/* Navigation Bar */}
            <nav className="flex w-full px-5 md:px-10 lg:px-0">
                <div className="container flex justify-between relative py-3 md:py-5 -mt-2 lg:mt-0">
                    <div className="block lg:hidden"></div>
                    <h1 className="font-lato text-lg md:text-2xl font-bold text-[#002446]">
                        <a href="#">My Dashboard</a>
                    </h1>
                    <div className="flex items-center gap-4 relative">

                        {/* Notification Icon */}
                        <div
                            className="relative cursor-pointer"
                            onClick={() => setShowNotifications((prev) => !prev)}
                        >
                            <FaBell className="text-black text-xl md:text-2xl" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            )}
                        </div>

                        {/* Notification PopUp Box */}
                        <div
                            className={classNames(
                                "absolute top-12 md:top-7 right-0 md:right-4 w-72 md:w-60 max-h-96 bg-white shadow-lg rounded-lg z-50 overflow-y-auto transition-all duration-300 ease-in-out",
                                showNotifications ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 pointer-events-none"
                            )}
                            style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                        >
                            <div className="w-full h-12 bg-[#F5F5F5] flex items-center justify-center rounded-t-lg shadow-md">
                                <h3 className="font-bold text-gray-700 text-lg">Notifications</h3>
                            </div>

                            {/* Notification List */}
                            <ul className="text-sm p-4 space-y-3 overflow-y-auto max-h-[85%] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <li
                                            key={notification._id}
                                            className="p-3 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200 ease-in-out shadow-sm"
                                        >
                                            <h4 className="font-bold text-[#06193F]">{notification.title}</h4>
                                            <p className="text-[#B1B1B1] text-sm">{notification.content}</p>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-center text-gray-500">No new notifications</li>
                                )}
                            </ul>
                        </div>

                    </div>
                </div>
            </nav>
        </>
    );
}
