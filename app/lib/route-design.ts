export type RouteDesignId =
  | "about"
  | "projects"
  | "showcase"
  | "resume"
  | "contact";
export type SuitName = "spade" | "heart" | "club" | "diamond";

export const archiveSuits = [
  { name: "club", symbol: "\u2663" },
  { name: "heart", symbol: "\u2665" },
  { name: "diamond", symbol: "\u2666" },
  { name: "spade", symbol: "\u2660" },
] as const satisfies readonly { name: SuitName; symbol: string }[];

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

export function getArchiveSuit(index: number, offset = 0) {
  return archiveSuits[(index + offset) % archiveSuits.length];
}

export function getArchiveMarker(index: number, offset = 0): string {
  const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7"];
  const suit = getArchiveSuit(index, offset);

  return `${ranks[index % ranks.length]}${suit.symbol}`;
}
