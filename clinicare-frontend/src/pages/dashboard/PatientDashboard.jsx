import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../../api/patientApi";
import { fetchPatientAppointments, cancelAppointment, rescheduleAppointment } from "../../api/appointmentApi";
import DoctorCard from "../../components/ui/DoctorCard";
import PatientRescheduleModal from "../../components/PatientRescheduleModal";
import { Calendar, Clock, AlertCircle, RefreshCw, X, FileText, CheckCircle2 } from "lucide-react";

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("book"); // 'book' or 'appointments'
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals state
  const [cancelData, setCancelData] = useState(null); // { id, doctorName, date, time }
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null); // { id, doctorId, doctorName }

  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (activeTab === "appointments") {
      loadAppointments();
    }
  }, [activeTab]);

  const loadDoctors = async () => {
    setLoadingDoctors(true);
    setError("");
    try {
      const data = await getDoctors();
      setDoctors(data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to load available doctors.");
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const loadAppointments = async () => {
    setLoadingAppointments(true);
    setError("");
    try {
      const res = await fetchPatientAppointments();
      if (res.success) {
        setAppointments(res.data || []);
      } else {
        setError(res.error || "Failed to load appointments.");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("An unexpected error occurred while loading appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setCancelData(appointment);
    setCancellationReason("");
  };

  const handleCancelConfirm = async () => {
    if (!cancelData) return;
    setCancelling(true);
    setError("");
    try {
      const res = await cancelAppointment(cancelData.id, cancellationReason);
      if (res.success) {
        setSuccessMsg("Appointment cancelled successfully!");
        setCancelData(null);
        setCancellationReason("");
        // Reload appointments
        loadAppointments();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setError(res.error || "Failed to cancel appointment.");
      }
    } catch (err) {
      setError("An error occurred during cancellation.");
    } finally {
      setCancelling(false);
    }
  };

  const handleRescheduleConfirm = async (newSlotId) => {
    if (!rescheduleData) return;
    setError("");
    const res = await rescheduleAppointment(rescheduleData.id, newSlotId);
    if (res.success) {
      setSuccessMsg("Appointment rescheduled successfully!");
      setRescheduleData(null);
      loadAppointments();
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      throw new Error(res.error || "Failed to reschedule appointment.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Scheduled
          </span>
        );
      case "RESCHEDULED":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
            Rescheduled
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      
      {/* Banner / Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Patient Dashboard</h2>
          <p className="text-gray-500 mt-1">Book slots, reschedule appointments, and view your consultation history.</p>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in-50 duration-200">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in-50 duration-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("book")}
          className={`pb-4 px-4 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "book"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Book Appointment
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`pb-4 px-4 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "appointments"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          My Appointments
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "book" ? (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Available Doctors</h3>
          
          {loadingDoctors ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-500 font-medium">Loading doctors...</span>
            </div>
          ) : doctors.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h4 className="text-lg font-semibold text-gray-700">No Doctors Available</h4>
              <p className="text-gray-500 text-sm mt-1">There are no doctors registered in the system at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  onSelect={() => navigate(`/patient-dashboard/${doc.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Your Appointments</h3>
            <button
              onClick={loadAppointments}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loadingAppointments ? "animate-spin text-blue-600" : ""}`} />
              Refresh
            </button>
          </div>

          {loadingAppointments ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-500 font-medium">Loading appointments...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h4 className="text-lg font-semibold text-gray-700">No Appointments Yet</h4>
              <p className="text-gray-500 text-sm mt-1">You have not booked any appointments.</p>
              <button
                onClick={() => setActiveTab("book")}
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors text-sm"
              >
                Book One Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {appointments.map((appt) => {
                const canModify = appt.status === "SCHEDULED" || appt.status === "RESCHEDULED";
                return (
                  <div
                    key={appt.id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {/* Top Accent line */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1.5 ${
                        appt.status === "SCHEDULED"
                          ? "bg-blue-500"
                          : appt.status === "RESCHEDULED"
                          ? "bg-yellow-500"
                          : appt.status === "COMPLETED"
                          ? "bg-green-500"
                          : "bg-red-400"
                      }`}
                    />

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                          Doctor
                        </span>
                        <h4 className="text-lg font-bold text-gray-900">Dr. {appt.doctorName}</h4>
                      </div>
                      {getStatusBadge(appt.status)}
                    </div>

                    <div className="space-y-2.5 border-t border-b border-gray-50 py-3.5 my-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4.5 h-4.5 text-blue-500" />
                        <span className="font-medium text-gray-800">{appt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4.5 h-4.5 text-gray-400" />
                        <span>{appt.time}</span>
                      </div>
                    </div>

                    {/* Reschedule history & Cancellation Reason details */}
                    {appt.rescheduleHistory && (
                      <div className="mb-4 text-xs bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg text-amber-800">
                        <span className="font-semibold block mb-1 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Rescheduling History:
                        </span>
                        <pre className="font-sans whitespace-pre-line text-[11px] leading-relaxed">
                          {appt.rescheduleHistory}
                        </pre>
                      </div>
                    )}

                    {appt.status === "CANCELLED" && appt.cancellationReason && (
                      <div className="mb-4 text-xs bg-red-50/50 border border-red-100 p-2.5 rounded-lg text-red-800">
                        <span className="font-semibold block mb-1">Cancellation Reason:</span>
                        <p className="text-gray-700 italic">"{appt.cancellationReason}"</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    {canModify && (
                      <div className="flex gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setRescheduleData({ id: appt.id, doctorId: appt.doctorId, doctorName: appt.doctorName })}
                          className="flex-1 py-2 px-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelClick(appt)}
                          className="flex-1 py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md mx-4 relative border border-gray-100 animate-in fade-in-50 zoom-in-95 duration-200">
            <button
              onClick={() => setCancelData(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Appointment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel your appointment with{" "}
              <span className="font-semibold text-blue-600">Dr. {cancelData.doctorName}</span> on{" "}
              <span className="font-semibold">{cancelData.date}</span> at{" "}
              <span className="font-semibold">{cancelData.time}</span>?
            </p>

            <div className="mb-4">
              <label htmlFor="reason" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Reason for cancellation (Optional)
              </label>
              <textarea
                id="reason"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows="3"
                placeholder="Enter cancellation reason..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCancelData(null)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors text-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={cancelling}
                className="px-5 py-2 bg-red-600 text-white rounded-xl font-medium shadow-md shadow-red-200 hover:bg-red-700 disabled:opacity-50 transition-all flex items-center gap-2 text-sm"
              >
                {cancelling && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Slot Picker Modal */}
      {rescheduleData && (
        <PatientRescheduleModal
          doctorId={rescheduleData.doctorId}
          doctorName={`Dr. ${rescheduleData.doctorName}`}
          onClose={() => setRescheduleData(null)}
          onConfirm={handleRescheduleConfirm}
        />
      )}

    </div>
  );
}
