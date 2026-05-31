import { useEffect, useState } from "react";
import { getSlotsByDoctor } from "../api/patientApi";
import { Calendar, Clock, ChevronLeft, ChevronRight, X, AlertCircle } from "lucide-react";

export default function PatientRescheduleModal({ doctorId, doctorName, onClose, onConfirm }) {
  const [slots, setSlots] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (doctorId) {
      fetchSlots();
    }
  }, [doctorId, page]);

  const fetchSlots = async () => {
    setFetching(true);
    setError("");
    try {
      const data = await getSlotsByDoctor(doctorId, page, 4); // 4 slots per page fits nicely in a modal
      setSlots(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      console.error("Error fetching slots for reschedule:", err);
      setError("Failed to load available slots.");
      setSlots([]);
    } finally {
      setFetching(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlotId) return;
    setLoading(true);
    try {
      await onConfirm(selectedSlotId);
    } catch (err) {
      setError(err?.message || "Failed to reschedule appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-lg mx-4 relative border border-gray-100 animate-in fade-in-50 zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Reschedule Appointment</h3>
        <p className="text-sm text-gray-500 mb-4">
          Select a new available slot with <span className="font-semibold text-blue-600">{doctorName}</span>.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {fetching ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 font-medium">Fetching available slots...</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 font-medium">No available slots found for this doctor.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/40 shadow-sm"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50/30"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{slot.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{slot.time}</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className={`w-full mt-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select Slot"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 disabled:opacity-40 disabled:hover:text-gray-600 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-gray-500">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 disabled:opacity-40 disabled:hover:text-gray-600 font-medium"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedSlotId || loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            Confirm Reschedule
          </button>
        </div>

      </div>
    </div>
  );
}
