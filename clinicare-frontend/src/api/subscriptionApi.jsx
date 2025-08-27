import instance from "./axiosInstance";

export const upgradeSubscription = async (planType) => {
  try {
    const response = await instance.patch(`/subscription/upgrade?planType=${planType}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || "Unknown error occurred",
      status: error.response?.status
    };
  }
};
