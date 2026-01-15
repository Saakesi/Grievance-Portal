import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 p-3 rounded-lg transition 
   ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`;

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          📋 Dashboard
        </NavLink>

        

        <NavLink to="/admin/analytics" className={linkClass}>
          📊 Analytics
        </NavLink>

        <NavLink to="/admin/heatmap" className={linkClass}>
          🌍 Heatmap
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
