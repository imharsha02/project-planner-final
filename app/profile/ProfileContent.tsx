"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getProfileAction,
  updateUsernameAction,
} from "../actions/profileActions";
import { toast } from "sonner";
import { User, Edit2, Save, X, Mail, Loader2 } from "lucide-react";

export default function ProfileContent() {
  const [profile, setProfile] = useState<{
    id: string;
    username: string;
    user_email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await getProfileAction();
        setProfile(profileData);
        setUsername(profileData?.username || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveUsername = async () => {
    if (!profile) return;

    if (username.trim() === profile.username) {
      setIsEditingUsername(false);
      return;
    }

    if (username.trim().length === 0) {
      toast.error("Username cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      await updateUsernameAction(username.trim());
      const updatedProfile = await getProfileAction();
      setProfile(updatedProfile);
      toast.success("Username updated successfully");
      setIsEditingUsername(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update username"
      );
      setUsername(profile.username);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl flex flex-col space-y-8 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
            >
              Profile
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              View and manage your account information
            </motion.p>
          </div>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                  >
                    <User className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {isEditingUsername ? (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="max-w-xs"
                            placeholder="Username"
                            disabled={isSaving}
                          />
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              onClick={handleSaveUsername}
                              disabled={isSaving}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {isSaving ? "Saving..." : "Save"}
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setUsername(profile.username);
                                setIsEditingUsername(false);
                              }}
                              disabled={isSaving}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      ) : (
                        <>
                          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                            {profile.username}
                          </CardTitle>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setIsEditingUsername(true)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </>
                      )}
                    </div>
                    <CardDescription className="text-base">
                      {profile.user_email}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Profile Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Username
                    </p>
                    <p className="text-base font-semibold truncate">
                      {profile.username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Email
                    </p>
                    <p className="text-base font-semibold truncate">
                      {profile.user_email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
