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
import { loginUserAction, LoginUserActionState } from "./actions";
import { FormErrorMessages } from "@/components/common/form-error-messages";
import { AlertErrorMessages } from "@/components/common/alert-error-messages";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<
    LoginUserActionState,
    FormData
  >(loginUserAction, {} as LoginUserActionState);

  console.log(state);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="underline text-primary">
            Sign Up
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
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              defaultValue={state?.payload?.email ?? ""}
            />
            {state?.errors?.email && (
              <FormErrorMessages errors={state.errors.email} />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              defaultValue={state?.payload?.password ?? ""}
            />
            {state?.errors?.password && (
              <FormErrorMessages errors={state.errors.password} />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" disabled={pending} type="submit">
            Sign In
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
            Sign in with Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
