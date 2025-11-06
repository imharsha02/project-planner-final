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
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userImage = session?.user?.image;
  const userName = session?.user?.name;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-center fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border/40 z-50 shadow-sm"
    >
      <div className="flex items-center rounded-full bg-gradient-to-r from-gray-50 to-gray-100/80 my-3 justify-between px-3 sm:px-6 py-2 w-full sm:w-[90%] md:w-2/3 lg:w-1/2 shadow-md border border-border/20 mx-2 sm:mx-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex-shrink-0"
        >
          <TypographyH1 className="py-2 sm:py-3 text-xl sm:text-2xl md:text-3xl tracking-wide bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Project planner
          </TypographyH1>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center space-x-2">
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
                    className="cursor-pointer p-2 sm:p-3 hover:shadow-md transition-all duration-200 bg-card border-border/50 hover:bg-accent text-xs sm:text-sm"
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
                    className="cursor-pointer p-2 sm:p-3 hover:shadow-md transition-all duration-200 bg-card border-border/50 hover:bg-accent text-xs sm:text-sm"
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
                    className="cursor-pointer p-2 sm:p-3 hover:shadow-md transition-all duration-200 bg-card border-border/50 hover:bg-destructive/10 hover:border-destructive/30 text-xs sm:text-sm"
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
                  className="cursor-pointer p-3 sm:p-5 hover:shadow-md transition-all duration-200 border-border/50 text-xs sm:text-sm"
                  variant="outline"
                >
                  <span className="hidden sm:inline">Sign in with </span>
                  <span className="sm:hidden">GitHub</span>
                  <Image
                    src="/images/github.svg"
                    alt="GitHub icon"
                    width={16}
                    height={16}
                    className="ml-1"
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
                  className="cursor-pointer p-3 sm:p-5 hover:shadow-md transition-all duration-200 border-border/50 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Sign in with</span>
                  <span className="sm:hidden">Google</span>{" "}
                  <Image
                    src="/images/google.svg"
                    alt="Google icon"
                    width={16}
                    height={16}
                    className="ml-1"
                  />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
              className="mr-2"
            >
              <Avatar
                className="h-8 w-8 border-2 border-primary/20 shadow-md"
                title={userName || "User"}
              >
                <AvatarImage
                  src={userImage ?? undefined}
                  alt={userName || "User"}
                />
                <AvatarFallback className="bg-primary/10 text-xs">
                  {userName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border/40 shadow-lg z-40"
          >
            <div className="flex flex-col p-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/add-a-project"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    Add a Project
                  </Link>
                  <Link
                    href="/Dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg hover:bg-destructive/10 text-left transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      login();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Image
                      src="/images/github.svg"
                      alt="GitHub icon"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    Sign in with GitHub
                  </Button>
                  <Button
                    onClick={() => {
                      signInWithGoogle();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Image
                      src="/images/google.svg"
                      alt="Google icon"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    Sign in with Google
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Avatar */}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          className="hidden md:block absolute right-4 lg:right-10"
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
