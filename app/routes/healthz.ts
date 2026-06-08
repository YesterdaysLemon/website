import type { Route } from "./+types/healthz";

export function loader({}: Route.LoaderArgs) {
  return new Response("ok\n", {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
