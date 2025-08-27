import { useEffect, useState } from 'react';
import AddDoctorForm from '../../components/admin/AddDoctorForm';
import DoctorList from '../../components/admin/DoctorList';
import { fetchAllDoctors, deleteDoctor, updateDoctor } from '../../api/doctorService'; 
import EditDoctorModal from '../../components/EditDoctorModal';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const loadDoctors = async () => {
      try {
        const data = await fetchAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to load doctors:', error);
      }
    };

  useEffect(() => {
    loadDoctors();
  }, [refresh]);

  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        setRefresh(prev => !prev);
      } catch (error) {
        console.error('Failed to delete doctor:', error);
      }
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
  };

  const handleSaveEdit = async (updatedDoctor) => {
    await updateDoctor(updatedDoctor.id, updatedDoctor);
    setEditingDoctor(null);
    loadDoctors();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Doctor Management</h1>
      <AddDoctorForm onSuccess={() => setRefresh(prev => !prev)} />
      <DoctorList doctors={doctors} onDelete={handleDelete} onEdit={handleEdit} />
      {editingDoctor && (
        <EditDoctorModal
          doctor={editingDoctor}
          onClose={() => setEditingDoctor(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default DoctorManagement;
