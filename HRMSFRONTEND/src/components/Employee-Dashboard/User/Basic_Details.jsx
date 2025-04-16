import React, { useState, useEffect } from "react";

export default function Basic_Details({ isEditing, editData, setEditData }) {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editData.profilePhoto) {
      if (typeof editData.profilePhoto === "string") {
        setImagePreview(editData.profilePhoto);
      } else {
        setImagePreview(URL.createObjectURL(editData.profilePhoto));
      }
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files[0];
    if (files) {
      setEditData((prev) => ({
        ...prev,
        profilePhoto: files,
        profilePhotoPreview: URL.createObjectURL(files),
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", editData.firstName);
      formData.append("lastName", editData.lastName);
      formData.append("profilePhoto", editData.profilePhoto);
      formData.append("email", editData.email);

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_LIVE}/api/v1/employees/edit-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("Data updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="md:bg-white p-0 w-full md:shadow-[0px_3px_7.6px_1px_#00000040] sm:w-[80%] md:w-[45%] h-60 flex md:flex-row flex-col rounded-md md:rounded-xl">
      <div className="flex flex-col items-center md:p-2 lg:p-2">
        <img
          className="object-cover rounded-2xl w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-32 xl:h-24 2xl:w-28 2xl:h-28"
          src={imagePreview}
          alt={`${editData.firstName}`}
        />
        {isEditing && (
          <div className="mt-1 w-40">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-xs"
              name="profilePhoto"
            />
          </div>
        )}
        <p className="md:hidden block font-lato text-[#002446] font-bold">
          {editData?.fullName}
        </p>
        <p className="md:hidden block font-lato text-[#707070] mt-0">
          {editData.designation}
        </p>
        <div className="md:hidden flex flex-row mt-1">
          <p className="font-lato text-[#707070]">Employee ID: </p>
          <p className="font-lato text-[#002446]">
            {editData.employeeId || "NA"}
          </p>
        </div>
      </div>
      <div className="ml-0 xl:ml-10 py-5 sm:py-1 md:py-2 lg:py-5 xl:py-5 2xl:py-5 w-full leading-5">
        <div className="md:flex hidden gap-2">
          <p className=" font-lato text-[#002446] font-bold">
            {editData?.fullName}
          </p>
        </div>
        <p className="md:block hidden font-lato text-[#707070] mt-0">
          {editData.designation || "NA"}
        </p>
        <div className="bg-white md:bg-transparent md:p-0 p-3 md:rounded-none rounded-xl flex flex-col justify-start gap-1 md:shadow-none shadow-[0px_3px_7.6px_1px_#00000040]">
          <h3 className="md:hidden block font-lato font-semibold text-xl text-[#002446]">
            Personal Information
          </h3>
          <div className="w-full h-max flex md:flex-col flex-row justify-start gap-3">
            <div className="mt-1">
              <p className="font-lato text-[#707070]">Gender</p>
              <p className="font-lato text-[#002446]">
                {editData.gender || "NA"}
              </p>
            </div>
            <div className="mt-1">
              <p className="font-lato text-[#707070]">Date of Birth</p>
              {isEditing ? (
                <input
                  name="dateOfBirth"
                  value={
                    editData.dateOfBirth
                      ? new Date(editData.dateOfBirth).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  type="date"
                  className="border rounded px-2 py-1 w-36"
                />
              ) : (
                <p className="font-lato text-[#002446]">
                  {editData.dateOfBirth
                    ? new Date(editData.dateOfBirth).toLocaleDateString()
                    : "NA"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="md:block hidden mt-1">
          <p className="font-lato text-[#707070]">Employee ID</p>
          <p className="font-lato text-[#002446]">
            {editData.employeeId || "NA"}
          </p>
        </div>
      </div>
    </div>
  );
}
