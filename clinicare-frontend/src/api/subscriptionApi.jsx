import instance from "./axiosInstance";

export const upgradeSubscription = async (planType, paymentDetails) => {
  try {
    const { paymentId, paymentLinkId, paymentLinkReferenceId, paymentLinkStatus, signature } = paymentDetails;
    const response = await instance.patch(
      `/subscription/upgrade?planType=${planType}&paymentId=${paymentId}&paymentLinkId=${paymentLinkId}&paymentLinkReferenceId=${paymentLinkReferenceId || ""}&paymentLinkStatus=${paymentLinkStatus}&signature=${signature}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || "Unknown error occurred",
      status: error.response?.status
    };
  }
};
