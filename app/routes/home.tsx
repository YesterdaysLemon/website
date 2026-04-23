import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "alireza afshan" },
    {
      name: "description",
      content:
        "Software and systems engineer working across application development, delivery, and information systems.",
    },
  ];
}

export default function Home() {
  return (
    <div className="bg-paper text-ink min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="border-line bg-card/90 grid gap-12 border p-6 shadow-[0_30px_80px_rgba(23,33,38,0.06)] sm:rounded-[2rem] sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-14">
          <section className="space-y-8">
            <div className="space-y-4">
              <p className="text-muted text-xs font-semibold tracking-[0.3em] uppercase">
                Software / DevOps / Information Systems
              </p>
              <h1 className="max-w-3xl font-serif text-5xl leading-none sm:text-6xl lg:text-7xl">
                Alireza Afshan
              </h1>
              <p className="text-muted max-w-2xl text-base leading-8 sm:text-lg">
                Minimal by design. The focus is on the work: building software,
                understanding systems end-to-end, and shipping things that are
                useful.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="border-ink hover:bg-ink hover:text-paper rounded-full border px-4 py-2 text-sm font-semibold transition"
                to="/projects"
              >
                Projects
              </Link>
              <Link
                className="border-line text-muted hover:border-ink hover:text-ink rounded-full border px-4 py-2 text-sm font-semibold transition"
                to="/blog"
              >
                Blog
              </Link>
              <Link
                className="border-line text-muted hover:border-ink hover:text-ink rounded-full border px-4 py-2 text-sm font-semibold transition"
                to="/resume"
              >
                Resume
              </Link>
            </div>
          </section>

          <aside className="border-line flex flex-col justify-between gap-8 border-t pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <div className="space-y-3">
              <p className="text-muted text-xs font-semibold tracking-[0.3em] uppercase">
                Contact
              </p>
              <a
                className="text-accent decoration-accent/35 hover:decoration-accent block text-lg underline underline-offset-4 transition"
                href="mailto:mail@alirezaafshan.com"
              >
                mail@alirezaafshan.com
              </a>
              <a
                className="text-muted hover:text-ink block text-base transition"
                href="https://github.com/YesterdaysLemon"
                rel="noreferrer"
                target="_blank"
              >
                github.com/YesterdaysLemon
              </a>
            </div>

            <div className="text-muted space-y-3 text-sm leading-7">
              <p>
                Current areas of interest include mobile application work,
                delivery pipelines, cloud-backed systems, and the operational
                side of shipping software.
              </p>
              <p>Based in Doha, Qatar.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
