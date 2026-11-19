import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, mediaFiles, news, songs, users } from "./database/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() { if (!_db && process.env.DATABASE_URL) { try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); } } return _db; }
export async function upsertUser(user: InsertUser): Promise<void> { if (!user.openId) throw new Error("User openId is required for upsert"); const db = await getDb(); if (!db) return; const values: InsertUser = { openId: user.openId, name: user.name, email: user.email, loginMethod: user.loginMethod, role: user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user"), lastSignedIn: user.lastSignedIn ?? new Date() }; await db.insert(users).values(values).onDuplicateKeyUpdate({ set: { name: values.name, email: values.email, loginMethod: values.loginMethod, role: values.role, lastSignedIn: values.lastSignedIn } }); }
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }
export async function listPublishedSongs() { const db = await getDb(); if (!db) return []; const rows = await db.select({ song: songs, audio: mediaFiles }).from(songs).innerJoin(mediaFiles, eq(songs.audioMediaId, mediaFiles.id)).where(eq(songs.status, "published")).orderBy(desc(songs.publishedAt)); return Promise.all(rows.map(async row => { if (!row.song.coverMediaId) return { ...row, cover: null }; const coverRows = await db.select({ url: mediaFiles.url }).from(mediaFiles).where(eq(mediaFiles.id, row.song.coverMediaId)).limit(1); return { ...row, cover: coverRows[0] ?? null }; })); }
export async function listPublishedNews() { const db = await getDb(); if (!db) return []; return db.select({ article: news, image: mediaFiles }).from(news).leftJoin(mediaFiles, eq(news.imageMediaId, mediaFiles.id)).where(eq(news.status, "published")).orderBy(desc(news.publishedAt)); }
