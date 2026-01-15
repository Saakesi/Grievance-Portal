import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReportButtons from "../components/ReportButtons";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [departments, setDepartments] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

const updateAssigned = async (issueId, deptId) => {
  try {
    console.log("✅ updateAssigned called", issueId, deptId);

    // send update to backend
    const res = await axios.put(
      `http://localhost:5000/api/admin/issues/${issueId}/assign`,
      { departmentId: deptId || null },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedIssue = res.data.issue; // populated assignedTo

    // update UI
    setIssues((prev) =>
      prev.map((issue) =>
        issue._id === issueId ? updatedIssue : issue
      )
    );
  } catch (err) {
    console.error("Error assigning department", err);
  }
};


  const getDepartments = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/admin/departments",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setDepartments(res.data.departments);
  } catch (err) {
    console.error("Error fetching departments", err);
  }
};

  const getAdminIssues = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
      ).toString();

      const res = await axios.get(
        `http://localhost:5000/api/admin/issues?${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIssues(res.data.issues);
    } catch (err) {
      console.error("Error fetching issues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  getAdminIssues();
  getDepartments();
}, []);


  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/issues/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getAdminIssues();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => getAdminIssues();
  const handleResetFilters = () => {
    setFilters({ category: "", status: "", startDate: "", endDate: "" });
    getAdminIssues();
  };

  const total = issues.length;
  const openCount = issues.filter((i) => i.status === "Open").length;
  const inProgressCount = issues.filter((i) => i.status === "In Progress").length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

      <div className="mb-6">
        <h2 className="text-xl font-bold">Reports</h2>
        <ReportButtons />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-xl p-5 text-center hover:shadow-xl transition">
          <p className="text-gray-400 font-semibold">Total Issues</p>
          <p className="text-2xl font-bold text-gray-800">{total}</p>
        </div>
        <div className="bg-red-50 shadow-lg rounded-xl p-5 text-center hover:shadow-xl transition">
          <p className="text-red-400 font-semibold">Open</p>
          <p className="text-2xl font-bold text-red-600">{openCount}</p>
        </div>
        <div className="bg-yellow-50 shadow-lg rounded-xl p-5 text-center hover:shadow-xl transition">
          <p className="text-yellow-400 font-semibold">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">{inProgressCount}</p>
        </div>
        <div className="bg-green-50 shadow-lg rounded-xl p-5 text-center hover:shadow-xl transition">
          <p className="text-green-400 font-semibold">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            <option value="">Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="bg-gray-200 px-6 py-2 rounded-xl hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Issues Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-600">User Name</th>
              <th className="p-3 text-left text-gray-600">User ID</th>
              <th className="p-3 text-left text-gray-600">Title</th>
              <th className="p-3 text-left text-gray-600">Category</th>
              <th className="p-3 text-left text-gray-600">Location</th>
              <th className="p-3 text-left text-gray-600">Urgency</th>
              <th className="p-3 text-left text-gray-600">Status</th>
              <th className="p-3 text-left text-gray-600">Assigned</th>
              <th className="p-3 text-left text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : issues.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No issues found
                </td>
              </tr>
            ) : (
              issues.map((issue) => (
                <tr
                  key={issue._id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => navigate(`/admin/issues/${issue._id}`)}
                >
                  <td className="p-3">{issue.user?.name}</td>
                  <td className="p-3">{issue.user?._id}</td>
                  <td className="p-3">{issue.title}</td>
                  <td className="p-3">{issue.category}</td>
                  <td className="p-3">{issue.location}</td>
                  <td className="p-3">{issue.urgency}</td>
                  <td className="p-3 font-semibold">{issue.status}</td>
                  <td className="p-3">
                  <select
  value={issue.assignedTo?._id || ""}
  onChange={(e) => {
    console.log("🔥 onChange fired", {
      issueId: issue._id,
      value: e.target.value,
    });
    updateAssigned(issue._id, e.target.value);
  }}
  onClick={(e) => e.stopPropagation()}
  className="border border-gray-200 rounded-lg p-2 w-full"
>
  <option value="">Unassigned</option>
  {departments.map((dept) => (
    <option key={dept._id} value={dept._id}>
      {dept.name}
    </option>
  ))}
</select>
</td>
                  <td className="p-3">
                    <select
                      value={issue.status}
                      onChange={(e) => updateStatus(issue._id, e.target.value)}
                      className="border border-gray-200 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-300"
                      onClick={(e) => e.stopPropagation()} // prevent row click
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;


