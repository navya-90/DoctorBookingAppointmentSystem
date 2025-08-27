import { useState } from "react";

const EditDoctorModal = ({ doctor, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...doctor });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Doctor</h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
          placeholder="Name"
        />

        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
          placeholder="Email"
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
          placeholder="Phone"
        />

        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
          placeholder="Specialization"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="text-gray-600 hover:underline">Cancel</button>
          <button onClick={handleSave} className="text-blue-600 hover:underline">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorModal;
