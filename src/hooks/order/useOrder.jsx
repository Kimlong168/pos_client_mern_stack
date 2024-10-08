import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useOrders = () => {
  return useQuery(
    "orders",
    async () => {
      const response = await axiosClient.get(`/orders`);
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

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (newOrder) => {
      const response = await axiosClient.post("/orders", newOrder);
      console.log("order result:", response.data);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch the orders query to ensure fresh data
        queryClient.invalidateQueries("orders");
      },
    }
  );
};

// update order

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (order) => {
      const response = await axiosClient.put(`/orders/${order._id}`, order);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("orders");
      },
    }
  );
};

// delete order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (orderId) => {
      const response = await axiosClient.delete(`/orders/${orderId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("orders");
      },
    }
  );
};
