import { useState, useEffect } from "react";
import { Calendar, LayoutDashboard, Stethoscope, Users } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { fetchDashboardSummary } from "../../api/doctorService";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    appointmentsToday: 0,
  });

  useEffect(() => {
    const loadSummary = async () => {
      const data = await fetchDashboardSummary();
      setSummary(data);
    };
    loadSummary();
  }, []);
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/doctors" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
            <Stethoscope className="w-5 h-5" />
            <span>Doctors</span>
          </Link>
          <Link to="/admin/patients" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
            <Users className="w-5 h-5" />
            <span>Patients</span>
          </Link>
          <Link to="/admin/appointments" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
            <Calendar className="w-5 h-5" />
            <span>Appointments</span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Welcome, Admin</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Total Doctors</h3>
              <p className="text-3xl font-bold">{summary.totalDoctors}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Total Patients</h3>
              <p className="text-3xl font-bold">{summary.totalPatients}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Appointments Today</h3>
              <p className="text-3xl font-bold">{summary.appointmentsToday}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
