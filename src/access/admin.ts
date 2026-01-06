import type { AccessArgs } from "payload";
import type { User } from "@/payload-types";

type isAdmin = (args: AccessArgs<User>) => boolean;

export const admin: isAdmin = ({ req }) => {
  if (!req.user) {
    return false;
  }

  const user = req.user as User & {
    role?: "developer" | "admin";
  };

  return user.role === "admin" || user.role === "developer";
};
