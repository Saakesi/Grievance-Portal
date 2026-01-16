import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/contextProvider";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Logo / Brand */}
      <Link to="/" className="text-xl font-bold tracking-wide">
        GrievanceHub
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:text-gray-200 transition">
          Home
        </Link>
        <Link to="/submit" className="hover:text-gray-200 transition">
          About
        </Link>

        {/* Authentication Buttons */}
        {user ? (
          <>
            <Link
              to="/profile"
              className="text-sm bg-white text-blue-600 px-3 py-1 rounded-full font-medium hover:bg-gray-100 transition"
            >
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-4 py-1 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 text-white px-4 py-1 rounded-md font-medium hover:bg-green-600 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


