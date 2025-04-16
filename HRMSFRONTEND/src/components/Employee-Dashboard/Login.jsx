import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // const backendhosted = import.meta.env.VITE_BACKEND_LIVE;

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    if (e.target.checked) {
      // Reset any other states if necessary, like forgot password
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/admin/auth/adminLogin`, {
        email: loginInfo.email,
        password: loginInfo.password,
      });
  
      const { token, role, employeeData } = response.data;
  
      if (token && role) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('employeeData', JSON.stringify(employeeData));
  
        if (role === 'Employer') {
          navigate('/Company Home');
        } else if (role === 'Employee' || 'Team Leader') {
          navigate('/dashboard');
        }
  
        toast.success('Login Successful');
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };
  
  
  
  
  

  return (
    <div
      id="main"
      className="w-full h-screen flex flex-col lg:flex-row lg:bg-[#F5F5F5]">

      <div
        id="first"
        className="lg:w-[50%] h-full rounded-tr-[25px] rounded-br-[25px] bg-gradient-to-b from-[#4FC7B1] via-[#4FC7B1] to-[#70FFE5] lg:relative items-center justify-center hidden lg:block md:w-[50%]">
        <img
          className='lg:w-[70%] lg:h-[80%] mt-[24%] z-10 lg:absolute lg:bottom-0'
          src="./dodos.png" alt="" />
      </div>

      <div
        id="second"
        className='relative flex-1 h-full flex justify-center items-center lg:bg-[#F5F5F5] bg-transparent lg:w-[50%]'>

        <img
          className='w-[80%] h-[70%] lg:bottom-0 lg:absolute hidden lg:block'
          src="./Plants.png" alt="" />

        <div
          className='lg:w-[60%] lg:h-[70%] lg:border-2 lg:border-[#06305733] lg:bg-white lg:z-50 lg:items-center lg:justify-between rounded-[25px] md:w-[332px] md:h-[500px] md:mx-auto'
          id="login">

          <div className='flex flex-col items-center lg:h-[15%] mt-4 lg:mt-8'>
            <p className='lg:hidden w-[189px] h-[49px] text-center text-2xl font-black'>My HRMS</p>
            <img src="./logo.png" alt="" className='lg:w-[44px] lg:h-[44px]' />
          </div>

          <div className=' h-[70%] lg:flex lg:items-center lg:justify-center'>
            <form
              id='card'
              className='lg:w-[80%] lg:h-[70%] mt-10 lg:mt-0'
              onSubmit={handleLogin}>

              <div
                className='lg:w-[98%] lg:h-[40px] w-[297px] h-[53px] flex lg:border-b-[1px] border-[#00000033] items-center lg:justify-between lg:mb-3 lg:ml-2 lg:shadow-none lg:rounded-none rounded-full p-5 lg:p-0 shadow-[0px_2px_16.7px_-3px_#4FC7B1]'>
                <img
                  className='w-[22px] h-[22px]'
                  src="./email.png" alt="" />
                <input
                  type="email"
                  name='email'
                  placeholder='E-Mail'
                  className='w-full lg:h-[30px] h-[50px] px-2 outline-none placeholder-[#7196A6] text-black bg-transparent focus:placeholder-transparent'
                  value={loginInfo.email}
                  onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })} />
              </div>

              <div
                className='lg:w-[98%] lg:h-[40px] w-[297px] h-[53px] flex lg:border-b-[1px] border-[#00000033] items-center lg:justify-between lg:mb-7 lg:ml-2 lg:shadow-none lg:rounded-none rounded-full p-5 lg:p-0 shadow-[0px_2px_16.7px_-3px_#4FC7B1] mt-7'>
                <img
                  className='w-[22px] h-[22px]'
                  src="./lock.png" alt="" />
                <input
                  type="password"
                  name='password'
                  placeholder='Password'
                  className='w-full h-[30px] px-2 outline-none placeholder-[#7196A6] text-black bg-transparent focus:placeholder-transparent'
                  value={loginInfo.password}
                  onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })} />
              </div>

              <div className='lg:mt-0 mt-7 flex justify-between'>
                <div className='flex items-center'>
                  <input
                    className='mr-2 lg:rounded-none rounded-full'
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                  <label className="text-[10px] font-medium">Remember Me</label>
                </div>

                <div className='flex items-center'>
                  <Link to="/forget-password" className='text-[10px] font-medium hover:underline'>Forgot Password?</Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className='lg:w-full lg:h-[40px] bg-[linear-gradient(90deg,_#2D54EE_0%,_#88FFE9_100%)] lg:mt-5 text-white text-xl lg:rounded-[10px] font-bold hover:bg-[linear-gradient(90deg,_#1A3FB7_0%,_#75E6D4_100%)] lg:relative rounded-full w-[297px] h-[53px] mt-60 lg:shadow-none shadow-xl'>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
