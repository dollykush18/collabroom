'use client';

import Image from "next/image";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="logo"
        />
        <p className="text-[26px] font-extrabold text-white">
          COLLABROOM
        </p>
      </Link>

      {/* Navigation Links (from sidebar) */}
      <div className="flex items-center gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route ||
            pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                "flex items-center gap-2 text-white px-3 py-2 rounded-md",
                {
                  "bg-blue-1": isActive,
                }
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
              />
              <span className="font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* User + Mobile Nav */}
      <div className="flex items-center gap-5">
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;