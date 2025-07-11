import { db } from "@/db";
import { agents } from "@/db/schema";
import {
    baseProcedure,
    createTRPCRouter,
    protectedProcedure,
} from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({
    // TODO : change to protectedProcedure
    getMany: baseProcedure.query(async () => {
        const data = await db.select().from(agents);
        return data;
    }),

    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            // Because drizzle always returns an array of results
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();

            return createdAgent;
        }),
});
