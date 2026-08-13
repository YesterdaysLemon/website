export type SuitName = "club" | "heart" | "diamond" | "spade";
export type HandState = "playing" | "stood" | "bust" | "done";
export type Outcome = "win" | "loss" | "push";
export type Phase = "idle" | "dealing" | "player" | "dealer" | "result";

export interface SuitDefinition {
  symbol: string;
  color: string;
  category: string;
  interests: readonly (readonly [string, string])[];
}

export interface Card {
  id: string;
  suitName: SuitName;
  suit: string;
  color: string;
  category: string;
  word: string;
  fullLabel: string;
  rank: string;
  value: number;
}

export interface HandResult {
  outcome: Outcome;
  label: string;
}

export interface Hand {
  cards: Card[];
  state: HandState;
  doubled: boolean;
  fromSplit: boolean;
  splitAces: boolean;
  result: HandResult | null;
}

export interface CollectionState {
  ids: string[];
  gold: number;
}

export interface GameState {
  deck: Card[];
  dealer: Card[];
  hands: Hand[];
  activeHandIndex: number;
  phase: Phase;
  revealDealer: boolean;
  shufflePending: boolean;
  collection: CollectionState;
  lastAwardKeys: Set<string>;
}

type RandomSource = () => number;

export const MAX_HANDS = 4;
export const MIN_CARDS_FOR_ROUND = 26;

const suitData: Record<SuitName, SuitDefinition> = {
  club: {
    symbol: "♣",
    color: "var(--club)",
    category: "Mathematics, science & technology",
    interests: [
      ["Graphs", "Graph theory"],
      ["Combinatorics", "Combinatorics"],
      ["Astronomy", "Astronomy"],
      ["Computing", "Computing"],
      ["Simulations", "Simulations"],
      ["Logic", "Logic"],
      ["Algebra", "Algebra"],
      ["Physics", "Physics"],
      ["Probability", "Probability"],
      ["Hardware", "Hardware"],
      ["Emergence", "Emergence"],
      ["Complexity", "Complexity"],
      ["Dynamics", "Dynamics"],
    ],
  },
  heart: {
    symbol: "♥",
    color: "var(--heart)",
    category: "Biology, nature & living systems",
    interests: [
      ["Botany", "Botany"],
      ["Connectomes", "Connectomes"],
      ["Ethology", "Ethology"],
      ["Digital", "Digital life"],
      ["Birds", "Birds"],
      ["Cognition", "Cognition"],
      ["Swarms", "Swarms"],
      ["Insects", "Insects"],
      ["Evolution", "Evolution"],
      ["Ecology", "Ecology"],
      ["Microbes", "Microbes"],
      ["Ecosystems", "Ecosystems"],
      ["Bonsai", "Bonsai"],
    ],
  },
  diamond: {
    symbol: "♦",
    color: "var(--diamond)",
    category: "Games, art & creative making",
    interests: [
      ["Cards", "Blackjack"],
      ["Boardgames", "Board games"],
      ["Videogames", "Video games"],
      ["D&D", "Dungeons & Dragons"],
      ["Music", "Music"],
      ["Ukulele", "Ukulele"],
      ["Guitar", "Guitar"],
      ["Sculpture", "Sculpture"],
      ["Minecraft", "Minecraft"],
      ["WorldEdit", "WorldEdit"],
      ["Drawing", "Drawing"],
      ["Menswear", "Menswear"],
      ["Keyboards", "Custom keyboards"],
    ],
  },
  spade: {
    symbol: "♠",
    color: "var(--spade)",
    category: "Philosophy, society & difficult questions",
    interests: [
      ["Philosophy", "Philosophy"],
      ["Rationality", "Rationality"],
      ["Geopolitics", "Geopolitics"],
      ["Alignment", "AI alignment"],
      ["Safety", "AI safety"],
      ["Language", "Language"],
      ["Consciousness", "Consciousness"],
      ["Sociology", "Sociology"],
      ["Epistemology", "Epistemology"],
      ["Ontology", "Ontology"],
      ["Identity", "Identity"],
      ["Futurism", "Futurism"],
      ["Ideology", "Ideology"],
    ],
  },
};

