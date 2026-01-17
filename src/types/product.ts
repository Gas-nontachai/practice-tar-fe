export type ProductRespond = {
  id: number;
  name: string;
  price: number;
  description: string;
};

export type ProductPayload = Omit<ProductRespond, "id">;
