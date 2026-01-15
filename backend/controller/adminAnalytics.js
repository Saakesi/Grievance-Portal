import Issue from "../models/Issue.js";

export const getAnalytics = async (req, res) => {
  try {
    // 1️⃣ Issue status distribution
    const statusStats = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // 2️⃣ Monthly issues: Pending vs Resolved
    const monthlyStats = await Issue.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $ne: ["$status", "Resolved"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // 3️⃣ Average resolution time per month (in days)
    const avgResolution = await Issue.aggregate([
      { $match: { status: "Resolved", resolvedAt: { $exists: true } } },
      {
        $project: {
          month: { $month: "$resolvedAt" },
          year: { $year: "$resolvedAt" },
          resolutionDays: {
            $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 1000 * 60 * 60 * 24],
          },
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          avgDays: { $avg: "$resolutionDays" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // 4️⃣ Issues by Category
    const byCategory = await Issue.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // 5️⃣ Issues by Location
    const byLocation = await Issue.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
    ]);

    res.json({ statusStats, monthlyStats, avgResolution, byCategory, byLocation });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
