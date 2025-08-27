import { useState, useEffect } from "react";

export default function PatientForm({ slotId, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    address: "",
    slotId: slotId,
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, slotId }));
  }, [slotId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, slotId });
  };


  return (
    <form onSubmit={handleSubmit} className="mt-8 border p-6 rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
      <div className="grid grid-cols-1 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
}
