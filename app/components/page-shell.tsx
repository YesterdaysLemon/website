import type { CSSProperties, ReactNode } from "react";
import { NavLink } from "react-router";

import {
  archiveNavItems,
  routeDesigns,
  type RouteDesignId,
} from "~/lib/route-design";
import {
  shouldShowUnderConstructionOverlay,
  UnderConstructionOverlay,
} from "./under-construction-overlay";

type PageShellProps = {
  routeId: RouteDesignId;
  title: string;
  eyebrow?: string;
  intro?: string;
  children: ReactNode;
};

export function PageShell({
  routeId,
  title,
  eyebrow,
  intro,
  children,
}: PageShellProps) {
  const route = routeDesigns[routeId];
  const footerContact = routeDesigns.contact;
  const showUnderConstructionOverlay =
    shouldShowUnderConstructionOverlay(route);

  return (
    <div
      className="bg-paper text-ink min-h-screen"
      style={{ "--route-accent": route.accent } as CSSProperties}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pt-5 pb-28 sm:px-8 sm:py-5 lg:px-10">
        <header className="border-line flex flex-col gap-9 border-b pb-9">
          <div className="bg-warm-card border-line z-40 flex flex-col gap-4 rounded-[var(--radius)] border px-4 py-4 shadow-[0_14px_38px_rgba(21,25,24,0.035)] sm:sticky sm:top-5 sm:flex-row sm:items-start sm:justify-between sm:px-5">
            <NavLink
              className="text-muted hover:text-ink focus-visible:ring-offset-paper text-sm font-extrabold tracking-[0.22em] uppercase transition focus-visible:ring-2 focus-visible:ring-[var(--route-accent)] focus-visible:ring-offset-2 focus-visible:outline-none"
              to="/"
              end
            >
              Alireza Afshan
            </NavLink>

            <nav
              aria-label="Main navigation"
              className="border-line bg-warm-card/95 fixed right-4 bottom-4 left-4 z-50 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-[var(--radius)] border px-4 py-3 text-sm font-semibold shadow-[0_18px_44px_rgba(21,25,24,0.14)] backdrop-blur sm:static sm:z-auto sm:justify-start sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none"
            >
              {archiveNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  aria-label={`${item.label} ${item.rank}${item.suit}`}
                  className={({ isActive }) =>
                    [
                      "archive-nav-link",
                      "flex-1 text-center text-[0.95rem] font-extrabold sm:flex-none sm:text-left sm:text-sm sm:font-semibold",
                      isActive ? "is-active" : "",
                    ].join(" ")
                  }
                  style={{ "--nav-accent": item.accent } as CSSProperties}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div
            className={[
              "grid gap-8 md:grid-cols-[minmax(0,1fr)_8rem] md:items-start",
              showUnderConstructionOverlay
                ? "under-construction-page-content"
                : "",
            ].join(" ")}
            aria-hidden={showUnderConstructionOverlay ? true : undefined}
          >
            <div className="max-w-3xl">
              {eyebrow ? (
                <p className="text-muted mb-3 text-xs font-extrabold tracking-[0.28em] uppercase">
                  {eyebrow} / {route.rank}
                  {route.suit}
                </p>
              ) : null}
              <h1 className="font-serif text-4xl leading-tight text-[var(--route-accent)] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              {intro ? (
                <p className="text-muted mt-4 max-w-2xl text-base leading-7 sm:text-lg">
                  {intro}
                </p>
              ) : null}
            </div>

            <div
              aria-hidden="true"
              className="border-line bg-card hidden aspect-[2.5/3.5] rounded-[var(--radius)] border p-4 text-[var(--route-accent)] shadow-[0_18px_42px_rgba(21,25,24,0.08)] md:flex md:flex-col md:justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-serif text-4xl leading-none">
                  {route.rank}
                </span>
                <span className="text-3xl leading-none">{route.suit}</span>
              </div>
              <div className="text-center text-xs font-extrabold tracking-[0.18em] uppercase">
                {route.label}
              </div>
              <div className="flex items-end justify-between gap-2">
                <span className="rotate-180 text-3xl leading-none">
                  {route.suit}
                </span>
                <span className="rotate-180 font-serif text-4xl leading-none">
                  {route.rank}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-10">
          <div
            className={
              showUnderConstructionOverlay
                ? "under-construction-page-content"
                : undefined
            }
            aria-hidden={showUnderConstructionOverlay ? true : undefined}
          >
            {children}
          </div>
        </main>

        {showUnderConstructionOverlay ? (
          <UnderConstructionOverlay route={route} />
        ) : null}

        <footer className="border-line text-muted flex flex-col gap-3 border-t py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>Alireza Afshan 2026</p>
          <a
            className="archive-inline-link w-fit"
            href={footerContact.to}
            style={{ "--route-accent": footerContact.accent } as CSSProperties}
          >
            mail@alirezaafshan.com
          </a>
        </footer>
      </div>
    </div>
  );
}
