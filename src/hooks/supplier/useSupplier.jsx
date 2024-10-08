import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useSuppliers = () => {
  return useQuery(
    "suppliers",
    async () => {
      const response = await axiosClient.get(`/suppliers`);
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

export const useSupplier = (id) => {
  return useQuery(
    ["supplier", id],
    async () => {
      const response = await axiosClient.get(`/suppliers/${id}`);
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

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (supplier) => {
      const response = await axiosClient.post(`/suppliers`, supplier);

      console.log("supplier result:", response.data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("suppliers");
      },
    }
  );
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (supplier) => {
      const response = await axiosClient.put(
        `/suppliers/${supplier.id}`,
        supplier
      );

      console.log("supplier result:", response.data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("suppliers");
      },
    }
  );
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (supplierId) => {
      const response = await axiosClient.delete(`/suppliers/${supplierId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("suppliers");
      },
    }
  );
};
