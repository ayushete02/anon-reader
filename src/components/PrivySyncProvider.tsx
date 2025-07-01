"use client";

import React, { useEffect } from "react";
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

    useEffect(() => {
        if (ready && authenticated && privyUser && !user) {
            const mappedUser: User = {
                id: privyUser.id,
                email: privyUser.email?.address || privyUser.linkedAccounts[0].email || "",
                name: privyUser.linkedAccounts[0].name || "User",
                avatar: undefined,
                walletAddress: privyUser.wallet?.address || "",
                // Wallet address is Privy specific; store it in id for now or extend type as needed
                favorites: [],
                history: [],
                createdAt: new Date().toISOString(),
            } as unknown as User;

            login(mappedUser);
        }
    }, [ready, authenticated, privyUser, user, login]);

    return <>{children}</>;
};

export default PrivySyncProvider; 
