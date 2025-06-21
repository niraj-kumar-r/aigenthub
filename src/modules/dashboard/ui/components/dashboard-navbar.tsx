"use client";

import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
    const { state, isMobile, toggleSidebar } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if the Command key (or Ctrl on Windows) and 'K' are pressed
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                setCommandOpen((open) => !open);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
            <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
                <Button
                    className="size-9"
                    variant="outline"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    {state === "collapsed" || isMobile ? (
                        <PanelLeftIcon className="size-4" />
                    ) : (
                        <PanelLeftCloseIcon className="size-4" />
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCommandOpen((open) => !open)}
                    className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
                >
                    <SearchIcon />
                    Search
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">&#8984;</span>K
                    </kbd>
                </Button>
            </nav>
        </>
    );
};
