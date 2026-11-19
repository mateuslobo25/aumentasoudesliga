import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb, listPublishedNews, listPublishedSongs } from "./db";
import { mediaFiles, news, songs } from "./database/schema";
import { storagePut } from "./storage";

const mediaInput = z.object({ fileName: z.string().min(1).max(255), mimeType: z.string().min(1).max(128), dataBase64: z.string().min(16), sizeBytes: z.number().int().positive().max(80 * 1024 * 1024) });
const imageInput = mediaInput.refine(input => input.mimeType.startsWith("image/"), { message: "A capa deve ser uma imagem válida" }).refine(input => input.sizeBytes <= 10 * 1024 * 1024, { message: "A imagem não pode ultrapassar 10 MB" });
const songInput = z.object({ title: z.string().trim().min(1).max(255), artist: z.string().trim().min(1).max(255), category: z.string().trim().min(1).max(120), producer: z.string().trim().min(1).max(255), description: z.string().trim().min(1).max(10000), releaseType: z.enum(["single", "ep", "album"]).default("single"), durationSeconds: z.number().int().min(1).max(24 * 60 * 60), audio: mediaInput, cover: imageInput });
const newsInput = z.object({ title: z.string().trim().min(1).max(255), category: z.string().trim().min(1).max(120), excerpt: z.string().trim().min(1).max(10000), image: imageInput });

const adminOnly = adminProcedure;
async function saveMedia(input: z.infer<typeof mediaInput>, folder: string) { const db = await getDb(); if (!db) throw new Error("Base de dados indisponível"); const buffer = Buffer.from(input.dataBase64, "base64"); const key = `${folder}/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}`; const stored = await storagePut(key, buffer, input.mimeType); const inserted = await db.insert(mediaFiles).values({ storageKey: stored.key, url: stored.url, fileName: input.fileName, mimeType: input.mimeType, sizeBytes: input.sizeBytes }); const mediaId = Number(inserted[0].insertId); return { id: mediaId, url: stored.url }; }

export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query(opts => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }) }),
  editorial: router({
    publicCatalog: publicProcedure.query(async () => ({ songs: await listPublishedSongs(), news: await listPublishedNews() })),
    publishSong: adminOnly.input(songInput).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Base de dados indisponível"); const audio = await saveMedia(input.audio, "editorial/audio"); const cover = input.cover ? await saveMedia(input.cover, "editorial/covers") : null; const result = await db.insert(songs).values({ title: input.title, artist: input.artist, category: input.category, producer: input.producer, description: input.description, durationSeconds: input.durationSeconds, releaseType: input.releaseType, audioMediaId: audio.id, coverMediaId: cover?.id ?? null, status: "published" }); return { id: Number(result[0].insertId), audioUrl: audio.url }; }),
    publishNews: adminOnly.input(newsInput).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Base de dados indisponível"); const image = input.image ? await saveMedia(input.image, "editorial/news") : null; const result = await db.insert(news).values({ title: input.title, category: input.category, excerpt: input.excerpt, imageMediaId: image?.id ?? null, status: "published" }); return { id: Number(result[0].insertId) }; }),
    adminSongs: adminOnly.query(async () => { const db = await getDb(); if (!db) return []; return db.select().from(songs).orderBy(desc(songs.createdAt)); }),
    adminNews: adminOnly.query(async () => { const db = await getDb(); if (!db) return []; return db.select().from(news).orderBy(desc(news.createdAt)); }),
  }),
});
export type AppRouter = typeof appRouter;
