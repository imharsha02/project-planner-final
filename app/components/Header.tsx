"use client";
import { TypographyH1 } from "./Typography/TypographyH1";
import { Button } from "@/components/ui/button";
import { login } from "../lib/actions/auth";
import { signInWithGoogle } from "../lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userImage = session?.user?.image;
  const userName = session?.user?.name;
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center rounded-full bg-gray-100 my-3 justify-between px-6 w-1/4 md:w-1/3 lg:w-1/2">
        <TypographyH1 className="py-3 tracking-wide">
          Project planner
        </TypographyH1>

        <div className="flex justify-between items-center space-x-2">
          {isAuthenticated ? (
            <div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="cursor-pointer p-3 hover:shadow-2xs transition"
                >
                  <Link href="/add-a-project">Add a Project</Link>
                </Badge>

                <Badge
                  variant="outline"
                  className="cursor-pointer p-3 hover:shadow-2xs transition"
                >
                  <Link href="/Dashboard">Dashboard</Link>
                </Badge>
                <Badge
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer p-3"
                >
                  Logout
                </Badge>
              </div>
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
      <Avatar className="h-10 w-10 absolute right-10">
        <AvatarImage src={userImage ?? undefined} alt={userName || "User"} />
        <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Header;
