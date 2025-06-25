import type { Route } from "./+types/contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact" },
  ];
}

export default function Contact() {
  return "contact";
}
