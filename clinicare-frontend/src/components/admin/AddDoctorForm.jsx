import { useState } from "react";
import { addDoctor } from "../../api/doctorService";

const AddDoctorForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    licenseNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoctor(formData);
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        licenseNumber: "",
      });
      onSuccess(); // Trigger refresh in parent
    } catch (err) {
      console.error("Doctor registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input name="name" value={formData.name} onChange={handleChange} required placeholder="Name" className="border p-2 rounded" />
      <input name="email" value={formData.email} onChange={handleChange} required placeholder="Email" type="email" className="border p-2 rounded" />
      <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone" className="border p-2 rounded" />
      <input name="specialization" value={formData.specialization} onChange={handleChange} required placeholder="Specialization" className="border p-2 rounded" />
      <input name="experience" value={formData.experience} onChange={handleChange} required placeholder="Experience (years)" type="number" className="border p-2 rounded" />
      <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required placeholder="License Number" className="border p-2 rounded" />
      <button type="submit" disabled={loading} className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {loading ? "Registering..." : "Add Doctor"}
      </button>
    </form>
  );
};

export default AddDoctorForm;
