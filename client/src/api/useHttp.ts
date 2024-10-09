import axios from "axios";
import { useMemo } from "react";

type HeaderType = {
  [key: string]: string | number;
};

const defaultParam = {
  auth: true,
};

export const useHttp = (param = defaultParam) => {
  return useMemo(() => {
    const headers: HeaderType = {
      "Content-Type": "application/json",
    };

    const http = axios.create({
      baseURL: "http://localhost:8000",
      headers,
    });

    return { http };
  }, []);
};
