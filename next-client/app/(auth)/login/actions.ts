"use server";

import { loginUserRequest } from "@/api/api";
import { loginUserSchema, LoginUserSchemaType } from "@/schemas/auth-schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface LoginUserActionState {
  errors: Record<string, string[]>;
  payload?: Partial<LoginUserSchemaType>;
}

export const loginUserAction = async (
  _: LoginUserActionState,
  formData: FormData
) => {
  const payload: LoginUserActionState["payload"] = {
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  };

  const { success, error, data } = await loginUserSchema.safeParseAsync(
    payload
  );

  if (!success && error) {
    return {
      errors: error.flatten().fieldErrors,
      payload,
    };
  }

  try {
    const result = await loginUserRequest(data);

    (await cookies()).set({
      name: "auth_token",
      value: result.token,
      path: "/",
      httpOnly: false,
      secure: true,
    });
  } catch {
    return {
      errors: {
        server: ["Invalid email or password"],
      },
      payload,
    };
  }

  redirect("/");
};
