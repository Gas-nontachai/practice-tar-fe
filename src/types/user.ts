export type UserRespond = {
  id: number;
  name: string;
};

export type UserPayload = Omit<UserRespond, "id">;
