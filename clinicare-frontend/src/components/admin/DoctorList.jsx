const DoctorList = ({ doctors, onDelete, onEdit }) => {
  return (
    <div className="bg-white shadow rounded p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">All Doctors</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Specialization</th>
            <th className="p-2">Experience</th>
            <th className="p-2">License</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-500">
                No doctors found.
              </td>
            </tr>
          ) : (
            doctors.map((doctor) => (
              <tr key={doctor.id} className="border-b">
                <td className="p-2">{doctor.name}</td>
                <td className="p-2">{doctor.email}</td>
                <td className="p-2">{doctor.phone}</td>
                <td className="p-2">{doctor.specialization}</td>
                <td className="p-2">{doctor.experience} yrs</td>
                <td className="p-2">{doctor.licenseNumber}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => onEdit(doctor)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => onDelete(doctor.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorList;
