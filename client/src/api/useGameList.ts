import { AxiosError, AxiosInstance } from "axios";
import { useQuery } from "react-query";
import { useHttp } from "./useHttp";

const getGameList = async (http: AxiosInstance) => {
  const res = await http.get(`/api/review/list-review`);
  return res.data?.data;
};

export function useGameList() {
  const { http } = useHttp();

  return useQuery<any, AxiosError>(["game-list"], () => getGameList(http), {
    refetchOnWindowFocus: false,
  });
}
