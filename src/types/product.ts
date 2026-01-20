export type ProductRespond = {
  id: number;
  name: string;
  price: number;
  description: string;
  img_path?: string;
};

export type ProductPayload = Omit<ProductRespond, "id">;
