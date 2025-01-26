import { Button } from "@/components/ui/button";
import Link from "next/link";

export const AuthHeader = () => {
  return (
    <header className="bg-white bg-opacity-90 shadow-md h-14">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <p className="text-lg sm:text-lg font-bold text-indigo-600">Chattify</p>
        <nav className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
