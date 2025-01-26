"use server";

import { verifyUserRequest } from "@/api/api";
import { User } from "@/types/user-types";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const authPaths = ["/login", "/register"];

export const verifyUserAccess = async (): Promise<User | null> => {
  const pathname = (await headers()).get("x-pathname") || "";
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  let user: User | null = null;

  try {
    user = await verifyUserRequest();
  } catch {
    const cookiesObj = await cookies();
    const token = cookiesObj.get("auth_token");

    if (token) {
      cookiesObj.delete("auth_token");
    }

    if (!isAuthPage) {
      redirect("/login");
    }
  }

  if (!!user && isAuthPage) {
    redirect("/");
  }

  return user;
};
