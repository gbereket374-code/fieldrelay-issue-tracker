import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";

process.env.DATABASE_URL ??= "postgresql://fieldrelay:fieldrelay@127.0.0.1:5432/fieldrelay";
process.env.FIELDRELAY_DEMO_MODE ??= "true";
