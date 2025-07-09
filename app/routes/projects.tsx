import type { Route } from "./+types/projects";
import {Link} from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "alireza afshan projects" }, { name: "alireza afshan projects", content: "alireza afshan projects" }];
}

export default function Projects() {
  return (
    <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>gimme a sec, lol</h1>
            <Link className="text-blue-500" to="/">go back</Link>
        </div>
    </div>
  );
}