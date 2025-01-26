import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

export const AppHeader = () => {
  return (
    <header className="bg-white bg-opacity-90 shadow-md h-14">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <Link href="/" className="text-lg sm:text-lg font-bold text-indigo-600">
          Chattify
        </Link>
        <nav className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/logout">
              <LogOutIcon />
              Logout
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
