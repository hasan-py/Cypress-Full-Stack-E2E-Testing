import { AxiosError, AxiosInstance } from "axios";
import { useQuery } from "react-query";
import { useHttp } from "./useHttp";

const getMapData = async (http: AxiosInstance) => {
  const res = await http.get(`/api/review/map-data`);
  return res.data?.data;
};

export function useMapData() {
  const { http } = useHttp();

  return useQuery<any, AxiosError>(["map-data"], () => getMapData(http), {
    refetchOnWindowFocus: false,
  });
}
