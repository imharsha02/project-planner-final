"use client";
import { TypographyH1 } from "./Typography/TypographyH1";
import { Button } from "@/components/ui/button";
import { login } from "../lib/actions/auth";
import { usePathname } from "next/navigation";
import { signInWithGoogle } from "../lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const pathName = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userImage = session?.user?.image;
  const userName = session?.user?.name;
  return (
    <>
      <div className="flex items-center justify-between w-full mx-auto px-6 py-4">
        <TypographyH1 className="py-3 tracking-wide flex-grow text-center">
          Project planner
        </TypographyH1>
        <div className="flex items-center space-x-2 w-[260px] md:w-[320px] lg:w-[380px] justify-end">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-10 w-10 cursor-pointer">
                    {userImage && (
                      <AvatarImage src={userImage} alt={userName || "User"} />
                    )}
                    <AvatarFallback>
                      {userName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign out
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/${session?.user?.id}/my_projects`}>
                      My Projects
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {pathName != "/add-a-project" ? (
                <Button
                  variant="outline"
                  className="coursor-pointer"
                  asChild={true}
                >
                  <Link href="/add-a-project">Add a Project</Link>
                </Button>
              ) : (
                <></>
              )}
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
