"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

/**
 * Renders the main authentication page, allowing users to register or sign in.
 *
 * Displays a registration form for new users when no session is present, or a welcome message and sign-out option for authenticated users.
 */
export default function Home() {
    const { data: session } = authClient.useSession();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = () => {
        authClient.signUp.email(
            {
                name,
                email,
                password,
            },
            {
                onSuccess: () => {
                    window.alert("User created successfully!");
                },
                onError: () => {
                    window.alert("Something went wrong: ");
                },
            }
        );
    };

    if (session) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold">
                    Welcome, {session.user.name}!
                </h1>
                <p className="mt-2">You are logged in.</p>
                <Button className="mt-4" onClick={() => authClient.signOut()}>
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col gap-y-4">
            <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                placeholder="Email"
                value={email}
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={onSubmit}>Create User</Button>
        </div>
    );
}
