import React from "react";
import Nav from "./Nav";
import Attendence from "./Attendence";
import Home_Profile from "./Home_Profile";
import Reports from "./Reports";
import Sidebar from "../Sidebar/Sidebar";
import bgimg from "../../../../public/Images/Emp-Bg-img.png";

export default function Dashboard() {
    return (
        <div className="relative flex w-full bg-[#D6EAE7] min-h-screen">
            {/* Sidebar */}
            <div className="relative z-50">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="relative w-full p-5 space-y-5">
                <Nav />

                <div className="justify-between h-auto sm:h-96 md:h-48 lg:h-52 xl:h-52 2xl:h-56 md:flex p-0 md:p-0 gap-y-24 sm:gap-y-5 md:gap-5 relative z-10">
                    <Home_Profile />
                    <Attendence />
                </div>

                <div className="relative z-10">
                    <Reports />
                </div>

                {/* Background Image */}
                <div
                    className="absolute bottom-0 left-0 w-full h-[520px] sm:h-80 md:h-96 lg:h-[420px] xl:h-[400px] 2xl:h-[500px] bg-cover bg-no-repeat bg-center md:rounded-xl"
                    style={{ backgroundImage: `url(${bgimg})` }}
                ></div>
            </div>
        </div>
    );
}
