import { MemoryReportRepository } from "@/lib/server/memory-repository";
import { prisma } from "@/lib/server/prisma";
import { PrismaReportRepository } from "@/lib/server/prisma-repository";
import type { ReportRepository } from "@/lib/server/repository";

const globalForRepo = globalThis as { fieldRelayRepo?: ReportRepository; fieldRelayTestRepo?: ReportRepository };

export function getRepository(): ReportRepository {
  if (globalForRepo.fieldRelayTestRepo) return globalForRepo.fieldRelayTestRepo;
  if (!globalForRepo.fieldRelayRepo) globalForRepo.fieldRelayRepo = new PrismaReportRepository(prisma);
  return globalForRepo.fieldRelayRepo;
}

export function setRepositoryForTests(repo: ReportRepository | null): void {
  globalForRepo.fieldRelayTestRepo = repo ?? undefined;
}

export function createMemoryRepository(): MemoryReportRepository {
  return new MemoryReportRepository();
}
