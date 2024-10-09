import { AxiosInstance } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useHttp } from "./useHttp";

const addNewGame = async (data: any, http: AxiosInstance) => {
  const res = await http.post(`/api/review/new-review`, data);
  return res;
};

export function useAddNewGame() {
  const queryClient = useQueryClient();
  const { http } = useHttp();

  return useMutation((data: any) => addNewGame(data, http), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("game-list");
      queryClient.invalidateQueries("map-data");
    },
  });
}
