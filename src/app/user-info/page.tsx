"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const UserInfoPage = () => {
    const privy = usePrivy();
    console.log(privy);
    const { user, logout } = useUser();
    const { logout: privyLogout } = usePrivy();
    const router = useRouter();

    // Create a safe subset of privy data without circular references
    const privyData = {
        ready: privy.ready,
        authenticated: privy.authenticated,
        user: privy.user,
        // Add any other properties you need once you confirm they exist
        // in the actual Privy SDK response
    };

    const handleLogout = async () => {
        await privyLogout();
        logout();
        router.push("/");
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Button className="text-gray-800" onClick={handleLogout}>Logout</Button>
            <h1 className="text-2xl font-bold mb-4">Privy & App User Info</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Privy SDK</h2>
                <pre className="bg-white/10 p-4 rounded-lg overflow-x-auto text-gray-800">
                    {JSON.stringify(privyData, null, 2)}
                </pre>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">UserContext</h2>
                <pre className="bg-white/10 p-4 rounded-lg overflow-x-auto text-gray-800">
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default UserInfoPage; 
