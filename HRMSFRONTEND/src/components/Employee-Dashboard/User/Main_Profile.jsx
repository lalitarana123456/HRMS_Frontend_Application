import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Basic_Details from "./Basic_Details";
import Contact_Info from "./Contact_Info";
import Employee_Details from "./Employee_Details";
import EmployerSidebar from "../../Employer-Sidebar/EmployerSidebar";
import Nav from "./Nav";
import Sidebar from "../Sidebar/Sidebar";
import { useParams } from "react-router-dom";

export default function Main_Profile() {
  const { empData } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    profilePhoto: "",
    designation: "",
    gender: "",
    employeeId: "",
    dateOfBirth: "",
    email: "",
    contactNumber: "",
    alternativeNumber: "",
    dateOfJoining: "",
    address: {
      completeAddress: "",
      postalCode: "",
      city: "",
    },
    employeeStatus: "",
    tl: "",
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Unauthorized! No token found.");
          return;
        }
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_LIVE
          }/api/v1/employees/employee-profile/${empData}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Employer Data", response);

        const result = await response.json();

        if (response.ok && result.employee) {
          setEditData(result.employee);
        } else {
          toast.error(result.message || "Failed to fetch employee details.");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Error fetching employee details.");
      }
    };

    if (empData) {
      fetchEmployeeData();
    }
  }, [empData]);
  const employeeData = JSON.parse(localStorage.getItem("employeeData"));
  const isEmployer = employeeData && employeeData.role === "Employer";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("employeeData"));
    if (userData) {
      setEditData(userData);
    } else {
      setEditData({
        firstName: "",
        lastName: "",
        photo: "",
        designation: "",
        gender: "",
        employeeId: "",
        dateOfBirth: "",
        email: "",
        contactNumber: "",
        alternativeNumber: "",
        dateOfJoining: "",
        address: userData.address || {
          completeAddress: "",
          postalCode: "",
          city: "",
        },
        employeeStatus: "",
        teamLeader: "",
      });
    }
  }, [empData]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!editData) {
      toast.error("No data to save!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("employeeId", editData._id);

      if (editData.profilePhoto) {
        formData.append("profilePhoto", editData.profilePhoto);
      }
      if (editData.address) {
        formData.append(
          "address[completeAddress]",
          editData.address.completeAddress || ""
        );
        formData.append(
          "address[postalCode]",
          editData.address.postalCode || ""
        );
        formData.append("address[city]", editData.address.city || "");
      }
      Object.keys(editData).forEach((key) => {
        if (
          key !== "profilePhoto" &&
          key !== "profilePhotoPreview" &&
          key !== "address"
        ) {
          formData.append(key, editData[key]);
        }
      });

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employees/edit-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("employeeData", JSON.stringify(result.employee));
        toast.success("Details updated successfully!");
        setEditData(result.employee);
      } else {
        toast.error(result.message || "Failed to update details.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating details.");
    }
  };

  return (
    <>
      <div className="flex w-full bg-[#D6EAE7]">
        <div className="relative z-50">
          {isEmployer ? <EmployerSidebar /> : <Sidebar />}
        </div>
        <div className="md:p-10 space-y-0 md:space-y-5 px-2 pt-4 w-full">
          <Nav
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
          />
          <div className="space-y-14 md:space-y-0 md:flex md:flex-row flex-col md:items-start items-center sm:block md:h-60 h-max md:gap-5 gap-0 relative z-0">
            <Basic_Details
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
            />
            <Contact_Info
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
            />
          </div>
          <div className="relative h-max w-full z-0 pr-0 2xl:pr-11">
            <Employee_Details
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
            />
          </div>

          {/* ToastContainer for the notifications */}
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
