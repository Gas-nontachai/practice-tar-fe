export type ProductRespond = {
  id: string;
  name: string;
  price: number;
  description: string;
  img_path?: string;
};

export type ProductPayload = Omit<ProductRespond, "id">;
