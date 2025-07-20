import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "alireza afshan" },
    { name: "alireza afshan", content: "alireza afshan" },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="flex h-screen flex-col sm:items-center justify-center">
        <div className="bg-primary w-full sm:w-1/2 rounded-lg p-4">
          <div className="flex h-1/3 flex-col">
            <h1 className="text-5xl font-bold">Alireza Afshan</h1>
            <h2 className="text-2xl font-bold">
              Software / Dev Ops / Information Systems
            </h2>
          </div>

          <div className="h-1/3"></div>

          <div className="h-1/3 flex flex-col gap-2">
            <p>
              email{" "}
              <a
                className="text-blue-500"
                href="mailto:mail@alirezaafshan.com"
              >
                me
              </a>
            </p>
            <p>
              check out my projects{" "}
              <Link className="text-blue-500" to="/projects">
                here
              </Link>
            </p>
            <p>
              or on{" "}
              <a className="text-blue-500" href="https://github.com/YesterdaysLemon" target="_blank">
                GitHub
              </a>
            </p>
            <p>
              if you want my resume,{" "}
              <Link className="text-blue-500" to="/resume">
                click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
