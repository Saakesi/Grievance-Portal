import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminIssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchIssue = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/issues/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssue(res.data.issue);
    } catch (err) {
      console.error("Error fetching issue:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SINGLE EFFECT
  useEffect(() => {
    fetchIssue();
  }, [id]);

  if (loading) return <p>Loading issue details...</p>;
  if (!issue) return <p>Issue not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Back
      </button>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Issue Details
      </h2>

      <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-2">
            <p>
              <strong>ID:</strong>{" "}
              <span className="text-blue-600">{issue._id}</span>
            </p>
            <p>
              <strong>Title:</strong> {issue.title}
            </p>
            <p>
              <strong>Category:</strong> {issue.category}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              <span className="text-red-600">{issue.location}</span>
            </p>
            <p>
              <strong>Urgency:</strong> {issue.urgency}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  issue.status === "Resolved"
                    ? "text-green-600"
                    : issue.status === "In Progress"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {issue.status}
              </span>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(issue.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Resolved At:</strong>{" "}
              {issue.resolvedAt
                ? new Date(issue.resolvedAt).toLocaleString()
                : "Not resolved yet"}
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-2">
            <p>
              <strong>Submitted By:</strong>{" "}
              {issue.user?.name} ({issue.user?._id})
            </p>

            <p>
              <strong>Assigned To:</strong>{" "}
              {issue.assignedTo?.name || "Unassigned"}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              <span className="text-indigo-600 font-medium">
                {issue.assignedTo?.department || "Not Assigned"}
              </span>
            </p>
          </div>
        </div>

        {/* IMAGES */}
        {issue.image && issue.image.length > 0 && (
          <div>
            <strong>Images:</strong>
            <div className="flex gap-4 mt-2 flex-wrap">
              {issue.image.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`issue-${idx}`}
                  className="w-48 h-48 object-cover rounded shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* DESCRIPTION */}
        <div>
          <strong>Description:</strong>
          <p className="border p-3 rounded bg-gray-100 mt-2">
            {issue.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminIssueDetails;

