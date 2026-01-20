import { API_BASE_URL } from "@/lib/apiClient";

export const pathImg = (path: string) => {
  return ` ${API_BASE_URL}/${path}`;
};
