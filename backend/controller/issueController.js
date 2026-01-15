import Issue from "../models/Issue.js";

export const getUserIssues = async (req, res) => {
  try {
    console.log("🧩 Inside getUserIssues controller");
    console.log("User from token:", req.user);

    // Fetch issues for the user and populate user & assignedTo
    const issues = await Issue.find({ user: req.user.id })
      .populate("user", "name _id")          // populate user's name and id
      .populate("assignedTo", "name _id");   // populate assigned staff

    console.log("Found issues:", issues.length);

    res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error("❌ Error in getUserIssues:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
