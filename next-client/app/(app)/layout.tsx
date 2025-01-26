import { AppHeader } from "@/components/common/app-header";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen layer-gradient">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-4">{children}</main>
    </div>
  );
}
