import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import { RetroSpiralField } from "./components/retro-spiral-field";
import { routeDesigns, type RouteDesignId } from "./lib/route-design";
import "./app.css";

const glitchGlyphs = "!<>-_\\/[]{}--=+*^?#________";

const archiveRouteIdsByPath: Record<string, RouteDesignId> = {
  "/about": "about",
  "/projects": "projects",
  "/showcase": "showcase",
  "/resume": "resume",
};

const pageSurfaceByPath: Record<string, string> = {
  "/": "#102f28",
  "/about-blackjack-lab.html": "#0b2c24",
};

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function getPageSurface(pathname: string) {
  return pageSurfaceByPath[normalizePathname(pathname)] ?? "#e7dfd0";
}

function scrambleText(text: string, amount: number) {
  if (amount <= 0) {
    return text;
  }

  return [...text]
    .map((character) => {
      if (character === " " || character === "'") {
        return character;
      }

      if (Math.random() > amount) {
        return character;
      }

      return glitchGlyphs[Math.floor(Math.random() * glitchGlyphs.length)];
    })
    .join("");
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&family=Newsreader:opsz,wght@6..72,500;6..72,700&display=swap",
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const pageSurface = getPageSurface(pathname);

  return (
    <html lang="en" style={{ "--page-surface": pageSurface } as CSSProperties}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={pageSurface} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body className="text-ink min-h-screen antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const normalizedPathname = normalizePathname(pathname);
  const routeId = archiveRouteIdsByPath[normalizedPathname] ?? null;
  const routeAccent = routeId
    ? routeDesigns[routeId].accent
    : routeDesigns.projects.accent;

  return (
    <div
      className={routeId ? "site-root has-retro-field" : "site-root"}
      data-route={routeId ?? undefined}
      style={{ "--route-accent": routeAccent } as CSSProperties}
    >
      <RetroSpiralField />
      <div className="site-route-layer">
        <Outlet />
      </div>
    </div>
  );
}

function NotFoundPage() {
  const originalTitle = "you shouldn't be here";
  const originalReturn = "return";
  const scramble = 0.02;
  const speed = 200;
  const [title, setTitle] = useState(originalTitle);
  const [returnText, setReturnText] = useState(originalReturn);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTitle(scrambleText(originalTitle, scramble));
      setReturnText(scrambleText(originalReturn, scramble * 0.75));
    }, speed);

    return () => window.clearInterval(interval);
  }, []);

  const glitchStyle = {
    "--not-found-flicker": 0.4,
    "--not-found-glow": 1,
    "--not-found-shake": "2px",
    "--not-found-split": "1px",
  } as CSSProperties;

  return (
    <main className="not-found-void" style={glitchStyle}>
      <div className="not-found-message">
        <h1 className="not-found-glitch-text" data-text={originalTitle}>
          {title}
        </h1>
        <a
          className="not-found-glitch-text not-found-return"
          data-text={originalReturn}
          href="/"
        >
          {returnText}
        </a>
      </div>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundPage />;
    }

    message = error.status === 404 ? "404" : "Error";
    details = error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
