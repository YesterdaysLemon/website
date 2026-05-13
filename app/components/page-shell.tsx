import type { ReactNode } from "react";
import { NavLink } from "react-router";

type PageShellProps = {
  title: string;
  eyebrow?: string;
  intro?: string;
  children: ReactNode;
};

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/resume", label: "Resume" },
];

export function PageShell({ title, eyebrow, intro, children }: PageShellProps) {
  return (
    <div className="bg-paper text-ink min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="border-line flex flex-col gap-8 border-b pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <NavLink
              className="text-muted hover:text-ink text-sm font-semibold tracking-[0.22em] uppercase transition"
              to="/"
              end
            >
              Alireza Afshan
            </NavLink>

            <nav className="text-muted flex flex-wrap gap-3 text-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    [
                      "rounded-full border px-3 py-1 transition",
                      isActive
                        ? "border-ink text-ink"
                        : "border-line hover:border-ink hover:text-ink",
                    ].join(" ")
                  }
                  end={item.end}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-muted mb-3 text-xs font-semibold tracking-[0.28em] uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
              {title}
            </h1>
            {intro ? (
              <p className="text-muted mt-4 max-w-2xl text-base leading-7 sm:text-lg">
                {intro}
              </p>
            ) : null}
          </div>
        </header>

        <main className="flex-1 py-10">{children}</main>
      </div>
    </div>
  );
}
