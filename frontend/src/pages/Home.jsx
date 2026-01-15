import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Welcome to the Grievance Portal
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-md">
        Raise your concerns easily or view issues submitted by others.  
        Let’s make communication transparent and effective.
      </p>

      {/* Main Options */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <Link
          to="/submitissue"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg text-lg font-semibold text-center"
        >
          ✍️ Raise an Issue
        </Link> 

        <Link
          to="/viewissue"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg text-lg font-semibold text-center"
        >
          👁️ View Other Issues
        </Link>
      </div>

      {/* Minor Options */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
        <Link to="/profile" className="hover:text-blue-600">Profile</Link>
        <Link to="/help" className="hover:text-blue-600">Help & Support</Link>
        <Link to="/about" className="hover:text-blue-600">About</Link>
        <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
      </div>
    </div>
  );
};

export default Home;
