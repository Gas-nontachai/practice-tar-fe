export type UserRespond = {
  id: string;
  name: string;
};

export type UserPayload = Omit<UserRespond, "id">;
