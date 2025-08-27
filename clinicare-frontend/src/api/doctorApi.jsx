import instance from './axiosInstance';

export const fetchDoctorAppointments = async () => {
  const response = await instance.get('/doctor/appointments');
  return response.data; 
};

export const cancelAppointment = async (appointmentId) => {
  await instance.post(`/doctor/appointments/${appointmentId}/cancel`);
};

export const rescheduleAppointment = async (appointmentId, newDateTime) => {
  await instance.post(`/doctor/appointments/${appointmentId}/reschedule`, null, {
    params: { newDateTime },
  });
};

export const fetchPatientCount = async (doctorId) => {
  const response = await instance.get(`/doctor/${doctorId}/patient-count`);
  return response.data;
}
