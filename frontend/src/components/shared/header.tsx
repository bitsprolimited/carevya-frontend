import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Care<span className="text-brand-blue">VYA</span>
        </Link>
        <Navbar />
        <Button className="hidden sm:inline-flex" size="sm">
          Join Waitlist
        </Button>
      </div>
    </header>
  );
}
