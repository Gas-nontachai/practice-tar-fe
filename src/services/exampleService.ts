import { apiClient } from "../lib/apiClient";

export type IndexResponse = {
  status: boolean;
  message: string;
};

export async function fetchExample(): Promise<IndexResponse> {
  const { data } = await apiClient.get<IndexResponse>("/");
  return data;
}
