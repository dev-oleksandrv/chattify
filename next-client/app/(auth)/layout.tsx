import { AuthHeader } from "@/components/common/auth-header";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen layer-gradient">
      <AuthHeader />

      <main className="flex justify-center items-center flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
