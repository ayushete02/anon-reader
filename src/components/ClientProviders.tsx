"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import PrivySyncProvider from "@/components/PrivySyncProvider";
import AuthProvider from "@/components/AuthProvider";
import UserProvider from "@/context/UserContext";
import { filecoinCalibration } from "viem/chains";

interface Props {
    children: React.ReactNode;
}

const ClientProviders: React.FC<Props> = ({ children }) => {
    return (
        <AuthProvider>
            <PrivyProvider
                appId="cmckmrdo700chjl0n51w75eue"
                config={{
                    embeddedWallets: { createOnLogin: "users-without-wallets" },
                    defaultChain: filecoinCalibration,
                    supportedChains: [filecoinCalibration]
                }}
            >
                <UserProvider>
                    <PrivySyncProvider>{children}</PrivySyncProvider>
                </UserProvider>
            </PrivyProvider>
        </AuthProvider>
    );
};

export default ClientProviders; 
