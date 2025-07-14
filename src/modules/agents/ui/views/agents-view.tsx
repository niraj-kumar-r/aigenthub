"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div className="flex flex-col flex-1 pb-4 px-4 md:px-8 gap-y-4">
            {/* TODO: Remove the extra mock data for meeting count */}
            <DataTable
                data={data.map((e) => ({ ...e, meetingCount: 5 }))}
                columns={columns}
            />
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
