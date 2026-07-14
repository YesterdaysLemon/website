export type RouteDesignId =
  | "about"
  | "projects"
  | "showcase"
  | "resume"
  | "contact";
export type SuitName = "spade" | "heart" | "club" | "diamond";

export type RouteDesign = {
  id: RouteDesignId;
  to: string;
  label: string;
  rank: string;
  suit: string;
  suitName: SuitName;
  accent: string;
  underConstruction?: boolean;
};

export const routeDesigns = {
  about: {
    id: "about",
    to: "/about",
    label: "About",
    rank: "A",
    suit: "\u2666",
    suitName: "diamond",
    accent: "var(--diamond)",
  },
  projects: {
    id: "projects",
    to: "/projects",
    label: "Projects",
    rank: "P",
    suit: "\u2660",
    suitName: "spade",
    accent: "var(--spade)",
  },
  showcase: {
    id: "showcase",
    to: "/showcase",
    label: "Showcase",
    rank: "S",
    suit: "\u2665",
    suitName: "heart",
    accent: "var(--heart)",
  },
  resume: {
    id: "resume",
    to: "/resume",
    label: "Resume",
    rank: "R",
    suit: "\u2663",
    suitName: "club",
    accent: "var(--club)",
  },
  contact: {
    id: "contact",
    to: "mailto:mail@alirezaafshan.com",
    label: "Contact",
    rank: "C",
    suit: "\u2660",
    suitName: "spade",
    accent: "var(--spade)",
  },
} satisfies Record<RouteDesignId, RouteDesign>;

export const archiveNavItems = [
  routeDesigns.about,
  routeDesigns.projects,
  routeDesigns.showcase,
  routeDesigns.resume,
];

export function getArchiveMarker(
  routeId: RouteDesignId,
  index: number,
): string {
  const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7"];
  const route = routeDesigns[routeId];

  return `${ranks[index % ranks.length]}${route.suit}`;
}
