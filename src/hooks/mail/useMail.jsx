import { useMutation } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useSendMail = () => {
  return useMutation(async (mailData) => {
    const response = await axiosClient.post(`/mail/send`, mailData);

    return response.data;
  });
};

export const useRequestOtp = () => {
  return useMutation(async (data) => {
    const response = await axiosClient.post(`/mail/request-otp`, data);

    return response.data;
  });
};

export const useVerifyOtp = () => {
  return useMutation(async (data) => {
    const response = await axiosClient.post(`/mail/verify-otp`, data);

    console.log("response verify otp", response);

    return response.data;
  });
};
