import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#f43f5e"];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);

  if (!data) return <p className="p-6">Loading analytics...</p>;

  // Pie chart for issue status
  const pieData = data.statusStats?.map((s) => ({
    name: s._id,
    value: s.count,
  })) || [];

  // Bar chart for monthly issues
  const monthlyData = data.monthlyStats?.map((m) => ({
    month: `${m._id.month}/${m._id.year}`,
    Resolved: m.resolved,
    Pending: m.pending,
  })) || [];

  // Line chart for average resolution time per month
  const avgResolutionData = data.avgResolution?.map((m) => ({
    month: `${m._id.month}/${m._id.year}`,
    AvgResolutionDays: m.avgDays,
  })) || [];

  // Issues by category
  const categoryData = data.byCategory?.map((c) => ({
    category: c._id,
    count: c.count,
  })) || [];

  // Issues by location
  const locationData = data.byLocation?.map((l) => ({
    location: l._id,
    count: l.count,
  })) || [];

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-3xl font-bold mb-6">Admin Analytics</h2>

      {/* Status Pie + Monthly Bar side by side */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Issue Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow flex-1">
          <h3 className="font-bold mb-4">Issue Status Distribution</h3>
          {pieData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No status data available</p>
          )}
        </div>

        {/* Monthly Issues */}
        <div className="bg-white p-6 rounded-xl shadow flex-1">
          <h3 className="font-bold mb-4">Monthly Issues</h3>
          {monthlyData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Resolved" fill="#22c55e" />
                <Bar dataKey="Pending" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No monthly data available</p>
          )}
        </div>
      </div>

      {/* Average Resolution Time per Month */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">Average Resolution Time per Month (Days)</h3>
        {avgResolutionData.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={avgResolutionData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="AvgResolutionDays" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No resolution data available</p>
        )}
      </div>

      {/* Issues by Category */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">Issues by Category</h3>
        {categoryData.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No category data available</p>
        )}
      </div>

      {/* Issues by Location */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">Issues by Location</h3>
        {locationData.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No location data available</p>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;


