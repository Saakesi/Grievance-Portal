import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/contextProvider";

const Profile = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/issues/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIssues(res.data.issues || []);
      } catch (err) {
        console.error("Error fetching user's issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIssues();
  }, []);

  if (!user)
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">👤 My Profile</h1>

      <div className="mb-6 border-b pb-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-3">📋 My Reported Issues</h2>

      {loading ? (
        <p className="text-gray-500">Loading your issues...</p>
      ) : issues.length === 0 ? (
        <p className="text-gray-500">You haven’t reported any issues yet.</p>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue._id} className="border rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-lg">{issue.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{issue.location}</p>
              <p className="text-gray-700 mb-2">{issue.description}</p>

              {Array.isArray(issue.image) && issue.image.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {issue.image.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Issue"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
