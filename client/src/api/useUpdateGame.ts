import { AxiosInstance } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useHttp } from "./useHttp";

const editGame = async (data: any, http: AxiosInstance) => {
  const res = await http.put(`/api/review/update-review/${data?._id}`, data);
  return res;
};

export function useEditGame() {
  const queryClient = useQueryClient();
  const { http } = useHttp();

  return useMutation((data: any) => editGame(data, http), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("game-list");
      queryClient.invalidateQueries("map-data");
    },
  });
}
