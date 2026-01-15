import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

const ViewIssue = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({}); // track comments for each issue

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/issues");
        setIssues(res.data.issues);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching issues:", err);
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleUpvote = async (issueId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/issues/${issueId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues(issues.map(i => i._id === issueId ? res.data : i));
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  const handleDownvote = async (issueId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/issues/${issueId}/downvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues(issues.map(i => i._id === issueId ? res.data : i));
    } catch (err) {
      console.error("Downvote failed:", err);
    }
  };

  const handleComment = async (issueId) => {
    const text = commentText[issueId];
    if (!text) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/issues/${issueId}/comment`,
        { text, user: "Current User" }, // replace with actual logged in user
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues(issues.map(i => i._id === issueId ? res.data : i));
      setCommentText({ ...commentText, [issueId]: "" });
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (!issues.length) return <div className="text-center mt-10 text-gray-500">No issues found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {issues.map((issue) => (
        <div key={issue._id} className="bg-white p-5 rounded-2xl shadow-md border">
          <h2 className="text-xl font-bold mb-1">{issue.title}</h2>
          <p className="text-sm text-gray-500 mb-1">📍 {issue.location}</p>
          <p className="text-sm text-gray-500 mb-3">Posted by: {issue.user?.name || "Anonymous"}</p>
          <p className="text-gray-700 mb-3">{issue.description}</p>

          {Array.isArray(issue.image) && issue.image.length > 0 && (
  <div className="grid grid-cols-2 gap-2 mb-3">
    {issue.image.map((img, idx) => (
      <img
        key={idx}
        src={img}
        alt="issue"
        className="rounded-xl object-cover w-full h-40"
      />
    ))}
  </div>
)}


          <div className="flex items-center space-x-4 text-gray-600 mb-2">
            <button onClick={() => handleUpvote(issue._id)} className="flex items-center space-x-1 hover:text-blue-600">
              <ThumbsUp size={20} /> <span>{issue.upvotes || 0}</span>
            </button>
            <button onClick={() => handleDownvote(issue._id)} className="flex items-center space-x-1 hover:text-red-600">
              <ThumbsDown size={20} /> <span>{issue.downvotes || 0}</span>
            </button>
          </div>

          {issue.comments?.map((c, idx) => (
            <p key={idx} className="text-sm mb-1"><strong>{c.user}</strong>: {c.text}</p>
          ))}

          <div className="flex space-x-2 mt-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText[issue._id] || ""}
              onChange={(e) => setCommentText({ ...commentText, [issue._id]: e.target.value })}
              className="flex-1 border rounded px-2 py-1"
            />
            <button onClick={() => handleComment(issue._id)} className="bg-green-500 text-white px-3 rounded">
              <MessageCircle size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewIssue;


