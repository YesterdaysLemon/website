import type { Route } from "./+types/home";
import {Link} from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "alireza afshan" }, { name: "alireza afshan", content: "alireza afshan" }];
}

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="bg-primary w-1/2 rounded-lg p-4">
          
          <div className="flex flex-col h-1/3">
            <h1 className="text-4xl font-bold">Alireza Afshan</h1>
            <h2 className="text-2xl font-bold">
              Software / Dev Ops / Information Systems
            </h2>
          </div>

          <div className="h-1/3"></div>

          <div className="h-1/3">
            <p>
              email me at{" "}
              <a
                className="text-blue-500"
                href="mailto:alirezaafshan@gmail.com"
              >
                alirezaafshan@gmail.com
              </a>
            </p>
            <p>
              check out my projects{" "}
              <Link
                className="text-blue-500"
                to="/projects"
              >
                here
              </Link>
            </p>
            <p>
              or on{" "}
              <Link
                className="text-blue-500"
                to="/projects"
              >
                GitHub
              </Link>
            </p>
            <p>
              if you want my resume,{" "}
              <Link
                className="text-blue-500"
                to="/resume"
              >
                click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
