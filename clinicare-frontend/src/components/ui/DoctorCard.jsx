
export default function DoctorCard({ doctor, onSelect }) {
  return (
    <div
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => onSelect(doctor)}
    >
      <div className="text-4xl mb-2">👨‍⚕️</div>
      <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
      <p className="text-gray-600">{doctor.specialization}</p>
      <p className="text-gray-600">Phone {doctor.phone}</p>
      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Book Appointment
      </button>
    </div>
  );
}
