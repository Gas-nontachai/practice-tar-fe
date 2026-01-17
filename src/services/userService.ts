import { apiClient } from "../lib/apiClient";
import type { UserPayload, UserRespond } from "../types";

export async function fetchAllUser(): Promise<UserRespond[]> {
  const { data } = await apiClient.get<UserRespond[]>("/api/users");
  return data;
}

export async function fetchUserByID(id: number): Promise<UserRespond> {
  const { data } = await apiClient.get<UserRespond>(`/api/users/${id}`);
  return data;
}

export async function createUser(payload: UserPayload): Promise<UserRespond> {
  const { data } = await apiClient.post<UserRespond>("/api/users", payload);
  return data;
}

export async function updateUser(
  id: number,
  payload: UserPayload,
): Promise<UserRespond> {
  const { data } = await apiClient.put<UserRespond>(
    `/api/users/${id}`,
    payload,
  );
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/api/users/${id}`);
}
