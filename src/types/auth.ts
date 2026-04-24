export type PublicUser = {
  id: string;
  email: string;
  name: string;
  role: "User" | "SuperAdmin";
  createdAt: string;
};
