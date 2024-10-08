import { useQuery } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useSaleReport = (date) => {
  return useQuery(
    "reports",
    async () => {
      const response = await axiosClient.get(`/reports/sales?date=${date}`);
      console.log("response result:", response.data);
      return response.data;
    },
    {
      select: (response) => {
        const formatedData = response.data;
        return formatedData;
      },
    }
  );
};
