import { useEffect, useState } from 'react';
import { fetchAllPatients } from '../../api/doctorService';
import PatientList from '../../components/admin/PatientList';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      const res = await fetchAllPatients();
      if (res.success) {
        setPatients(res.data);
      }
      setLoading(false);
    };
    loadPatients();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
      {loading ? <p>Loading...</p> : <PatientList patients={patients} />}
    </div>
  );
};

export default PatientManagement;
