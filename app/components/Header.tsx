"use client";
import { Button } from "@/components/ui/button";
import { login } from "../lib/actions/auth";
import { signInWithGoogle } from "../lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, LayoutDashboard, Menu, X } from "lucide-react";

const Header = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userImage = session?.user?.image;
  const userName = session?.user?.name;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show loading state during session check to prevent hydration mismatch
  const isLoading = status === "loading";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/70 border-b border-border/20"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left side: Logo and Navigation */}
          <div className="flex items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Plan Desk Logo"
                    width={32}
                    height={32}
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10"
                  />
                </motion.div>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                  Plan Desk
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            {!isLoading && isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-1"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" size="sm" asChild className="gap-2">
                      <Link href="/add-a-project">
                        <Plus className="h-4 w-4" />
                        Add Project
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" size="sm" asChild className="gap-2">
                      <Link href="/Dashboard">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </nav>
            )}
          </div>

          {/* Right side: Auth buttons or Avatar */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoading && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={login}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Image
                      src="/images/github.svg"
                      alt="GitHub icon"
                      width={16}
                      height={16}
                    />
                    <span className="hidden sm:inline">
                      Sign in with GitHub
                    </span>
                    <span className="sm:hidden">GitHub</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={signInWithGoogle}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Image
                      src="/images/google.svg"
                      alt="Google icon"
                      width={16}
                      height={16}
                    />
                    <span className="hidden sm:inline">
                      Sign in with Google
                    </span>
                    <span className="sm:hidden">Google</span>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile Avatar */}
          <div className="md:hidden flex items-center gap-3">
            {!isLoading && isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Avatar
                      className="h-9 w-9 border-2 border-primary/20 cursor-pointer"
                      title={userName || "User"}
                    >
                      <AvatarImage
                        src={userImage ?? undefined}
                        alt={userName || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-sm font-medium">
                        {userName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/Dashboard" className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/add-a-project" className="cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
            {!isLoading && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={login}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Image
                      src="/images/github.svg"
                      alt="GitHub icon"
                      width={16}
                      height={16}
                    />
                    <span className="hidden sm:inline">GitHub</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={signInWithGoogle}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Image
                      src="/images/google.svg"
                      alt="Google icon"
                      width={16}
                      height={16}
                    />
                    <span className="hidden sm:inline">Google</span>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Desktop Avatar */}
          {!isLoading && isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="hidden md:block"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="outline-none focus:outline-none"
                  >
                    <Avatar
                      className="h-10 w-10 border-2 border-primary/20 cursor-pointer"
                      title={userName || "User"}
                    >
                      <AvatarImage
                        src={userImage ?? undefined}
                        alt={userName || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 font-medium">
                        {userName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/Dashboard" className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/add-a-project" className="cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
        </div>
      </div>

      {/* Mobile Menu - Only shown when not authenticated */}
      <AnimatePresence>
        {mobileMenuOpen && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-b border-border/20 bg-background/70"
          >
            <div className="flex flex-col p-4 space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  onClick={() => {
                    login();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Image
                    src="/images/github.svg"
                    alt="GitHub icon"
                    width={16}
                    height={16}
                  />
                  Sign in with GitHub
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Button
                  onClick={() => {
                    signInWithGoogle();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Image
                    src="/images/google.svg"
                    alt="Google icon"
                    width={16}
                    height={16}
                  />
                  Sign in with Google
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
