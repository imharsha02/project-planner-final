"use client";
import { TypographyH1 } from "./Typography/TypographyH1";
import { Button } from "@/components/ui/button";
import { login } from "../lib/actions/auth";
import { signInWithGoogle } from "../lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
//import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      className="flex items-center justify-center fixed top-0 w-full"
    >
      <div className="flex items-center my-3 justify-between px-3 sm:px-6 py-2 w-full sm:w-[90%] md:w-2/3 lg:w-1/2 mx-2 sm:mx-0">
        <motion.div
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex-shrink-0"
        >
          <TypographyH1 className="py-2 sm:py-3 text-xl sm:text-2xl md:text-3xl tracking-wide bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            <Link href="/">Project planner</Link>
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
              <div className="flex items-center space-x-6">
                <Link
                  href="/add-a-project"
                  className="relative text-sm font-medium text-foreground transition-all duration-300 hover:text-blue-600 group"
                >
                  Add a Project
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full group-hover:shadow-[0_2px_8px_rgba(37,99,235,0.6)]"></span>
                </Link>
                <Link
                  href="/Dashboard"
                  className="relative text-sm font-medium text-foreground transition-all duration-300 hover:text-blue-600 group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full group-hover:shadow-[0_2px_8px_rgba(37,99,235,0.6)]"></span>
                </Link>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1 }}
                  className="mr-2 cursor-pointer"
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
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? "✕" : "☰"}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer">
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
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Header;
