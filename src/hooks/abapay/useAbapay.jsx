import { useMutation } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useAbapay = () => {
  return useMutation(async (data) => {
    const response = await axiosClient.post(`/aba-payway/checkout`, data);

    return response.data;
  });
};
