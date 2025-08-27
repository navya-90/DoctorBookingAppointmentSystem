import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getSlotsByDoctor } from "../../api/patientApi";
import { bookAppointment } from "../../api/appointmentApi";
import {  AlertCircle } from "lucide-react";
import SlotCard from "../../components/ui/SlotCard";
import PatientForm from "../../components/PatientForm";

export default function DoctorSlotBooking() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [slots, setSlots] = useState([]);
  const [page, setPage] = useState(0);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "", age: "", gender: "", address: "", slotId: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, [page]);

  useEffect(() => {
  console.log("Current formData:", formData);
}, [formData]);


  const fetchSlots = () => {
  getSlotsByDoctor(doctorId, page)
  .then(data => {
    console.log("Slot API Response:", data); // ✅ Now data = { content, totalPages, ... }
    setSlots(data?.content || []);
  })
  .catch(err => {
    console.error("Error fetching slots:", err);
    setSlots([]);
  });

};


  const handleSubmit = async (formData) => {
  setLoading(true);

  try {
    const res = await bookAppointment(formData);

    if (!res.success) {
      const error = res.error || "Unknown error occurred";

      if (error.includes("used all 3 free appointments")) {
        alert("You've used all 3 free appointments. Upgrade to continue.");
        navigate("/pricing");
      } else if (error.includes("subscription has expired")) {
        alert("Your subscription has expired. Please upgrade.");
        navigate("/pricing");
      } else {
        alert("Booking failed. " + error);
      }
      return;
    }

    // Success case
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setFormData({ patientName: "", age: "", gender: "", address: "", slotId: "" });
    fetchSlots();

  } catch (err) {
    console.error("Booking failed:", err);

    const errorMessage = err?.response?.data?.error || err?.message || "Unknown error occurred";

    if (errorMessage.includes("used all 3 free appointments")) {
      alert("You've used all 3 free appointments. Upgrade to continue.");
      navigate("/pricing");
    } else if (errorMessage.includes("subscription has expired")) {
      alert("Your subscription has expired. Please upgrade.");
      navigate("/pricing");
    } else {
      alert("Booking failed. " + errorMessage);
    }

  } finally {
    setLoading(false);
  }
};


  const formRef = useRef(null);
    useEffect(() => {
    if (formData.slotId && formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
    }
    }, [formData.slotId]);


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Slots</h2>
      
      {slots.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-400" />
          No slots available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {slots.map(slot => (
            <SlotCard key={slot.id} slot={slot} onSelect={(slotId) =>
              setFormData(prev => ({ ...prev, slotId }))} />
         ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button onClick={() => setPage(p => Math.max(p - 1, 0))} className="text-sm text-blue-600 hover:underline">Previous</button>
        <button onClick={() => setPage(p => p + 1)} className="text-sm text-blue-600 hover:underline">Next</button>
      </div>

      {formData.slotId && (
     <div ref={formRef}>
        <PatientForm
        slotId={formData.slotId}
        onSubmit={handleSubmit}
        loading={loading}
        />
     </div>
    )}

    {success && (
        <div className="bg-green-100 text-green-700 border border-green-300 px-4 py-3 rounded mt-6">
            ✅ Appointment booked successfully!
        </div>
    )}


    </div>
  );
}
