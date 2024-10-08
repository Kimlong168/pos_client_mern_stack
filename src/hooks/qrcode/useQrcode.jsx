import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useQrcodes = () => {
  return useQuery(
    "qrcodes",
    async () => {
      const response = await axiosClient.get(`/qr-code`);
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

export const useQrcode = (id) => {
  return useQuery(
    ["qrcode", id],
    async () => {
      const response = await axiosClient.get(`/qr-code/${id}`);
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

export const useCreateQrcode = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (qrcode) => {
      const response = await axiosClient.post(`/qr-code`, qrcode);

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("qrcodes");
      },
    }
  );
};

export const useUpdateQrcode = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (qrcode) => {
      const response = await axiosClient.put(`/qr-code/${qrcode.id}`, qrcode);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("qrcodes");
      },
    }
  );
};

export const useDeleteQrcode = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id) => {
      const response = await axiosClient.delete(`/qr-code/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("qrcodes");
      },
    }
  );
};
