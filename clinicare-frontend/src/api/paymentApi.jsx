import instance from "./axiosInstance";

export const createPaymentLink = async (planType) => {
    const res = await instance.post(`/payments/${planType}`);
    return res.data; 
};