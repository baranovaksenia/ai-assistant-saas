"use client";
import { Poppins } from "next/font/google";

import { Menu } from "lucide-react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import MobileSidebar from "./MobileSidebar";
import ModeToggle from "./ModeToggle";
// import { ModeToggle } from "./mode-toggle";
// import MobileSidebar from "./mobile-sidebar";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
  style: "italic",
});

const Navbar = () => {
  return (
    <div
      className="h-16 w-full fixed z-50 flex justify-between 
  items-center py-2 px-4 border-b border-primary/10 
   bg-secondary"
    >
      <div className="flex items-center">
        <MobileSidebar />
        <Link href="/">
          <h1
            className={cn(
              "hidden md:block text-xl lg:text-3xl font-bold text-primary",
              font.className,
              font.style
            )}
          >
            AI.Assistant
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-x-3">
        <Button className="sm" variant="premium">
          Upgrade
          <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
        </Button>
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
