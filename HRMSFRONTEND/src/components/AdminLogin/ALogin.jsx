import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Looper from "/Looper.png";
import AdminLogo from "/AdminLogo.png";
import Axios from "axios";
import "./ALogin.css";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ALogin() {
  const [loginInfo, setLoginInfo] = useState({ userName: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await Axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/admin/auth/adminLogin`, {
        userName: loginInfo.userName,
        password: loginInfo.password,
      });
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "Admin");  // Set role for admin
  
      toast.success("Login Successful");
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <>
      <div className="absolute flex">
        <img
          src={AdminLogo}
          alt="The Assigner Logo"
          className="w-16 h-16 ml-4 mt-4"
        />
        <p className="text-[32px] leading-[38.4px] font-chonburi font-normal mt-8 ml-4">THE ASSIGNER</p>
      </div>

      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={Looper} alt="background" className="w-full iheight" />
        </div>

        <div className="flex justify-center mt-18">
          <div className="border mt-2 inner ml-14 z-10 h-max bg-opacity-30 backdrop-blur-md  shadow-xl">
            <br />
            <p className="text-[32px] leading-9 mb-4 ml-32 mt-3 font-medium font-roboto">
              HRMS admin Login
            </p>
            <br />
            <br />
            <form
              className="space-y-2 space-x-14 mr-10"
              onSubmit={handleLogin}
            >
              <label htmlFor="userName" className=" ml-14 text-[24px] font-roboto text-[#000000] leading-7">
                Enter your Username
              </label>
              <br />
              <input
                type="text"
                className="mt-1 block px-3 py-2 border font-roboto text-[#696767] bg-[#FFFFFF]  border-gray-300 rounded-md shadow-sm focus:outline-none  w-96 h-10"
                placeholder="Enter your Name"
                id="userName"
                name="userName"
                value={loginInfo.userName}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, userName: e.target.value })
                }
                required
              />
              <br />
              <label htmlFor="password" className="text-[24px] font-roboto text-[#000000] leading-7">
                Enter your Password
              </label>
              <br />
              <input
                type="password"
                className="mt-1 block px-3 py-2 border font-roboto text-[#696767] bg-[#FFFFFF]  border-gray-300 rounded-md shadow-sm focus:outline-none  w-96 h-10"
                placeholder="Enter your password"
                id="password"
                name="password"
                value={loginInfo.password}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, password: e.target.value })
                }
                required
              />
              <div className="flex justify-between items-center text-sm">
                <a href="#" className=" cursor-pointer ml-64 font-roboto font-normal text-[16px] leading-[18.75px] text-[#000000]">
                  Forgot Password?
                </a>
              </div>
              <br />
              <br />
              <button
                type="submit"
                className="ml-20 font-roboto w-96 font-semibold text-[20px] leading-[23.44px] py-2 rounded-md focus:outline-none bcolor h-10"
              >
                Log in
              </button>
              <br />
              <br />
              <br />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ALogin;
