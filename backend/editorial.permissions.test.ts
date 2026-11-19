import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = (user: TrpcContext["user"]): TrpcContext => ({ user, req: {} as any, res: {} as any });

describe("editorial permissions", () => {
  it("allows public catalog queries without a session", async () => {
    const result = await appRouter.createCaller(context(null)).editorial.publicCatalog();
    expect(result).toHaveProperty("songs");
    expect(result).toHaveProperty("news");
  });

  it("rejects an incomplete song before persistence", async () => {
    const admin = { id: 1, openId: "admin", name: "Admin", email: "admin@example.com", loginMethod: "test", role: "admin" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
    await expect(appRouter.createCaller(context(admin)).editorial.publishSong({ title: "Teste", artist: "Artista", category: "Categoria", producer: "Produtor", description: "Descrição", durationSeconds: 0, audio: { fileName: "a.mp3", mimeType: "audio/mpeg", dataBase64: "AAAAAAAAAAAAAAAAAAAA", sizeBytes: 20 } } as any)).rejects.toThrow();
  });

  it("rejects publishing for a normal user", async () => {
    try {
      await appRouter.createCaller(context({ id: 1, openId: "u", name: "User", email: "u@example.com", loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() })).editorial.publishNews({ title: "Teste", category: "Cultura", excerpt: "Resumo" });
      throw new Error("A publicação deveria ser rejeitada");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
