import axios from 'axios';
import React, { useState } from 'react'
import AdminDashboard from '../Admin-Dashboard/AdminDashboard';
import AdminSidebar from '../Admin-Sidebar/adminSidebar';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const CompanyId = () => {
  
 
  const [errors,setErrors]=useState({});
    const [formData, setFormData] = useState({
        Name: "",
         email: "",
       password: "",
        confirmPassword: "",
       });

const navigate=useNavigate()
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });

        setErrors({...errors,[name]:''});
      };

     

      const handleSubmit = async (e) => {
        e.preventDefault();


const validationErrors={};

if(!formData.Name){
    validationErrors.Name='Please fill the name';
}

if(!formData.email){
    validationErrors.email='Please fill the email'
}

if(!formData.password){
    validationErrors.password="Please fill the password"
}
if(!formData.confirmPassword){
    validationErrors.confirmPassword="Please fill the confirm password"
} else if(formData.password!==formData.confirmPassword){
    validationErrors.confirmPassword='Passwords do not match';
}

setErrors(validationErrors);

       // console.log('Form Data:', formData);
      
      
        const payload = {
          Name: formData.Name,
           email: formData.email,
        
          password: formData.password,
          confirmPassword: formData.confirmPassword,
         
        };
      
      //  console.log("Data being sent to the backend:", payload);
      
        try {
          const token = localStorage.getItem('token'); // Get token from local storage (if needed)
         
          // Make API request to send the data
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_LIVE}/api/v1/company/register`, payload, {
            headers: {
              Authorization: `Bearer ${token}`, // Optional, depending on authentication
              'Content-Type': 'application/json',
            },
          });
      
      //    console.log("Response from the backend:", response.data);
          toast.success("Employee data submitted successfully!");
      
          // Reset form data after successful submission
          setFormData({
            Name: "",
          
            email: "",
           
            password: "",
            confirmPassword: "",
           
          });
        } catch (error) {
         // console.error("Error submitting data:", error);
          toast.error(`Failed to submit data: ${error.response?.data?.message || "Unknown error"}`);
        }
      };
      

  return (
<>
<div className='w-screen  flex  bg-[#FFFCFE]  md:h-screen min-h-screen'>
<div><AdminSidebar/></div>  
    <div className='w-[calc(100%-248px)] min-h-screen  overflow-x-hidden  overflow-y-auto  scrollbar-thin scrollbar-thumb-black scrollbar-track-black '>
    <div className='flex justify-between p-5 items-center'>
<p className='font-roboto text-4xl items-center font-bold'>Create Company ID</p>



                <div className='flex gap-10'>
<button
onClick={()=>navigate('/Admin Create Employee ID')}
 className='w-44 h-16 font-roboto rounded-lg border  border-[#00000033] text-3xl font-normal'>Employee</button>
  <button 
 // onClick={()=>navigate('/adminCompany')}
   className='w-44 h-16 font-roboto rounded-lg border-2 border-black text-3xl font-medium'>Company</button>
</div>

</div>
<div className='border-b  border-[#00000033] w-full m-1'></div>

<form className='flex justify-between p-10'
 onSubmit={handleSubmit}>
<div className='flex flex-col gap-4'>
 <div className='flex flex-col gap-4 '>
 <label className="font-inter font-medium text-2xl ">Name</label>
 <input type='text'
 name="Name"
              value={formData.Name}
              onChange={handleInputChange}
  className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
  placeholder='Enter your name'
 />
 {errors.Name && <p className="text-red-500  font-bold text-sm">{errors.Name}</p>}
       
 </div>

 <div className='flex flex-col  gap-4 '>
 <label className="font-inter font-medium text-2xl ">email id</label>
 <input type='text'
 name="email"
              value={formData.email}
              onChange={handleInputChange}
  className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
  placeholder='Enter your email id'
 />
 {errors.email && <p className="text-red-500 font-bold text-sm">{errors.email}</p>}
 </div>


 <div className='flex flex-col  gap-4 '>
 <label className="font-inter font-medium text-2xl ">Enter your Password</label>
 <input type='text'
 name="password"
              value={formData.password}
              onChange={handleInputChange}
  className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
  placeholder='Enter your Password'
 />
 {errors.password && <p className="text-red-500 font-bold text-sm">{errors.password}</p>}
 </div>

 <div className='flex flex-col  gap-4 '>
 <label className="font-inter font-medium text-2xl ">Re-enter your Password</label>
 <input type='text'
 name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
  className='w-[396px] h-11 bg-[#FFFFFF] rounded-[10px] p-4 border border-[#0000001A]'
  placeholder='Re-enter your Password'
 />
 {errors.confirmPassword && <p className="text-red-500 font-bold text-sm">{errors.confirmPassword}</p>}
 </div>
 <button
className='bg-[#55D1D9] w-60 h-16 rounded-2xl border shadow-lg border-[#FFFFFF] font-roboto  text-3xl font-semibold mt-10'

 type="submit">Create id</button>
 </div>

 </form>
</div>
</div>
</>
  )
}

export default CompanyId