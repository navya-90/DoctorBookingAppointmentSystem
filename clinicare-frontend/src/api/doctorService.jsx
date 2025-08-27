import instance from "./axiosInstance";


export const fetchAllDoctors = async () => {
  const response = await instance.get('/admin/doctors');
  return response.data;
};

export const addDoctor = async (doctorData) => {
  const response = await instance.post('/admin/add-doctor', doctorData);
  return response.data;
};

export const updateDoctor = async (id, updatedData) => {
  const response = await instance.put(`/admin/edit-doctor/${id}`, updatedData);
  return response.data;
};

export const deleteDoctor = async (id) => {
  await instance.delete(`/admin/delete-doctor/${id}`);
};

export const getDoctorById = async (id) => {
  const response = await instance.get(`/admin/doctor/${id}`);
  return response.data;
};

export const fetchDashboardSummary = async () => {
  const response = await instance.get("/admin/dashboard-summary");
  return response.data;
};

export const fetchAllPatients = async () => {
  try {
    const response = await instance.get('/admin/patients');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || "Unknown error occurred",
    };
  }
};