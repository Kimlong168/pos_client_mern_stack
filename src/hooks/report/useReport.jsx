import { useQuery } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useSaleReport = (date) => {
  return useQuery(
    "saleReports",
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

export const useAttendanceReport = (date) => {
  return useQuery(
    "attendanceReports",
    async () => {
      const response = await axiosClient.get(
        `/reports/attendance?date=${date}`
      );
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

export const useAttendanceReportByThisMonth = () => {
  return useQuery(
    "attendanceReportsByMonth",
    async () => {
      const response = await axiosClient.get(
        `/reports/attendance/month`
      );
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
