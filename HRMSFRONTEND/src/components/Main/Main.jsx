import React from 'react';
import Sidebar from '../Employee-Dashboard/Sidebar/Sidebar';
import AdminSidebar from '../Admin-Sidebar/AdminSidebar';
import { Outlet } from 'react-router-dom';

const Main = () => {
  const role = localStorage.getItem('role'); 

  return (
    <div className="flex bg-[#D5EAE7] w-full h-full">
      {role === 'Employee' && <Sidebar />}
      {role === 'Admin' && <AdminSidebar />}
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;

