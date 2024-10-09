import { AxiosInstance } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useHttp } from "./useHttp";

const postCommentReview = async (data: any, http: AxiosInstance) => {
  const res = await http.put(`/api/review/update-review/${data?._id}`, data);
  return res;
};

export function useCommentReview() {
  const queryClient = useQueryClient();
  const { http } = useHttp();

  return useMutation((data: any) => postCommentReview(data, http), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("game-details");
    },
  });
}
