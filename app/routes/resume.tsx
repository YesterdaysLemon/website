import { Link } from "react-router";
import type { Route } from "./+types/resume";

export function meta({}: Route.MetaArgs) {
  return [{ title: "alireza afshan resume" }, { name: "alireza afshan resume", content: "alireza afshan resume" }];
}

export default function Resume() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>gimme a sec, lol</h1>
        <Link className="text-blue-500" to="/">go back</Link>
      </div>
    </div>
  );
}