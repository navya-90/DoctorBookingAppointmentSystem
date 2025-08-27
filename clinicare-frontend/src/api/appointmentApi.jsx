import instance from "./axiosInstance";

export const bookAppointment = async (appointmentData) => {
  try {
    const response = await instance.post('/appointment/book', appointmentData);
    return { success: true, data: response.data };
  } catch (error) {
    const backendError = error.response?.data;
    const message =
      typeof backendError?.error === "string"
        ? backendError.error
        : "Unknown error occurred";

    return {
      success: false,
      error: message,
      status: error.response?.status,
    };
  }
};
