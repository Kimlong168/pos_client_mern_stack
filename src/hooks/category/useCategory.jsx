import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useCategories = () => {
  return useQuery(
    "categories",
    async () => {
      const response = await axiosClient.get(`/categories`);
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

export const useCategory = (id) => {
  return useQuery(
    ["category", id],
    async () => {
      const response = await axiosClient.get(`/categories/${id}`);
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

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (category) => {
      const response = await axiosClient.post(`/categories`, category);

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (category) => {
      const response = await axiosClient.put(
        `/categories/${category.id}`,
        category
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (categoryId) => {
      const response = await axiosClient.delete(`/categories/${categoryId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );
};
