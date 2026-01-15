// product.api.ts
import { apiClient } from "../lib/apiClient";

export type ProductRespond = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type CreateProductPayload = {
  name: string;
  price: number;
  description: string;
};

export type UpdateProductPayload = {
  name?: string;
  price?: number;
  description?: string;
};

export async function fetchAllProduct(): Promise<ProductRespond[]> {
  const { data } = await apiClient.get<ProductRespond[]>("/api/products");
  return data;
}

export async function fetchProductByID(
  id: string
): Promise<ProductRespond> {
  const { data } = await apiClient.get<ProductRespond>(
    `/api/products/${id}`
  );
  return data;
}

export async function createProduct(
  payload: CreateProductPayload
): Promise<ProductRespond> {
  const { data } = await apiClient.post<ProductRespond>(
    "/api/products",
    payload
  );
  return data;
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<ProductRespond> {
  const { data } = await apiClient.put<ProductRespond>(
    `/api/products/${id}`,
    payload
  );
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/api/products/${id}`);
}