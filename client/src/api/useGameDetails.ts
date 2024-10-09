import { AxiosError, AxiosInstance } from "axios";
import { useQuery } from "react-query";
import { useHttp } from "./useHttp";

const getGameDetails = async (http: AxiosInstance, id: string) => {
  if (id) {
    const res = await http.get(`/api/review/get-review/${id}`);

    return res.data?.data;
  }
  return [];
};

export function useGameDetails(id: string) {
  const { http } = useHttp();

  return useQuery<any, AxiosError>(
    ["game-details", id],
    () => getGameDetails(http, id),
    {
      refetchOnWindowFocus: false,
    }
  );
}
