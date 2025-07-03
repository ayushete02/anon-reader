"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import PrivySyncProvider from "@/components/PrivySyncProvider";
import AuthProvider from "@/components/AuthProvider";
import UserProvider from "@/context/UserContext";
import { filecoinCalibration, flowMainnet } from "viem/chains";
import { createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Props {
    children: React.ReactNode;
}

export const config = createConfig({
    chains: [filecoinCalibration, flowMainnet], // Pass your required chains as an array
    transports: {
        [filecoinCalibration.id]: http(),
        [flowMainnet.id]: http(),
        // For each of your required chains, add an entry to `transports` with
        // a key of the chain's `id` and a value of `http()`
    },
});


const ClientProviders: React.FC<Props> = ({ children }) => {
    const queryClient = new QueryClient();

    return (
        <AuthProvider>
            <PrivyProvider
                appId="cmckmrdo700chjl0n51w75eue"
                config={{
                    embeddedWallets: { createOnLogin: "users-without-wallets" },
                    defaultChain: filecoinCalibration,
                    supportedChains: [filecoinCalibration, flowMainnet]
                }}
            >
                <UserProvider>
                    <PrivySyncProvider>
                        <QueryClientProvider client={queryClient}>
                            <WagmiProvider config={config}>{children}
                            </WagmiProvider>
                        </QueryClientProvider>
                    </PrivySyncProvider>
                </UserProvider>
            </PrivyProvider>
        </AuthProvider>
    );
};

export default ClientProviders; 
