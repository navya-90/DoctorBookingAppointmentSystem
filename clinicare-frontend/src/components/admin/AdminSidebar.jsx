import { LayoutDashboard, Stethoscope, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-100 p-4 min-h-screen border-r border-gray-200">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6" />
        Admin Panel
      </h2>
      <nav className="flex flex-col gap-4">
        <Link to="/admin-dashboard" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 font-medium">
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link to="/admin/doctors" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 font-medium">
          <Stethoscope className="w-5 h-5" />
          <span>Doctors</span>
        </Link>
        <Link to="/admin/patients" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 font-medium">
          <Users className="w-5 h-5" />
          <span>Patients</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
