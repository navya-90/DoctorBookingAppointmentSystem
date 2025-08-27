import { useEffect, useState } from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { fetchDoctorAppointments, cancelAppointment, rescheduleAppointment, fetchPatientCount } from '../../api/doctorApi';
import RescheduleModal from '../../components/RescheduleModal';

const DoctorDashboard = () => {
  const [data, setData] = useState({ totalAppointments: 0, appointments: [], patientCount: 0 });
  const [loading, setLoading] = useState(true);
  const [rescheduleId, setRescheduleId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointments, patientCount] = await Promise.all([
        fetchDoctorAppointments(),
        fetchPatientCount() // Fetch both in parallel
      ]);
      setData({
        ...appointments,
        patientCount
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };


    const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      await cancelAppointment(id);
      loadAppointments();
    }
  };

  const handleReschedule = (id) => {
    setRescheduleId(id);
  };

  const confirmReschedule = async (newDateTime) => {
    await rescheduleAppointment(rescheduleId, newDateTime);
    setRescheduleId(null);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{data.totalAppointments}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{data.patientCount}</p> {/* static */}
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {data.appointments.map((appt, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {appt.time} - {appt.patientName}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{appt.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReschedule(appt.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
                
              ))}

              {data.appointments.length === 0 && (
                <p className="text-gray-500">No appointments scheduled for today.</p>
              )}
            </div>
          </div>
          {rescheduleId && (
            <RescheduleModal
              isOpen={!!rescheduleId}
              onClose={() => setRescheduleId(null)}
              onConfirm={confirmReschedule}
            />
          )}
        </>
      )}
    </>
  );
};

export default DoctorDashboard;
