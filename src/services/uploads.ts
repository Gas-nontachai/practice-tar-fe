import { apiClient } from "../lib/apiClient";
import type { UploadedFile } from "@/types/upload";

export async function uploadSingle(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<{ file: UploadedFile }>(
    "/api/uploads/single",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.file;
}

export async function uploadMultiple(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const { data } = await apiClient.post<{
    files: UploadedFile[];
  }>("/api/uploads/multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.files;
}
