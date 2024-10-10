import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useLeaveRequests = () => {
  return useQuery(
    "leaveRequests",
    async () => {
      const response = await axiosClient.get(`/leave-requests`);
      console.log("response resultsssss:", response.data);
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

export const useLeaveRequest = (id) => {
  return useQuery(
    ["leaveRequest", id],
    async () => {
      const response = await axiosClient.get(`/leave-requests/${id}`);
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

export const useLeaveRequestsByEmployeeId = (id) => {
  return useQuery(
    ["leaveRequest", id],
    async () => {
      const response = await axiosClient.get(`/leave-requests/employee/${id}`);
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


export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (request) => {
      const response = await axiosClient.post(`/leave-requests`, request);

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("leaveRequests");
      },
    }
  );
};

export const useUpdateLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (request) => {
      const response = await axiosClient.put(
        `/leave-requests/${request.id}`,
        request
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("leaveRequests");
      },
    }
  );
};

export const useDeleteLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id) => {
      const response = await axiosClient.delete(`/leave-requests/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("leaveRequests");
      },
    }
  );
};

export const useApproveOrRejectLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (request) => {
      const response = await axiosClient.put(
        `/leave-requests/approve/${request.id}`,
        request
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("leaveRequests");
      },
    }
  );
};

export const useClearAllLeaveRequests = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      const response = await axiosClient.delete(`/leave-requests/clear-all`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("leaveRequests");
        
      },
    }
  );
};


