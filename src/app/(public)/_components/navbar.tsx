"use client";
import ThemeToggle from "@/components/shared/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { UserDropDown } from "@/components/ui/user-dropdown";
import { navigationItems } from "@/constants/data";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-4 ">
          <Image
            alt="logo"
            src="/logo.svg"
            width={30}
            height={30}
            className="size-9"
          />
          <span className="font-bold"> EduNexta</span>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex md:flex-1 md:justify-between md:items-center  ">
          <div className="flex items-center space-x-2 px-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isPending ? null : session ? (
              <>
                <UserDropDown
                  name={
                    session.user.name && session.user.name.length > 0
                      ? session.user.name
                      : session.user.email
                  }
                  email={session.user.email}
                  image={
                    session.user.image ??
                    (`https://avatar.vercel.sh/${session.user.email}` ||
                      "")
                  }
                />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "default",
                  })}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
