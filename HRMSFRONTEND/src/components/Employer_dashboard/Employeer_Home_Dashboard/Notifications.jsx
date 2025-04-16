import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/announce/fetching`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.announcements) {
          setNotifications(response.data.announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
  }, []);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/announce/announcements`,
        {
          title,
          content: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.announcement) {
        setNotifications((prevNotifications) => [response.data.announcement, ...prevNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }

      setTitle('');
      setDescription('');
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error posting notification:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='hidden sm:hidden md:block bg-white md:w-[37%] lg:w-[24%] h-auto rounded-2xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] p-5'>
        <div className='flex justify-between'>
          <p className='text-base sm:text-lg md:text-xl font-bold'>Notification</p>
          <button onClick={handleOpenPopup} className='text-base sm:text-lg md:text-xl font-bold'>+</button>
        </div>

        <div className="mt-4 space-y-5 max-h-[500px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p>No notifications available</p>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification._id}
                className={`flex p-1 rounded-xl shadow-md relative ${index % 2 === 0 ? 'bg-[#C8F1DC]' : 'bg-[#FFF0C0]'}`}
              >
                <div className={`absolute inset-y-0 left-0 w-2 rounded-tl-3xl ${index % 2 === 0 ? 'bg-[#36A163]' : 'bg-[#D2A102]'}`}></div>
                <div className="ml-4">
                  <p className={`${index % 2 === 0 ? 'text-[#B07248]' : 'text-[#27AE60]'}`}>{notification.title}:</p>
                  <p className={`${index % 2 === 0 ? 'text-[#B07248]' : 'text-[#27AE60]'}`}>{notification.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-80 p-5 rounded-lg shadow-xl">
            <h2 className="font-bold text-xl mb-4">Add Notification</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Notifications;
