"use server";

import { registerUserRequest } from "@/api/api";
import {
  registerUserSchema,
  RegisterUserSchemaType,
} from "@/schemas/auth-schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface RegisterUserActionState {
  errors: Record<string, string[]>;
  payload?: Partial<RegisterUserSchemaType>;
}

export const registerUserAction = async (
  _: RegisterUserActionState,
  formData: FormData
) => {
  const payload: RegisterUserActionState["payload"] = {
    email: formData.get("email")?.toString(),
    username: formData.get("username")?.toString(),
    password: formData.get("password")?.toString(),
    confirmPassword: formData.get("confirmPassword")?.toString(),
  };

  const { success, error, data } = await registerUserSchema.safeParseAsync(
    payload
  );

  if (!success && error) {
    return {
      errors: error.flatten().fieldErrors,
      payload,
    };
  }

  try {
    const result = await registerUserRequest(data);

    (await cookies()).set({
      name: "auth_token",
      value: result.token,
      path: "/",
      httpOnly: false,
      secure: true,
    });
  } catch (error) {
    console.log(error);
    return {
      errors: {
        server: ["Email is already in use"],
      },
      payload,
    };
  }

  redirect("/");
};
