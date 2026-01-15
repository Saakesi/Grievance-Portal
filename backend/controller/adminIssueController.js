import Issue from "../models/Issue.js";
import Department from "../models/Department.js";

export const assignIssue = async (req, res) => {
  try {
    const { departmentId } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (!departmentId || departmentId === "Unassigned") {
      issue.assignedTo = null;
    } else {
      const department = await Department.findById(departmentId);
      if (!department) return res.status(404).json({ message: "Department not found" });

      // Save ObjectId reference
      issue.assignedTo = department._id;
    }

    await issue.save();

    // 🔥 Populate assignedTo before sending back
    const populatedIssue = await Issue.findById(issue._id)
      .populate("assignedTo", "_id name")
      .populate("user", "_id name");

    res.status(200).json({ success: true, issue: populatedIssue });
  } catch (error) {
    console.error("Assign issue error:", error);
    res.status(500).json({ message: "Failed to assign issue" });
  }
};

export const getDepartments = async (req, res) => {
  console.log("🔥 getDepartments HIT");
  try {
    const departments = await Department.find({}, { name: 1 });
    res.status(200).json({ departments });
  } catch (error) {
    console.error("getDepartments error:", error);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};


