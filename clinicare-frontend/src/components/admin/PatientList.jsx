const PatientList = ({ patients }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">All Patients</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-t">
                  <td className="p-3">{patient.name}</td>
                  <td className="p-3">{patient.phone}</td>
                  <td className="p-3 capitalize">{patient.gender}</td>
                  <td className="p-3">{patient.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;
