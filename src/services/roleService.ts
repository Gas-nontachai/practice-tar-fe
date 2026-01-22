import { apiClient } from "../lib/apiClient";
import type { RolePayload, RoleRespond } from "../types";

export async function fetchAllRole(): Promise<RoleRespond[]> {
  const { data } = await apiClient.get<RoleRespond[]>("/api/roles");
  return data;
}

export async function fetchRoleByID(id: string | number): Promise<RoleRespond> {
  const { data } = await apiClient.get<RoleRespond>(`/api/roles/${id}`);
  return data;
}

export async function createRole(payload: RolePayload): Promise<RoleRespond> {
  const { data } = await apiClient.post<RoleRespond>("/api/roles", payload);
  return data;
}

export async function updateRole(
  id: string | number,
  payload: RolePayload,
): Promise<RoleRespond> {
  const { data } = await apiClient.put<RoleRespond>(
    `/api/roles/${id}`,
    payload,
  );
  return data;
}

export async function deleteRole(id: string): Promise<void> {
  await apiClient.delete(`/api/roles/${id}`);
}
