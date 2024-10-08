import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useUsers = () => {
  return useQuery(
    "users",
    async () => {
      const response = await axiosClient.get(`/users`);
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

export const useUser = (id) => {
  return useQuery(
    ["user", id],
    async () => {
      const response = await axiosClient.get(`/users/${id}`);
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

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (newUser) => {
      const formData = new FormData();

      formData.append("name", newUser.name);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("role", newUser.role);
      formData.append("image", newUser.profile_picture);
      formData.append("chat_id", newUser.chat_id);

      const response = await axiosClient.post("/auth/register", formData);
      console.log("user result:", response.data);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch the users query to ensure fresh data
        queryClient.invalidateQueries("users");
      },
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (user) => {
      const formData = new FormData();
      
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("role", user.role);
      formData.append("image", user.profile_picture);
      formData.append("chat_id", user.chat_id);

      const response = await axiosClient.put(`/users/${user.id}`, formData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
};

export const useUpdatePassword = () => {
  return useMutation(async (user) => {
    const response = await axiosClient.put(`/users/${user.id}/password`, user);
    return response.data;
  });
};

export const useResetPassword = () => {
  return useMutation(async (data) => {
    const response = await axiosClient.put(`/users/reset-password`, data);
    console.log("response reset passworddd", response);
    return response.data;
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (userId) => {
      const response = await axiosClient.delete(`/users/${userId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
};
