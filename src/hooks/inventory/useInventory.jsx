import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useInventories = () => {
  return useQuery(
    "inventories",
    async () => {
      const response = await axiosClient.get(`/inventories`);
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

export const useInventory = (id) => {
  return useQuery(
    ["inventory", id],
    async () => {
      const response = await axiosClient.get(`/inventories/${id}`);
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

export const useInventoriesByProduct = (productId) => {
  return useQuery(
    "inventoriesByProduct",
    async () => {
      const response = await axiosClient.get(
        `/inventories/product/${productId}`
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

export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (inventory) => {
      const response = await axiosClient.post(`/inventories`, inventory);

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventories");
      },
    }
  );
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (inventory) => {
      const response = await axiosClient.put(
        `/inventories/${inventory.id}`,
        inventory
      );

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventories");
      },
    }
  );
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (inventoryId) => {
      const response = await axiosClient.delete(`/inventories/${inventoryId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventories");
      },
    }
  );
};
