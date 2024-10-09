import { AxiosError, AxiosInstance } from "axios";
import { useQuery } from "react-query";
import { useHttp } from "./useHttp";

const checkModeRatorCreateOrNot = async (http: AxiosInstance) => {
  const res = await http.get(`/api/auth/check-moderator`);
  return res?.data;
};

export function useCheckModeratorCreate() {
  const { http } = useHttp();

  return useQuery<any, AxiosError>(
    ["check-moderator"],
    () => checkModeRatorCreateOrNot(http),
    {
      refetchOnWindowFocus: false,
    }
  );
}
