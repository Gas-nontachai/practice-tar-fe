export type RoleRespond = {
  id: string;
  name: string;
  description?: string;
};

export type RolePayload = Omit<RoleRespond, "id">;
