import Issue from "../models/Issue.js";



export const getAllIssues = async (req, res) => {
  try {
    const { category, location, urgency, startDate, endDate } = req.query;

    // Build dynamic filter
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = location;
    if (urgency) filter.urgency = urgency;

    // Filter by date range if provided
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const issues = await Issue.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, issues });
  } catch (err) {
    console.error("❌ Error fetching admin issues:", err);
    res.status(500).json({ success: false, message: "Failed to fetch issues" });
  }
};

export const getAdminIssues = async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;

    // Build dynamic query object
    let query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    // Date filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    console.log("Admin issues query:", JSON.stringify(query, null, 2));

    // Fetch issues with populated user and assignedTo
    const issues = await Issue.find(query)
      .populate("user", "name _id")
      .populate("assignedTo", "name _id")
      .sort({ createdAt: -1 }); // newest first
      issues.forEach(i => console.log(i.user));

    console.log("Fetched issues raw:", JSON.stringify(issues, null, 2));

    // Log each issue's user field specifically
    issues.forEach((issue, index) => {
      console.log(`Issue ${index + 1}: id=${issue._id}, user=`, issue.user);
    });

    res.status(200).json({ success: true, issues });
  } catch (err) {
    console.error("Error in getAdminIssues:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateIssuedate = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, issue });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

export const assignIssue = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const issue = await Issue.findByIdAndUpdate(req.params.id, { assignedTo }, { new: true });
    res.json({ success: true, issue });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error assigning issue" });
  }
};


export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = { status };

    // If status is Resolved, set resolvedAt
    if (status === "Resolved") {
      updateData.resolvedAt = new Date();
    }

    const issue = await Issue.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({ success: true, issue });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("user", "name email _id")
      .populate("assignedTo", "name email _id");

    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    res.status(200).json({ success: true, issue });
  } catch (err) {
    console.error("Error fetching issue:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

