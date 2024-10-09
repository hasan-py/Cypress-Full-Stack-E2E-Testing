import { AxiosInstance } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useHttp } from "./useHttp";

const deleteGame = async (data: any, http: AxiosInstance) => {
  const res = await http.delete(`/api/review/delete-review/${data?._id}`);
  return res;
};

export function useDeleteGame() {
  const queryClient = useQueryClient();
  const { http } = useHttp();

  return useMutation((data: any) => deleteGame(data, http), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("game-list");
      queryClient.invalidateQueries("map-data");
    },
  });
}
