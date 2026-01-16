import type {Route} from "./+types/resume";
import {Link} from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "alireza afshan resume" },
    { name: "alireza afshan resume", content: "alireza afshan resume" },
  ];
}

export default function Resume() {
  return (
    <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between h-screen">
            
            <iframe src="./resume/Alireza_Afshanv4.pdf" 
            className="w-dvw h-[90vh]">
            </iframe>
            <Link to="/" className="mb-4 text-5xl font-bold hover:underline">
            &lt;-  go back
            </Link>
        </div>
    </div>
  );
}