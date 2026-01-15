import express from "express";
import { getAdminIssues, updateIssueStatus} from "../controller/adminController.js";
import { assignIssue } from "../controller/adminIssueController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {getAnalytics} from "../controller/adminAnalytics.js";
import { updateIssuedate } from "../controller/adminController.js";
import { generateCSVReport, generatePDFReport } from "../controller/adminReports.js";
import { getIssueById } from "../controller/adminController.js";
import { getDepartments } from "../controller/adminIssueController.js";


const router = express.Router();

// Fetch all issues with filters
router.get("/issues", authMiddleware, adminOnly, getAdminIssues);
//router.get("/analytics",authMiddleware,adminOnly,getAnalytics);
router.put("/issues/:id/status", authMiddleware, adminOnly, updateIssuedate);
router.get("/reports/csv", authMiddleware, adminOnly, generateCSVReport);
router.get("/reports/pdf", authMiddleware, adminOnly, generatePDFReport);
router.get("/issues/:id", authMiddleware, adminOnly, getIssueById);
router.put("/issues/:id/assign",authMiddleware, adminOnly, assignIssue);
router.get("/departments",authMiddleware, adminOnly,getDepartments);

export default router;
