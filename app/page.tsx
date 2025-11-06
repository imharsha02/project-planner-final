"use client";
import React from "react";
import { TypographyP } from "./components/Typography/TypographyP";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <div className="max-w-7xl mx-auto min-h-[80vh] flex items-center justify-center pt-8 px-4 sm:px-6">
      <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-3 sm:space-y-4"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent px-4"
          >
            Project Planner
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground px-4"
          >
            Transform chaos into clarity
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full mx-auto text-center rounded-2xl border border-border/50 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 bg-gradient-to-br from-card/50 via-card/30 to-card/50 backdrop-blur-sm shadow-xl"
        >
          <TypographyP className="text-sm sm:text-base md:text-lg leading-relaxed text-foreground/90">
            Transform chaos into clarity. The project planner helps you add
            tasks, set milestones, and visualize progress—all in one place.
            Whether you're managing a solo venture or leading a team, stay on
            top of deadlines and turn your goals into achievements effortlessly.
          </TypographyP>
        </motion.div>

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base md:text-lg w-full sm:w-auto"
              >
                <Link href="/Dashboard">Go to Dashboard</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                asChild
                size="lg"
                className="px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base md:text-lg w-full sm:w-auto"
              >
                <Link href="/add-a-project">Add a Project</Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Page;
