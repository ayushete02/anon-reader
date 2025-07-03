"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useUser } from "@/context/UserContext";
import { User } from "@/lib/types";

interface Props {
  children: React.ReactNode;
}

/**
 * PrivySyncProvider bridges Privy's auth state with the existing UserContext.
 * When a user authenticates via Privy, we map the returned user data
 * into the User type used throughout the application and call UserContext.login.
 */
const PrivySyncProvider: React.FC<Props> = ({ children }) => {
  const { ready, authenticated, user: privyUser } = usePrivy();
  const { user, login } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated && privyUser && !user) {
      const mappedUser: User = {
        id: privyUser.id,
        email:
          // @ts-expect-error: Privy linkedAccounts types don't include email property but it exists at runtime
          privyUser.email?.address || privyUser.linkedAccounts[0].email || "",
        // @ts-expect-error: Privy linkedAccounts types don't include name property but it exists at runtime
        name: privyUser.linkedAccounts[0].name || "User",
        avatar: undefined,
        walletAddress: privyUser.wallet?.address || "",
        // Wallet address is Privy specific; store it in id for now or extend type as needed
        favorites: [],
        history: [],
        createdAt: new Date().toISOString(),
      } as unknown as User;

      login(mappedUser);

      // Redirect to /browse after successful login
      router.push("/browse");
    }
  }, [ready, authenticated, privyUser, user, login, router]);

  return <>{children}</>;
};

export default PrivySyncProvider;
