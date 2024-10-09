import { useToast } from "@chakra-ui/react";
import { AxiosInstance } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useHttp } from "./useHttp";

const createModerator = async (data: any, http: AxiosInstance) => {
  const res = await http.post(`/api/auth/create-moderator`, data);
  return res?.data;
};

export function useCreateModerator() {
  const queryClient = useQueryClient();
  const { http } = useHttp();
  const toast = useToast();

  return useMutation((data: any) => createModerator(data, http), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("check-moderator");

      toast({
        title: `Moderator created successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: `Something went wrong`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    },
  });
}
