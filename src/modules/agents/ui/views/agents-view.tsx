"use client";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({}));

    // NOTE: The data should be prefetched in the ssr component with same query options
    // This is because when switching to useQuery from useSuspenseQuery (when query options dont match)
    // the headers won't be passed, and we will loose the authentication context

    return (
        <div className="flex flex-col flex-1 pb-4 px-4 md:px-8 gap-y-4">
            <DataTable data={data.items} columns={columns} />
            {data.items.length === 0 && (
                <EmptyState
                    title="Create your first agent"
                    description="Create an agent to join your meetings and assist you. Each agent will follow your instructions and can be customized to suit your needs."
                />
            )}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Agents"
            description="This may take a few seconds"
        />
    );
};

export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Error loading Agents"
            description="Please try again later"
        />
    );
};
