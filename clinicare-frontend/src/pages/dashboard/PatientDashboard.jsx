import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../../api/patientApi";
import DoctorCard from "../../components/ui/DoctorCard";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  getDoctors()
    .then(data => setDoctors(data)) // ✅ no double .data
    .catch(err => {
      console.error("Error fetching doctors", err);
      setDoctors([]); // fallback
    });
}, []);


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Doctors</h2>
      {doctors.map(doc => (
      <DoctorCard key={doc.id} doctor={doc} onSelect={() => navigate(`/patient-dashboard/${doc.id}`)} />
    ))}
    </div>
  );
}
