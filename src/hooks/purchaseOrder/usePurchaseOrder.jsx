import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const usePurchaseOrders = () => {
  return useQuery(
    "purchaseOrders",
    async () => {
      const response = await axiosClient.get(`/purchase-orders`);
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

export const usePurchaseOrder = (id) => {
  return useQuery(
    ["purchaseOrder", id],
    async () => {
      const response = await axiosClient.get(`/purchase-orders/${id}`);
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

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (purchaseOrder) => {
      const response = await axiosClient.post(`/purchase-orders`, purchaseOrder);

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("purchaseOrders");
      },
    }
  );
};

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (purchaseOrder) => {
      const response = await axiosClient.put(
        `/purchase-orders/${purchaseOrder.id}`,
        purchaseOrder
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("purchaseOrders");
      },
    }
  );
};

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (purchaseOrderId) => {
      const response = await axiosClient.delete(
        `/purchase-orders/${purchaseOrderId}`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("purchaseOrders");
      },
    }
  );
};
