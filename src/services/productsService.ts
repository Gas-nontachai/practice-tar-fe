import { apiClient } from "../lib/apiClient";
import type { ProductPayload, ProductRespond } from "../types";

export async function fetchAllProduct(): Promise<ProductRespond[]> {
  const { data } = await apiClient.get<ProductRespond[]>("/api/products");
  return data;
}

export async function fetchProductByID(
  id: string | number,
): Promise<ProductRespond> {
  const { data } = await apiClient.get<ProductRespond>(`/api/products/${id}`);
  return data;
}

export async function createProduct(
  payload: ProductPayload,
): Promise<ProductRespond> {
  const { data } = await apiClient.post<ProductRespond>(
    "/api/products",
    payload,
  );
  return data;
}

export async function updateProduct(
  id: string | number,
  payload: ProductPayload,
): Promise<ProductRespond> {
  const { data } = await apiClient.put<ProductRespond>(
    `/api/products/${id}`,
    payload,
  );
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/api/products/${id}`);
}
