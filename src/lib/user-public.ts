import type { PublicUser } from "@/types/auth";

type UserLike = {
  _id: { toString(): string };
  email: string;
  name?: string;
  createdAt?: Date | string;
};

export function toPublicUser(user: UserLike): PublicUser {
  const createdAt =
    user.createdAt instanceof Date
      ? user.createdAt.toISOString()
      : typeof user.createdAt === "string"
        ? user.createdAt
        : new Date().toISOString();

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? "",
    createdAt,
  };
}
