import { verifyUserRequest } from "@/api/api";
import { AppHeader } from "@/components/common/app-header";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function AppLayout({ children }: PropsWithChildren) {
  try {
    const result = await verifyUserRequest();
    console.log(result);
  } catch (error) {
    console.log(error);
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen layer-gradient">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-4">{children}</main>
    </div>
  );
}
