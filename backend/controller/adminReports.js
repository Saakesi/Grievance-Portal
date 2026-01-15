import Issue from "../models/Issue.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";

export const generateCSVReport = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("user", "name _id")
      .populate("assignedTo", "name _id");

    // Flatten nested fields
    const flattened = issues.map(i => ({
      _id: i._id,
      title: i.title,
      category: i.category,
      location: i.location,
      urgency: i.urgency,
      status: i.status,
      "user.name": i.user?.name || "N/A",
      "assignedTo.name": i.assignedTo?.name || "Unassigned",
      createdAt: i.createdAt.toISOString(),
      resolvedAt: i.resolvedAt ? i.resolvedAt.toISOString() : "N/A",
    }));

    const fields = [
      "_id",
      "title",
      "category",
      "location",
      "urgency",
      "status",
      "user.name",
      "assignedTo.name",
      "createdAt",
      "resolvedAt"
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(flattened);

    res.header("Content-Type", "text/csv");
    res.attachment("issues_report.csv");
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "CSV generation failed" });
  }
};

export const generatePDFReport = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("user", "name _id")
      .populate("assignedTo", "name _id");

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const monthlyTotal = issues.filter(
      i => i.createdAt.getMonth() + 1 === currentMonth && i.createdAt.getFullYear() === currentYear
    ).length;

    const statusCounts = issues.reduce(
      (acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
      },
      {}
    );

    const byCategory = issues.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {});

    const byLocation = issues.reduce((acc, i) => {
      acc[i.location] = (acc[i.location] || 0) + 1;
      return acc;
    }, {});

    // Create PDF
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=issues_report.pdf");
    doc.pipe(res);

    doc.fontSize(20).text("Admin Issues Report", { align: "center" });
    doc.moveDown();

    // Totals
    doc.fontSize(14).text(`Total complaints this month: ${monthlyTotal}`);
    doc.text(`Status Counts: Pending: ${statusCounts["Pending"] || 0}, In Progress: ${statusCounts["In Progress"] || 0}, Resolved: ${statusCounts["Resolved"] || 0}`);
    doc.moveDown();

    // Category & Location
    doc.text("Total complaints by category:");
    Object.entries(byCategory).forEach(([cat, count]) => {
      doc.text(` - ${cat}: ${count}`);
    });
    doc.moveDown();

    doc.text("Total complaints by location:");
    Object.entries(byLocation).forEach(([loc, count]) => {
      doc.text(` - ${loc}: ${count}`);
    });
    doc.moveDown();

    // Table of issues
    doc.fontSize(14).text("Issues List:", { underline: true });
    issues.forEach((issue, idx) => {
      doc.fontSize(12).text(
        `${idx + 1}. Title: ${issue.title} | Category: ${issue.category} | Location: ${issue.location} | Status: ${issue.status} | User: ${issue.user?.name || "N/A"} | Assigned: ${issue.assignedTo?.name || "Unassigned"}`
      );
    });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "PDF generation failed" });
  }
};
