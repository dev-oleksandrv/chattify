"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { registerUserAction, RegisterUserActionState } from "./actions";
import { AlertErrorMessages } from "@/components/common/alert-error-messages";
import { FormErrorMessages } from "@/components/common/form-error-messages";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<
    RegisterUserActionState,
    FormData
  >(registerUserAction, {} as RegisterUserActionState);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Already have an account?{" "}
          <Link href="/login" className="underline text-primary">
            Sign In
          </Link>
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.errors?.server && (
            <AlertErrorMessages errors={state.errors.server} />
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="john@example.com"
              defaultValue={state?.payload?.email ?? ""}
            />
            {state?.errors?.email && (
              <FormErrorMessages errors={state.errors.email} />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              id="username"
              placeholder="johndoe"
              defaultValue={state?.payload?.username ?? ""}
            />
            {state?.errors?.username && (
              <FormErrorMessages errors={state.errors.username} />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              id="password"
              type="password"
              defaultValue={state?.payload?.password ?? ""}
            />
            {state?.errors?.password && (
              <FormErrorMessages errors={state.errors.password} />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              name="confirmPassword"
              id="confirm-password"
              type="password"
              defaultValue={state?.payload?.confirmPassword ?? ""}
            />
            {state?.errors?.confirmPassword && (
              <FormErrorMessages errors={state.errors.confirmPassword} />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" disabled={pending} type="submit">
            Create Account
          </Button>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" disabled>
            Sign up with Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
