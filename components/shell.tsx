"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ROLE_LABELS, ROLES, type Role } from "@/lib/domain/constants";
import { useFieldRelay } from "@/components/provider";

const LINKS = [
  { href: "/", label: "Dashboard", id: "nav-dashboard" },
  { href: "/reports", label: "Reports", id: "nav-reports" },
  { href: "/reports/new", label: "New report", id: "nav-new" },
  { href: "/sync", label: "Sync", id: "nav-sync" },
  { href: "/board", label: "Workbench", id: "nav-board" },
  { href: "/analytics", label: "Analytics", id: "nav-analytics" },
  { href: "/settings", label: "Settings", id: "nav-settings" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const app = useFieldRelay();
  const [open, setOpen] = useState(false);
  const pending = app.outbox.filter((op) => op.status === "PENDING" || op.status === "FAILED" || op.status === "CONFLICT").length;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[248px_1fr]">
      <aside className={`${open ? "block" : "hidden"} border-b border-white/10 bg-teal-deep text-paper md:block md:min-h-screen md:border-b-0 md:border-r md:border-r-amber/40`}>
        <div className="flex items-start justify-between px-5 py-6">
          <Link href="/" className="block" onClick={() => setOpen(false)}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber text-sm font-bold text-white">FR</span>
            <p className="mt-3 text-xl font-semibold tracking-tight">FieldRelay</p>
            <p className="mt-2 max-w-[13rem] text-sm text-sky/90">Field reports that get through.</p>
          </Link>
        </div>
        <nav className="flex flex-col gap-0.5 px-3 pb-6" aria-label="Primary">
          {LINKS.map((link) => {
            const active = path === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                data-testid={link.id}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium ${active ? "bg-white/15 text-white" : "text-sky hover:bg-white/10 hover:text-white"}`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
                {link.href === "/sync" && pending > 0 ? <span className="ml-2 rounded-md bg-amber px-2 py-0.5 text-xs text-white">{pending}</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-8">
            <button type="button" className="rounded-md border border-line bg-card px-3 py-2 text-sm md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
              Menu
            </button>
            <p className="text-base font-semibold md:hidden">FieldRelay</p>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="role-switcher">
                Role
              </label>
              <select
                id="role-switcher"
                data-testid="role-switcher"
                className="rounded-md border border-line bg-card px-2 py-2 text-sm"
                value={app.role}
                onChange={(event) => app.setRole(event.target.value as Role)}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
              <span
                data-testid="connection-status"
                className="rounded-md border border-line bg-card px-3 py-2 text-sm font-medium"
                role="status"
              >
                {app.simulatedOffline ? "Simulated offline" : app.online ? "Online" : "Offline"}
              </span>
              {app.simulatedOffline ? (
                <button
                  type="button"
                  className="rounded-md border border-line bg-card px-3 py-2 text-sm font-medium"
                  onClick={() => app.setSimulatedOffline(false)}
                >
                  Use network
                </button>
              ) : null}
            </div>
          </div>
          {!app.online || app.simulatedOffline ? (
            <div className="border-t border-amber/30 bg-teal-deep px-4 py-2 text-sm text-paper md:px-8" role="status">
              You&apos;re offline. FieldRelay keeps working.
              {app.simulatedOffline ? <span className="ml-2 rounded-md bg-white/15 px-2 py-0.5 text-xs">Simulated</span> : null}
            </div>
          ) : null}
          {app.notice ? (
            <div className={`px-4 py-2 text-sm md:px-8 ${app.notice.tone === "error" ? "bg-clay/10 text-clay" : "bg-ok/10 text-ok"}`} role="status">
              {app.notice.text}
              <button type="button" className="ml-3 underline" onClick={app.dismissNotice}>
                Dismiss
              </button>
            </div>
          ) : null}
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
