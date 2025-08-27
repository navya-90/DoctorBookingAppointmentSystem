import instance from "./axiosInstance";

export const getDoctors = async () => {
  const response = await instance.get('/patient/doctors');
  return response.data;
};

export const getSlotsByDoctor = async (doctorId, page = 0, size = 5) => {
  const response = await instance.get(`/patient/slots/${doctorId}?page=${page}&size=${size}`);
  return response.data;
};

