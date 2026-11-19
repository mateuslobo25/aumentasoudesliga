import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const mediaFiles = mysqlTable("media_files", {
  id: int("id").autoincrement().primaryKey(),
  storageKey: varchar("storageKey", { length: 512 }).notNull().unique(),
  url: varchar("url", { length: 1024 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const songs = mysqlTable("songs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  producer: varchar("producer", { length: 255 }).notNull(),
  description: text("description").notNull(),
  durationSeconds: int("durationSeconds").notNull().default(0),
  releaseType: mysqlEnum("releaseType", ["single", "ep", "album"]).default("single").notNull(),
  audioMediaId: int("audioMediaId").notNull(),
  coverMediaId: int("coverMediaId"),
  status: mysqlEnum("status", ["draft", "published"]).default("published").notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  excerpt: text("excerpt").notNull(),
  imageMediaId: int("imageMediaId"),
  status: mysqlEnum("status", ["draft", "published"]).default("published").notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Song = typeof songs.$inferSelect;
export type News = typeof news.$inferSelect;
export type MediaFile = typeof mediaFiles.$inferSelect;
