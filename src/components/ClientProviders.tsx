"use client";

import AuthProvider from "@/components/AuthProvider";
import PrivySyncProvider from "@/components/PrivySyncProvider";
import UserProvider from "@/context/UserContext";
import { PrivyProvider } from "@privy-io/react-auth";
import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { flowMainnet, flowTestnet } from "viem/chains";
import { http } from "wagmi";

interface Props {
  children: React.ReactNode;
}

export const config = createConfig({
  chains: [flowMainnet, flowTestnet], // Pass your required chains as an array
  transports: {
    [flowMainnet.id]: http(),
    [flowTestnet.id]: http(),
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
          defaultChain: flowMainnet,
          supportedChains: [flowMainnet, flowTestnet],
        }}
      >
        <UserProvider>
          <PrivySyncProvider>
            <QueryClientProvider client={queryClient}>
              <WagmiProvider config={config}>{children}</WagmiProvider>
            </QueryClientProvider>
          </PrivySyncProvider>
        </UserProvider>
      </PrivyProvider>
    </AuthProvider>
  );
};

export default ClientProviders;
