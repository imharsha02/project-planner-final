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
import { motion } from "motion/react";

const Header = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userImage = session?.user?.image;
  const userName = session?.user?.name;
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-center fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border/40 z-50 shadow-sm"
    >
      <div className="flex items-center rounded-full bg-gradient-to-r from-gray-50 to-gray-100/80 my-3 justify-between px-6 py-2 w-1/4 md:w-1/3 lg:w-1/2 shadow-md border border-border/20">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <TypographyH1 className="py-3 tracking-wide bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Project planner
          </TypographyH1>
        </motion.div>

        <div className="flex justify-between items-center space-x-2">
          {isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer p-3 hover:shadow-md transition-all duration-200 bg-card border-border/50 hover:bg-accent"
                  >
                    <Link href="/add-a-project">Add a Project</Link>
                  </Badge>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer p-3 hover:shadow-md transition-all duration-200 bg-card border-border/50 hover:bg-accent"
                  >
                    <Link href="/Dashboard">Dashboard</Link>
                  </Badge>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer p-3 hover:shadow-md transition-all duration-200 bg-card border-border/50 hover:bg-destructive/10 hover:border-destructive/30"
                  >
                    Logout
                  </Badge>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={login}
                  className="cursor-pointer p-5 hover:shadow-md transition-all duration-200 border-border/50"
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
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={signInWithGoogle}
                  variant="outline"
                  className="cursor-pointer p-5 hover:shadow-md transition-all duration-200 border-border/50"
                >
                  <span>Sign in with</span>{" "}
                  <Image
                    src="/images/google.svg"
                    alt="Google icon"
                    width={16}
                    height={16}
                  />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          className="absolute right-10"
        >
          <Avatar
            className="h-10 w-10 border-2 border-primary/20 shadow-md"
            title={userName || "User"}
          >
            <AvatarImage
              src={userImage ?? undefined}
              alt={userName || "User"}
            />
            <AvatarFallback className="bg-primary/10">
              {userName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Header;
