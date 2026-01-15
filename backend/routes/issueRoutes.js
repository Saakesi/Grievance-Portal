import express from "express";
import Issue from "../models/Issue.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getUserIssues } from "../controller/issueController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();




router.get("/user", authMiddleware, getUserIssues);
/*
router.get("/user", authMiddleware, async (req, res) => {
  console.log("🟢 /api/issues/user route hit!");
  console.log("req.user:", req.user);
  try {
    const issues = await Issue.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ issues });
  } catch (error) {
    console.error("Error fetching user issues:", error);
    res.status(500).json({ message: "Failed to fetch user's issues" });
  }
});*/

// Create new issue
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, category,location, description, image } = req.body;

    const newIssue = new Issue({
      title,
      category,
      location,
      description,
      image,
      user: req.user.id,
    });

    await newIssue.save();
    res.status(201).json({ message: "Issue created successfully", newIssue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating issue" });
  }
});

// Get all issues
router.get("/",  async (req, res) => {
  try {
    const issues = await Issue.find().populate("user", "name email");
    res.status(200).json({ issues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching issues" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issue" });
  }
});

// Upvote
router.post("/:id/upvote", authMiddleware,async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: "Failed to upvote" });
  }
});

// Downvote
router.post("/:id/downvote",authMiddleware, async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { downvotes: 1 } },
      { new: true }
    );
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: "Failed to downvote" });
  }
});

// Add comment
router.post("/:id/comment", authMiddleware,async (req, res) => {
  try {
    const { text, user } = req.body;
    const issue = await Issue.findById(req.params.id);
    issue.comments.push({ text, user });
    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});




export default router;
