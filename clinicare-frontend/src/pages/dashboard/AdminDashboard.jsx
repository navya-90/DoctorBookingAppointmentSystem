import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { fetchDashboardSummary } from "../../api/doctorService";
import AdminSidebar from "../../components/admin/AdminSidebar";

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
      <AdminSidebar />

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