const ranks: readonly { label: string; value: number }[] = [
  { label: "A", value: 11 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
  { label: "J", value: 10 },
  { label: "Q", value: 10 },
  { label: "K", value: 10 },
];

export function makeInterestDeck(): Card[] {
  const cards: Card[] = [];

  for (const [suitName, suit] of Object.entries(suitData) as [
    SuitName,
    SuitDefinition,
  ][]) {
    suit.interests.forEach(([word, fullLabel], index) => {
      const rank = ranks[index];
      cards.push({
        id: `${suitName}-${rank.label}`,
        suitName,
        suit: suit.symbol,
        color: suit.color,
        category: suit.category,
        word,
        fullLabel,
        rank: rank.label,
        value: rank.value,
      });
    });
  }

  return cards;
}

export function shuffleCards<T>(
  cards: readonly T[],
  random: RandomSource = Math.random,
): T[] {
  const result = [...cards];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function pickRandom<T>(
  options: readonly T[],
  random: RandomSource = Math.random,
): T {
  if (!options.length) {
    throw new Error("Cannot pick from an empty list.");
  }
  return options[Math.floor(random() * options.length)];
}

export function handValue(cards: readonly Card[]): {
  total: number;
  soft: boolean;
} {
  let total = cards.reduce((sum, card) => sum + card.value, 0);
  let highAces = cards.filter((card) => card.rank === "A").length;

  while (total > 21 && highAces > 0) {
    total -= 10;
    highAces -= 1;
  }

  return {
    total,
    soft: highAces > 0 && total <= 21,
  };
}

export function isBlackjack(cards: readonly Card[]): boolean {
  return cards.length === 2 && handValue(cards).total === 21;
}

export function createHand(
  cards: Card[] = [],
  options: Partial<Pick<Hand, "fromSplit" | "splitAces">> = {},
): Hand {
  return {
    cards,
    state: "playing",
    doubled: false,
    fromSplit: Boolean(options.fromSplit),
    splitAces: Boolean(options.splitAces),
    result: null,
  };
}

export function currentHand(game: GameState): Hand | undefined {
  return game.hands[game.activeHandIndex];
}

export function canDouble(game: GameState): boolean {
  const hand = currentHand(game);
  return Boolean(
    game.phase === "player" &&
      hand?.state === "playing" &&
      hand.cards.length === 2 &&
      !hand.splitAces,
  );
}

export function canSplit(
  game: GameState,
  maxHands: number = MAX_HANDS,
): boolean {
  const hand = currentHand(game);
  return Boolean(
    game.phase === "player" &&
      hand?.state === "playing" &&
      hand.cards.length === 2 &&
      hand.cards[0].rank === hand.cards[1].rank &&
      game.hands.length < maxHands &&
      !(hand.splitAces && hand.cards[0].rank === "A"),
  );
}

export function dealerShouldHit(cards: readonly Card[]): boolean {
  const value = handValue(cards);
  return value.total < 17 || (value.total === 17 && value.soft);
}

export function resolveHandAgainstDealer(
  hand: Hand,
  dealerCards: readonly Card[],
): HandResult {
  const player = handValue(hand.cards);
  const dealer = handValue(dealerCards);

  if (hand.state === "bust" || player.total > 21) {
    return { outcome: "loss", label: "bust" };
  }
  if (dealer.total > 21 || player.total > dealer.total) {
    return { outcome: "win", label: "win" };
  }
  if (player.total < dealer.total) {
    return { outcome: "loss", label: "loss" };
  }
  return { outcome: "push", label: "push" };
}

export function shouldShuffleBeforeRound(deckSize: number): boolean {
  return deckSize < MIN_CARDS_FOR_ROUND;
}
