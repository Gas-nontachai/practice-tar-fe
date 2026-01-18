export type RoleRespond = {
  id: number;
  name: string;
  description?: string;
};

export type RolePayload = Omit<RoleRespond, "id">;
