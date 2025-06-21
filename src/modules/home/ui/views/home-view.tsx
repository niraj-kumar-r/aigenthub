"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const HomeView = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    if (!session) {
        return <div className="p-4">LOADING...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">
                Welcome, {session.user.name}!
            </h1>
            <p className="mt-2">You are logged in.</p>
            <Button
                className="mt-4"
                onClick={() =>
                    authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => router.push("/sign-in"),
                        },
                    })
                }
            >
                Sign Out
            </Button>
        </div>
    );
};
