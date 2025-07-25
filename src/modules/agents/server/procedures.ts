import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    MIN_PAGE_SIZE,
} from "@/constants";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { agentsInsertSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(DEFAULT_PAGE),
                pageSize: z
                    .number()
                    .min(MIN_PAGE_SIZE)
                    .max(MAX_PAGE_SIZE)
                    .default(DEFAULT_PAGE_SIZE),
                search: z.string().nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;

            // TODO : change this to use a real query for meeting count
            const data = await db
                .select({
                    ...getTableColumns(agents),
                    meetingCount: sql<number>`5`,
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.session.userId),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset(pageSize * (page - 1));

            const [total] = await db
                .select({ count: count() })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.session.userId),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize);

            return {
                items: data,
                totalCount: total.count,
                totalPages,
            };
        }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            // TODO : change this to use a real query for meeting count
            const [existingAgent] = await db
                .select({
                    ...getTableColumns(agents),
                    meetingCount: sql<number>`5`,
                })
                .from(agents)
                .where(eq(agents.id, input.id));
            return existingAgent;
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
