import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useAttendances = () => {
  return useQuery(
    "attendances",
    async () => {
      const response = await axiosClient.get(`/attendance`);
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

export const useAttendance = (id) => {
  return useQuery(
    ["attendance", id],
    async () => {
      const response = await axiosClient.get(`/attendance/${id}`);
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

export const useAttendancesByEmployeeId = (id) => {
  return useQuery(
    ["attendance", id],
    async () => {
      const response = await axiosClient.get(`/attendance/employee/${id}`);
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

export const useCheckInAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (attendance) => {
      const response = await axiosClient.post(
        `/attendance/check-in`,
        attendance
      );

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("attendances");
      },
    }
  );
};

export const useCheckOutAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (attendance) => {
      const response = await axiosClient.put(
        `/attendance/check-out`,
        attendance
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("attendances");
      },
    }
  );
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (attendanceId) => {
      const response = await axiosClient.delete(`/attendance/${attendanceId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("attendances");
      },
    }
  );
};
