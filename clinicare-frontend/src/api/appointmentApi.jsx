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

export const fetchPatientAppointments = async () => {
  try {
    const response = await instance.get('/appointment/my-appointments');
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

export const cancelAppointment = async (id, reason) => {
  try {
    const response = await instance.post(`/appointment/${id}/cancel`, null, {
      params: reason ? { reason } : {},
    });
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

export const rescheduleAppointment = async (id, newSlotId) => {
  try {
    const response = await instance.post(`/appointment/${id}/reschedule`, null, {
      params: { newSlotId },
    });
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
