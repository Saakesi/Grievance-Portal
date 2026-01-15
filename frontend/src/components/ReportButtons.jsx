import axios from "axios";

const ReportButtons = () => {
  const token = localStorage.getItem("token");

  const downloadCSV = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/reports/csv", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "issues_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("CSV download error:", err);
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/reports/pdf", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "issues_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF download error:", err);
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      <button onClick={downloadCSV} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
        Download CSV
      </button>
      <button onClick={downloadPDF} className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700">
        Download PDF
      </button>
    </div>
  );
};

export default ReportButtons;
