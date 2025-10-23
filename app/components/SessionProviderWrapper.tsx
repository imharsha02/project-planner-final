// This component must be a client component to use the NextAuth provider
"use client";

import { SessionProvider } from "next-auth/react";

/**
 * A wrapper component to provide NextAuth session context to client components.
 * @param {object} children - The child components to be wrapped.
 */
const SessionProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // SessionProvider automatically handles fetching the session data
  // from the NextAuth API routes.
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
