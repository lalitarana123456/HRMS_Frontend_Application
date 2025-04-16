import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="text-lg mb-6">You do not have permission to access this page.</p>
      <Link 
        to="/login" 
        className="px-6 py-3 rounded-lg text-lg"
      >
        Go Back
      </Link>
    </div>
  );
};

export default Unauthorized;
