import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { AuthProvider } from "./context/contextProvider";
import SubmitIssue from "./pages/submitIssue";
import ViewIssue from "./pages/viewIssue";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminLayout from "./pages/AdminLayout";
import AdminIssueDetails from "./pages/AdminIssueDetails";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>

        {/* User Navbar */}
        <Navbar />

        <Routes>
          {/* USER ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/submitissue" element={<SubmitIssue />} />
          <Route path="/viewissue" element={<ViewIssue />} />
          <Route path="/profile" element={<Profile />} />

          {/* ADMIN AUTH */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminSignup />} />

          {/* ADMIN LAYOUT + NESTED ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="/admin/issues/:id" element={<AdminIssueDetails />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
