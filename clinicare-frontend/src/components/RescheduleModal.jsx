import { useState } from "react";

const RescheduleModal = ({ onClose, onConfirm }) => {
  const [dateTime, setDateTime] = useState("");

  const handleSubmit = () => {
    if (dateTime) {
      onConfirm(dateTime);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Reschedule Appointment</h2>
        <input
          type="datetime-local"
          className="w-full border p-2 rounded mb-4"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 hover:underline">Cancel</button>
          <button onClick={handleSubmit} className="text-blue-600 hover:underline">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
