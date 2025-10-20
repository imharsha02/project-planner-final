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
      <div className="flex items-center justify-between w-full mx-auto px-6 py-4">
        <div className="invisible w-[260px] md:w-[320px] lg:w-[380px]"></div>
        <TypographyH1 className="py-3 tracking-wide flex-grow text-center">
          Project planner
        </TypographyH1>
        <div className="flex items-center space-x-2 w-[260px] md:w-[320px] lg:w-[380px] justify-end">
          {pathName === "/" ? (
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
