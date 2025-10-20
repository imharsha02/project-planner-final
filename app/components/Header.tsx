"use client";
import { TypographyH1 } from "./Typography/TypographyH1";
import { Button } from "@/components/ui/button";
import { login, logout } from "../lib/actions/auth";
import { signInWithGoogle } from "../lib/actions/auth";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const pathName = usePathname();
  return (
    <>
      {/* 1. Use 'justify-between' and apply horizontal padding (e.g., px-4 or px-6) to the main container. */}
      <div className="flex items-center justify-between w-full mx-auto px-6 py-4">
        {/* 2. Left Placeholder: Make it invisible and give it an arbitrary width to match the right side. */}
        {/* The width should be roughly the space occupied by the buttons. */}
        <div className="invisible w-[260px] md:w-[320px] lg:w-[380px]"></div>

        {/* 3. Center Element: Use flex-grow to take up all remaining space and ensure text-center for centering. */}
        <TypographyH1 className="py-3 tracking-wide flex-grow text-center">
          Project planner
        </TypographyH1>

        {/* 4. Right Buttons Container: Give it the same width as the placeholder for alignment and use flex to manage buttons. */}
        {/* Removed px-20 here as the main container now handles outer padding. */}
        <div className="flex items-center space-x-2 w-[260px] md:w-[320px] lg:w-[380px] justify-end">
          {pathName === "/" ? (
            // Flex container for buttons
            <div className="flex items-center space-x-2">
              <Button
                onClick={login}
                className="cursor-pointer p-5 hover:shadow-2xs transition"
                variant="outline"
              >
                <span>Sign in with </span>
                <Image
                  src="/images/github.svg"
                  alt="GitHub icon"
                  width={16}
                  height={16}
                />
              </Button>
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                className="cursor-pointer p-5 hover:shadow-2xs transition"
              >
                <span>Sign in with</span>{" "}
                <Image
                  src="/images/google.svg"
                  alt="Google icon"
                  width={16}
                  height={16}
                />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="cursor-pointer">
                My Projects
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="cursor-pointer"
              >
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
