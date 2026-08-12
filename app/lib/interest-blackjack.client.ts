type SuitName = "club" | "heart" | "diamond" | "spade";
type HandState = "playing" | "stood" | "bust" | "done";
type Outcome = "win" | "loss" | "push";
type Phase = "idle" | "dealing" | "player" | "dealer" | "result";

interface SuitDefinition {
  symbol: string;
  color: string;
  category: string;
  interests: readonly (readonly [string, string])[];
}

interface Card {
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

interface HandResult {
  outcome: Outcome;
  label: string;
}

interface Hand {
  cards: Card[];
  state: HandState;
  doubled: boolean;
  fromSplit: boolean;
  splitAces: boolean;
  result: HandResult | null;
}

interface CollectionState {
  ids: string[];
  gold: number;
}

interface GameState {
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

interface TrophyChipState {
  flipped: boolean;
  loose: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  frame: number | null;
  flipTimer: number | null;
  z: number;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  moved: boolean;
}

type Award = { type: "interest"; card: Card } | { type: "gold"; key: string };

export function mountInterestBlackjack(table: HTMLElement) {
  const CUT_CARD = 13;
  const MAX_HANDS = 4;
  const STORAGE_KEY = "alireza-interest-blackjack-collection-v1";

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

  function makeDeck(): Card[] {
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

  const allCards = makeDeck();
  const cardById = new Map(allCards.map((card) => [card.id, card]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  table.classList.add("bj2-table");
  table.innerHTML = `
    <nav class="bj2-nav" aria-label="Blackjack navigation">
      <div>
        <a href="/about#curiosities">Browse the interests</a>
        <a href="/about">Back to About</a>
        <span class="bj2-nav-mark" aria-hidden="true">A♦</span>
      </div>
    </nav>

    <header class="bj2-title">
      <h1>Interest blackjack</h1>
      <p>1 deck · dealer hits soft 17 · double after split · split to 4</p>
    </header>

    <section class="bj2-felt" id="bj2-felt" aria-label="Blackjack table">
      <button class="bj2-deck" id="bj2-deck" type="button" aria-label="Deal a new hand">
        <span class="bj2-deck-back">
          <span class="bj2-deck-mark" aria-hidden="true"><span>♣♥</span></span>
        </span>
        <span class="bj2-deck-count" id="bj2-deck-count">52</span>
      </button>

      <section class="bj2-dealer-seat" aria-label="Dealer hand">
        <div class="bj2-dealer-character">
          <div class="bj2-dealer-chip" aria-hidden="true">
            <strong>D</strong>
          </div>
          <div
            class="bj2-dealer-speech bj2-dialogue-stack"
            id="bj2-dealer-speech"
            role="log"
            aria-live="polite"
            aria-label="Dealer dialogue"
          ></div>
        </div>
        <div class="bj2-dealer-score">
          <span class="bj2-score-label">House</span>
          <strong id="bj2-dealer-score">—</strong>
          <span id="bj2-dealer-soft"></span>
        </div>
        <div class="bj2-dealer-cards" id="bj2-dealer-cards"></div>
      </section>

      <p class="bj2-result-plaque" id="bj2-result-plaque"></p>

      <section class="bj2-player-seat" aria-label="Player hands">
        <div
          class="bj2-player-thought bj2-dialogue-stack"
          id="bj2-player-thought"
          role="log"
          aria-live="polite"
          aria-label="Your thoughts"
        ></div>
        <div class="bj2-frustration" id="bj2-frustration" aria-hidden="true"></div>
        <div class="bj2-player-hands" id="bj2-player-hands"></div>
        <div class="bj2-hand-dots" id="bj2-hand-dots" aria-hidden="true"></div>
      </section>

      <aside class="bj2-collection" aria-label="Interest trophy collection">
        <div class="bj2-collection-head">
          <span>Interest collection</span>
          <strong id="bj2-collection-count">0 / 52</strong>
        </div>
        <div class="bj2-trophy-field" id="bj2-trophy-field">
          <span class="bj2-collection-empty">Win a hand; keep an interest.</span>
        </div>
      </aside>

      <div class="bj2-controls" aria-label="Blackjack actions">
        <button class="bj2-action is-primary" id="bj2-deal" type="button">Deal</button>
        <button class="bj2-action" id="bj2-hit" type="button" disabled>Hit</button>
        <button class="bj2-action" id="bj2-stand" type="button" disabled>Stand</button>
        <button class="bj2-action" id="bj2-double" type="button" disabled>Double</button>
        <button class="bj2-action" id="bj2-split" type="button" disabled>Split</button>
      </div>
    </section>

    <p class="bj2-screen-reader-status" id="bj2-live" aria-live="polite"></p>
  `;

  function required<T extends Element>(selector: string): T {
    const element = table.querySelector<T>(selector);
    if (!element) {
      throw new Error(`Interest blackjack is missing ${selector}`);
    }
    return element;
  }

  const felt = required<HTMLElement>("#bj2-felt");
  const deckButton = required<HTMLButtonElement>("#bj2-deck");
  const deckCount = required<HTMLElement>("#bj2-deck-count");
  const dealerCards = required<HTMLElement>("#bj2-dealer-cards");
  const dealerScore = required<HTMLElement>("#bj2-dealer-score");
  const dealerSoft = required<HTMLElement>("#bj2-dealer-soft");
  const dealerChip = required<HTMLElement>(".bj2-dealer-chip");
  const dealerSpeech = required<HTMLElement>("#bj2-dealer-speech");
  const playerThought = required<HTMLElement>("#bj2-player-thought");
  const playerHands = required<HTMLElement>("#bj2-player-hands");
  const handDots = required<HTMLElement>("#bj2-hand-dots");
  const resultPlaque = required<HTMLElement>("#bj2-result-plaque");
  const frustration = required<HTMLElement>("#bj2-frustration");
  const trophyField = required<HTMLElement>("#bj2-trophy-field");
  const collectionCount = required<HTMLElement>("#bj2-collection-count");
  const liveStatus = required<HTMLElement>("#bj2-live");
  const dealButton = required<HTMLButtonElement>("#bj2-deal");
  const hitButton = required<HTMLButtonElement>("#bj2-hit");
  const standButton = required<HTMLButtonElement>("#bj2-stand");
  const doubleButton = required<HTMLButtonElement>("#bj2-double");
  const splitButton = required<HTMLButtonElement>("#bj2-split");
  const dialogueTimers = new Set<number>();
  const trophyChipStates = new Map<string, TrophyChipState>();
  let trophyChipZ = 120;
  let dialoguePointerFrame: number | null = null;

  function loadCollection(): CollectionState {
    try {
      const stored = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) || "{}",
      ) as Partial<CollectionState>;
      const ids = Array.isArray(stored.ids)
        ? stored.ids.filter(
            (id: string, index: number, values: string[]) =>
              cardById.has(id) && values.indexOf(id) === index,
          )
        : [];
      const gold =
        typeof stored.gold === "number" &&
        Number.isSafeInteger(stored.gold) &&
        stored.gold > 0
          ? stored.gold
          : 0;
      return { ids, gold };
    } catch {
      return { ids: [], gold: 0 };
    }
  }

  const game: GameState = {
    deck: [],
    dealer: [],
    hands: [],
    activeHandIndex: 0,
    phase: "idle",
    revealDealer: false,
    shufflePending: true,
    collection: loadCollection(),
    lastAwardKeys: new Set(),
  };

  function saveCollection(): void {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ids: game.collection.ids,
        gold: game.collection.gold,
      }),
    );
  }

  function shuffled<T>(cards: readonly T[]): T[] {
    const result = [...cards];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function pause(milliseconds: number): Promise<void> {
    return new Promise((resolve) =>
      window.setTimeout(resolve, reduceMotion.matches ? 0 : milliseconds),
    );
  }

  function pick<T>(options: readonly T[]): T {
    return options[Math.floor(Math.random() * options.length)];
  }

  function handValue(cards: readonly Card[]): { total: number; soft: boolean } {
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

  function isBlackjack(cards: readonly Card[]): boolean {
    return cards.length === 2 && handValue(cards).total === 21;
  }

  function createHand(
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

  function currentHand(): Hand | undefined {
    return game.hands[game.activeHandIndex] || null;
  }

  function announce(message: string): void {
    liveStatus.textContent = message;
  }

  function clearDialogue(): void {
    for (const timer of dialogueTimers) {
      window.clearTimeout(timer);
    }
    dialogueTimers.clear();
    dealerSpeech.replaceChildren();
    playerThought.replaceChildren();
    dealerSpeech.classList.remove("is-visible");
    playerThought.classList.remove("is-visible");
  }

  function scheduleDialogueFade(entry: HTMLElement): void {
    if (entry.dataset.fadeScheduled === "true") {
      return;
    }

    entry.dataset.fadeScheduled = "true";
    const fadeTimer = window.setTimeout(
      () => {
        dialogueTimers.delete(fadeTimer);
        entry.classList.add("is-fading");

        const removeTimer = window.setTimeout(
          () => {
            dialogueTimers.delete(removeTimer);
            const stack = entry.parentElement;
            entry.remove();
            if (stack && !stack.children.length) {
              stack.classList.remove("is-visible");
            }
            queueDialoguePointers();
          },
          reduceMotion.matches ? 0 : 1800,
        );
        dialogueTimers.add(removeTimer);
      },
      reduceMotion.matches ? 0 : 6200,
    );
    dialogueTimers.add(fadeTimer);
  }

  function appendDialogue(stack: HTMLElement, message: string): void {
    const existing = [
      ...stack.querySelectorAll<HTMLElement>(".bj2-dialogue-line"),
    ];
    existing.forEach((entry, index) => {
      entry.classList.remove("is-latest", "is-recent", "is-old");
      entry.classList.add(
        index === existing.length - 1 ? "is-recent" : "is-old",
      );
      scheduleDialogueFade(entry);
    });

    const entry = document.createElement("p");
    entry.className = "bj2-dialogue-line is-latest";
    entry.textContent = message;
    stack.append(entry);
    stack.classList.add("is-visible");

    while (stack.children.length > 3) {
      stack.firstElementChild?.remove();
    }
    queueDialoguePointers();
  }

  function hideDialogue(): void {
    clearDialogue();
    resultPlaque.classList.remove("is-visible");
  }

  function showDealer(
    message: string,
    options: { keepResult?: boolean } = {},
  ): void {
    appendDialogue(dealerSpeech, message);
    if (!options.keepResult) {
      resultPlaque.classList.remove("is-visible");
    }
    announce(`Dealer: ${message}`);
  }

  function showThought(message: string): void {
    appendDialogue(playerThought, message);
    resultPlaque.classList.remove("is-visible");
    announce(`You think: ${message}`);
  }

  function showResult(message: string): void {
    resultPlaque.textContent = message;
    resultPlaque.classList.add("is-visible");
    announce(message);
  }

  function pointDialogueAt(stack: HTMLElement, target: Element | null): void {
    const entry = stack.querySelector<HTMLElement>(
      ".bj2-dialogue-line.is-latest",
    );
    if (!entry || !target) {
      delete stack.dataset.pointer;
      return;
    }

    const bubble = entry.getBoundingClientRect();
    const source = target.getBoundingClientRect();
    const bubbleCenterX = bubble.left + bubble.width / 2;
    const bubbleCenterY = bubble.top + bubble.height / 2;
    const sourceCenterX = source.left + source.width / 2;
    const sourceCenterY = source.top + source.height / 2;
    const horizontalGap = Math.max(
      bubble.left - source.right,
      source.left - bubble.right,
      0,
    );
    const verticalGap = Math.max(
      bubble.top - source.bottom,
      source.top - bubble.bottom,
      0,
    );
    const horizontalWeight =
      horizontalGap || Math.abs(sourceCenterX - bubbleCenterX) / bubble.width;
    const verticalWeight =
      verticalGap || Math.abs(sourceCenterY - bubbleCenterY) / bubble.height;
    let direction;

    if (horizontalWeight >= verticalWeight) {
      direction = sourceCenterX < bubbleCenterX ? "left" : "right";
    } else {
      direction = sourceCenterY < bubbleCenterY ? "top" : "bottom";
    }

    stack.dataset.pointer = direction;
    entry.style.setProperty(
      "--pointer-x",
      `${Math.min(Math.max(sourceCenterX - bubble.left, 14), bubble.width - 14)}px`,
    );
    entry.style.setProperty(
      "--pointer-y",
      `${Math.min(Math.max(sourceCenterY - bubble.top, 14), bubble.height - 14)}px`,
    );
  }

  function updateDialoguePointers(): void {
    dialoguePointerFrame = null;
    positionPlayerThought();
    pointDialogueAt(dealerSpeech, dealerChip);
    pointDialogueAt(
      playerThought,
      playerThought.parentElement?.querySelector(".bj2-hand-cards") ?? null,
    );
  }

  function queueDialoguePointers(): void {
    if (dialoguePointerFrame !== null) {
      return;
    }
    dialoguePointerFrame = window.requestAnimationFrame(updateDialoguePointers);
  }

  function positionPlayerThought(): void {
    const hand =
      playerThought.parentElement?.closest<HTMLElement>(".bj2-player-hand");
    const cards = hand?.querySelector<HTMLElement>(".bj2-hand-cards");
    const cardCount = cards?.querySelectorAll(".bj2-card").length || 0;
    const crowdedMobile = window.innerWidth <= 700 && cardCount >= 4;

    playerThought.classList.toggle("is-crowded-hand", crowdedMobile);
    for (const property of [
      "left",
      "right",
      "top",
      "transform",
      "align-items",
    ]) {
      playerThought.style.removeProperty(property);
    }

    if (!hand || !cards || window.innerWidth <= 700 || game.hands.length > 2) {
      return;
    }

    const handRect = hand.getBoundingClientRect();
    const cardsRect = cards.getBoundingClientRect();
    const thoughtRect = playerThought.getBoundingClientRect();
    const gap = 24;
    const spaceRight = handRect.right - cardsRect.right;
    const spaceLeft = cardsRect.left - handRect.left;
    const placeRight =
      spaceRight >= thoughtRect.width + gap || spaceRight >= spaceLeft;
    const left = placeRight
      ? cardsRect.right - handRect.left + gap
      : cardsRect.left - handRect.left - thoughtRect.width - gap;
    const top = Math.min(
      Math.max(
        cardsRect.top -
          handRect.top +
          (cardsRect.height - thoughtRect.height) / 2,
        -12,
      ),
      Math.max(handRect.height - thoughtRect.height + 12, -12),
    );

    playerThought.style.left = `${left}px`;
    playerThought.style.right = "auto";
    playerThought.style.top = `${top}px`;
    playerThought.style.transform = "none";
    playerThought.style.alignItems = placeRight ? "flex-start" : "flex-end";
  }

  function thoughtForHand(hand: Hand, index: number): string {
    const { total, soft } = handValue(hand.cards);
    const prefix = game.hands.length > 1 ? `Hand ${index + 1}. ` : "";
    const softLabel = soft ? " Soft" : "";

    if (total === 21) {
      return `${prefix}${softLabel} twenty-one. Lovely.`.trim();
    }
    if (total === 20) {
      return `${prefix}Twenty. That's more like it.`;
    }
    if (total >= 17) {
      return `${prefix}I have${softLabel.toLowerCase()} ${total}. Hit or stand?`;
    }
    if (total >= 12) {
      return `${prefix}${total}. Of course it is. Hit or stand?`;
    }
    return `${prefix}I have${softLabel.toLowerCase()} ${total}. Hit or stand?`;
  }

  function cardMarkup(card: Card, faceDown: boolean, isNew: boolean): string {
    const label = faceDown
      ? "Hidden dealer card"
      : `${card.rank} of ${card.suitName}s: ${card.fullLabel}`;
    const classes = [
      "bj2-card",
      faceDown ? "is-face-down" : "",
      card.word.length > 10 ? "is-long" : "",
      isNew ? "is-new" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <article
        class="${classes}"
        data-card-id="${card.id}"
        tabindex="0"
        aria-label="${label}"
        style="--suit:${card.color};--card-rotate:${((hashString(card.id) % 31) - 15) / 10}deg"
      >
        <div class="bj2-card-corner"><span>${card.rank}</span><span>${card.suit}</span></div>
        <div class="bj2-card-interest">${card.word}</div>
        <div class="bj2-card-corner"><span>${card.rank}</span><span>${card.suit}</span></div>
        <div class="bj2-card-back" aria-hidden="true"><span>♣ ♥</span></div>
        <div class="bj2-card-tooltip">
          <strong>${card.fullLabel}</strong>
          ${card.category}
        </div>
      </article>
    `;
  }

  function hashString(value: string): number {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function attachCardHoverEffects(): void {
    for (const card of felt.querySelectorAll<HTMLElement>(
      ".bj2-card:not(.is-face-down)",
    )) {
      card.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") {
          return;
        }
        const rect = card.getBoundingClientRect();
        const x = Math.min(
          Math.max((event.clientX - rect.left) / rect.width, 0),
          1,
        );
        const y = Math.min(
          Math.max((event.clientY - rect.top) / rect.height, 0),
          1,
        );
        card.style.setProperty("--tilt-x", `${((0.5 - y) * 14).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${((x - 0.5) * 18).toFixed(2)}deg`);
        card.style.setProperty("--glow-x", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--glow-y", `${(y * 100).toFixed(1)}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--glow-x", "50%");
        card.style.setProperty("--glow-y", "50%");
      });
    }
  }

  function renderCards(newCardId: string | null = null): void {
    const visibleDealer =
      game.revealDealer || game.phase === "result"
        ? handValue(game.dealer)
        : handValue(game.dealer.slice(0, 1));

    dealerCards.innerHTML = game.dealer
      .map((card, index) =>
        cardMarkup(
          card,
          index === 1 && !game.revealDealer,
          card.id === newCardId,
        ),
      )
      .join("");
    dealerScore.textContent = game.dealer.length
      ? game.revealDealer
        ? String(visibleDealer.total)
        : `${visibleDealer.total} + ?`
      : "—";
    dealerSoft.textContent = visibleDealer.soft ? "soft hand" : "";

    playerHands.innerHTML = game.hands
      .map((hand, index) => {
        const value = handValue(hand.cards);
        const result = hand.result
          ? `<span class="bj2-hand-result">${hand.result.label}</span>`
          : "";
        return `
          <section
            class="bj2-player-hand${index === game.activeHandIndex && game.phase === "player" ? " is-active" : ""}${hand.state !== "playing" ? " is-finished" : ""}"
            data-hand-index="${index}"
            aria-label="Player hand ${index + 1}, ${value.total}"
          >
            <div class="bj2-hand-caption">
              <span>${game.hands.length > 1 ? `Hand ${index + 1}` : "You"}</span>
              <strong>${hand.cards.length ? value.total : "—"}</strong>
              ${value.soft ? "<span>soft</span>" : ""}
              ${hand.doubled ? "<span>double</span>" : ""}
              ${result}
            </div>
            <div class="bj2-hand-cards">
              ${hand.cards.map((card) => cardMarkup(card, false, card.id === newCardId)).join("")}
            </div>
          </section>
        `;
      })
      .join("");

    const activeHandElement = playerHands.children[game.activeHandIndex];
    if (activeHandElement) {
      const pointFromRight =
        game.hands.length > 1 &&
        game.activeHandIndex >= Math.ceil(game.hands.length / 2);
      playerThought.classList.toggle("is-pointing-right", pointFromRight);
      playerThought.classList.toggle("is-compact-split", game.hands.length > 2);
      activeHandElement.append(playerThought);
    }
    queueDialoguePointers();

    handDots.innerHTML = game.hands
      .map(
        (_, index) =>
          `<span class="${index === game.activeHandIndex ? "is-active" : ""}"></span>`,
      )
      .join("");
    handDots.classList.toggle("is-visible", game.hands.length > 1);

    attachCardHoverEffects();

    if (game.hands.length > 1 && game.phase === "player") {
      window.setTimeout(() => {
        playerHands
          .querySelector(`[data-hand-index="${game.activeHandIndex}"]`)
          ?.scrollIntoView({
            behavior: reduceMotion.matches ? "auto" : "smooth",
            inline: "center",
            block: "nearest",
          });
      }, 0);
    }
  }

  function renderControls(): void {
    const hand = currentHand();
    const playerTurn = game.phase === "player" && hand?.state === "playing";
    const canDeal = game.phase === "idle" || game.phase === "result";

    dealButton.disabled = !canDeal;
    dealButton.textContent = game.phase === "idle" ? "Deal" : "New hand";
    hitButton.disabled = !playerTurn;
    standButton.disabled = !playerTurn;
    doubleButton.disabled = !canDouble();
    splitButton.disabled = !canSplit();
    deckButton.disabled = !(canDeal || playerTurn);
    deckButton.setAttribute(
      "aria-label",
      playerTurn ? "Hit by drawing from the deck" : "Deal a new hand",
    );
  }

  function render(newCardId: string | null = null): void {
    deckCount.textContent = String(game.deck.length);
    table.classList.toggle("is-playing", game.phase !== "idle");
    renderCards(newCardId);
    renderControls();
  }

  function canDouble(): boolean {
    const hand = currentHand();
    return Boolean(
      game.phase === "player" &&
        hand?.state === "playing" &&
        hand.cards.length === 2 &&
        !hand.splitAces,
    );
  }

  function canSplit(): boolean {
    const hand = currentHand();
    return Boolean(
      game.phase === "player" &&
        hand?.state === "playing" &&
        hand.cards.length === 2 &&
        hand.cards[0].rank === hand.cards[1].rank &&
        game.hands.length < MAX_HANDS &&
        !(hand.splitAces && hand.cards[0].rank === "A"),
    );
  }

  function freshShuffle(): void {
    game.deck = shuffled(allCards);
    game.shufflePending = false;
    deckCount.textContent = "52";
  }

  async function dealToDealer(faceDown = false): Promise<Card> {
    const card = game.deck.pop();
    if (!card) {
      throw new Error("The single deck ran out during a hand.");
    }
    game.dealer.push(card);
    render(card.id);
    await pause(310);
    if (faceDown) {
      render();
    }
    return card;
  }

  async function dealToHand(index: number): Promise<Card> {
    const card = game.deck.pop();
    if (!card) {
      throw new Error("The single deck ran out during a hand.");
    }
    game.hands[index].cards.push(card);
    render(card.id);
    await pause(310);
    return card;
  }

  function clearRoundPresentation(): void {
    frustration.innerHTML = "";
    game.lastAwardKeys.clear();
    hideDialogue();
  }

  async function startRound(): Promise<void> {
    if (game.phase !== "idle" && game.phase !== "result") {
      return;
    }

    clearRoundPresentation();

    if (game.shufflePending || game.deck.length < CUT_CARD) {
      freshShuffle();
      showDealer(
        pick([
          "Fresh deck.",
          "A clean deck. How optimistic.",
          "Shall we begin again?",
        ]),
      );
    } else {
      showDealer(
        pick(["Another hand.", "The deck remembers.", "Very well. Again."]),
      );
    }

    game.phase = "dealing";
    game.dealer = [];
    game.hands = [createHand()];
    game.activeHandIndex = 0;
    game.revealDealer = false;
    render();

    await pause(180);
    await dealToHand(0);
    await dealToDealer();
    await dealToHand(0);
    await dealToDealer(true);

    const playerNatural = isBlackjack(game.hands[0].cards);
    const dealerMayHaveBlackjack =
      game.dealer[0].rank === "A" || game.dealer[0].value === 10;

    if (dealerMayHaveBlackjack) {
      showDealer("One moment. I need to check.");
      await pause(560);
      if (isBlackjack(game.dealer)) {
        await resolveDealerBlackjack(playerNatural);
        return;
      }
      showDealer("No blackjack. Your decision.");
      await pause(360);
    }

    if (playerNatural) {
      await resolvePlayerBlackjack();
      return;
    }

    beginPlayerTurn();
  }

  function beginPlayerTurn(): void {
    const hand = currentHand();
    if (!hand) {
      void playDealer();
      return;
    }

    const value = handValue(hand.cards);
    if (value.total === 21 || hand.splitAces) {
      hand.state = "stood";
      render();
      showThought(thoughtForHand(hand, game.activeHandIndex));
      window.setTimeout(
        () => void advanceHand(),
        reduceMotion.matches ? 0 : 520,
      );
      return;
    }

    game.phase = "player";
    render();
    showThought(thoughtForHand(hand, game.activeHandIndex));
  }

  async function hit(): Promise<void> {
    const hand = currentHand();
    if (game.phase !== "player" || !hand || hand.state !== "playing") {
      return;
    }

    game.phase = "dealing";
    render();
    await dealToHand(game.activeHandIndex);
    const value = handValue(hand.cards);

    if (value.total > 21) {
      hand.state = "bust";
      hand.result = { outcome: "loss", label: "bust" };
      showThought(`${value.total}. Oh, come on.`);
      spawnFrustration(4);
      await pause(560);
      await advanceHand();
      return;
    }

    if (value.total === 21) {
      hand.state = "stood";
      showThought(thoughtForHand(hand, game.activeHandIndex));
      await pause(480);
      await advanceHand();
      return;
    }

    game.phase = "player";
    render();
    showThought(thoughtForHand(hand, game.activeHandIndex));
  }

  async function stand(): Promise<void> {
    const hand = currentHand();
    if (game.phase !== "player" || !hand || hand.state !== "playing") {
      return;
    }
    hand.state = "stood";
    showThought(`${handValue(hand.cards).total}. I'm staying.`);
    render();
    await pause(360);
    await advanceHand();
  }

  async function doubleDown(): Promise<void> {
    const hand = currentHand();
    if (!canDouble() || !hand) {
      return;
    }

    hand.doubled = true;
    game.phase = "dealing";
    showThought("One card. Make it count.");
    render();
    await dealToHand(game.activeHandIndex);
    const value = handValue(hand.cards);
    hand.state = value.total > 21 ? "bust" : "stood";

    if (value.total > 21) {
      hand.result = { outcome: "loss", label: "bust" };
      showThought(`${value.total}. That was ambitious.`);
      spawnFrustration(5);
    } else {
      showThought(`${value.total}. That's the hand.`);
    }

    render();
    await pause(560);
    await advanceHand();
  }

  async function splitHand(): Promise<void> {
    const hand = currentHand();
    if (!canSplit() || !hand) {
      return;
    }

    game.phase = "dealing";
    const secondCard = hand.cards.pop();
    if (!secondCard) {
      return;
    }
    const splittingAces = hand.cards[0].rank === "A";
    hand.fromSplit = true;
    hand.splitAces = splittingAces;
    hand.state = "playing";
    hand.result = null;

    const secondHand = createHand([secondCard], {
      fromSplit: true,
      splitAces: splittingAces,
    });
    game.hands.splice(game.activeHandIndex + 1, 0, secondHand);
    showThought(
      splittingAces
        ? "Two aces. One card each."
        : "Fine. We'll make it two hands.",
    );
    render();

    await dealToHand(game.activeHandIndex);
    await dealToHand(game.activeHandIndex + 1);

    if (splittingAces) {
      hand.state = "stood";
      secondHand.state = "stood";
      render();
      await pause(520);
      await advanceHand();
      return;
    }

    beginPlayerTurn();
  }

  async function advanceHand(): Promise<void> {
    const nextIndex = game.hands.findIndex(
      (hand, index) => index > game.activeHandIndex && hand.state === "playing",
    );

    if (nextIndex >= 0) {
      game.activeHandIndex = nextIndex;
      beginPlayerTurn();
      return;
    }

    const earlierIndex = game.hands.findIndex(
      (hand, index) => index < game.activeHandIndex && hand.state === "playing",
    );
    if (earlierIndex >= 0) {
      game.activeHandIndex = earlierIndex;
      beginPlayerTurn();
      return;
    }

    await playDealer();
  }

  async function playDealer(): Promise<void> {
    game.phase = "dealer";
    game.revealDealer = true;
    render();
    showDealer(
      pick([
        "Let's settle this.",
        "Now we see what caution bought you.",
        "My turn.",
      ]),
    );
    await pause(620);

    let value = handValue(game.dealer);
    while (value.total < 17 || (value.total === 17 && value.soft)) {
      if (value.total === 17 && value.soft) {
        showDealer("Soft seventeen. House rules require another card.");
        await pause(420);
      }
      await dealToDealer();
      value = handValue(game.dealer);
    }

    await pause(340);
    resolveRound();
  }

  async function resolvePlayerBlackjack(): Promise<void> {
    game.phase = "result";
    game.revealDealer = true;
    const hand = game.hands[0];
    hand.state = "done";
    hand.result = { outcome: "win", label: "blackjack" };
    const awards = awardFromHand(hand.cards, 2);
    render();
    showResult(`Blackjack · ${awardSummary(awards)}`);
    window.setTimeout(
      () => showDealer("Blackjack. Nicely done.", { keepResult: true }),
      520,
    );
    finishRound();
  }

  async function resolveDealerBlackjack(playerNatural: boolean): Promise<void> {
    game.phase = "result";
    game.revealDealer = true;
    const hand = game.hands[0];
    hand.state = "done";
    hand.result = playerNatural
      ? { outcome: "push", label: "push" }
      : { outcome: "loss", label: "dealer blackjack" };
    render();

    if (playerNatural) {
      showResult("Two blackjacks · push");
      showDealer("A draw. Improbably tidy.", { keepResult: true });
    } else {
      showResult("Dealer blackjack");
      showDealer("Blackjack.", { keepResult: true });
      spawnFrustration(5);
    }
    finishRound();
  }

  function resolveRound(): void {
    const dealer = handValue(game.dealer);
    let wins = 0;
    let losses = 0;
    let pushes = 0;
    let busts = 0;
    const awards = [];

    for (const hand of game.hands) {
      const player = handValue(hand.cards);
      let outcome: Outcome;
      let label: string;

      if (hand.state === "bust" || player.total > 21) {
        outcome = "loss";
        label = "bust";
        losses += 1;
        busts += 1;
      } else if (dealer.total > 21) {
        outcome = "win";
        label = "win";
        wins += 1;
      } else if (player.total > dealer.total) {
        outcome = "win";
        label = "win";
        wins += 1;
      } else if (player.total < dealer.total) {
        outcome = "loss";
        label = "loss";
        losses += 1;
      } else {
        outcome = "push";
        label = "push";
        pushes += 1;
      }

      hand.state = "done";
      hand.result = { outcome, label };
      if (outcome === "win") {
        awards.push(...awardFromHand(hand.cards, hand.doubled ? 2 : 1));
      }
    }

    game.phase = "result";
    render();

    if (game.hands.length === 1) {
      const hand = game.hands[0];
      if (!hand?.result) {
        return;
      }
      const player = handValue(hand.cards).total;
      if (hand.result.outcome === "win") {
        showResult(
          dealer.total > 21
            ? `Dealer busts at ${dealer.total} · ${awardSummary(awards)}`
            : `${player} beats ${dealer.total} · ${awardSummary(awards)}`,
        );
        window.setTimeout(
          () => showDealer("Nicely handled.", { keepResult: true }),
          500,
        );
      } else if (hand.result.outcome === "push") {
        showResult(`${player}–${dealer.total} · push`);
        window.setTimeout(
          () => showDealer("A draw. We both survive.", { keepResult: true }),
          500,
        );
      } else {
        showResult(
          busts
            ? `Bust at ${player}`
            : `Dealer wins ${dealer.total} to ${player}`,
        );
        window.setTimeout(
          () => showDealer("The table remains open.", { keepResult: true }),
          520,
        );
      }
    } else {
      const parts = [
        wins ? `${wins} ${wins === 1 ? "win" : "wins"}` : "",
        pushes ? `${pushes} ${pushes === 1 ? "push" : "pushes"}` : "",
        losses ? `${losses} ${losses === 1 ? "loss" : "losses"}` : "",
      ].filter(Boolean);
      showResult(
        `${parts.join(" · ")}${awards.length ? ` · ${awardSummary(awards)}` : ""}`,
      );
      window.setTimeout(
        () =>
          showDealer(
            wins && losses
              ? "A complicated little round."
              : wins
                ? "A productive split."
                : "That could have gone better.",
            { keepResult: true },
          ),
        520,
      );
    }

    if (losses > 0) {
      const intensity = Math.min(7, 2 + losses + busts + (wins === 0 ? 1 : 0));
      spawnFrustration(intensity);
    }
    finishRound();
  }

  function finishRound(): void {
    if (game.deck.length < CUT_CARD) {
      game.shufflePending = true;
    }
    render();
  }

  function randomUndiscovered(excluded: Set<string> = new Set()): Card | null {
    const discovered = new Set(game.collection.ids);
    const options = allCards.filter(
      (card) => !discovered.has(card.id) && !excluded.has(card.id),
    );
    return options.length
      ? options[Math.floor(Math.random() * options.length)]
      : null;
  }

  function awardFromHand(cards: readonly Card[], amount: number): Award[] {
    const awards: Award[] = [];
    const used = new Set<string>();

    for (let index = 0; index < amount; index += 1) {
      const discovered = new Set(game.collection.ids);
      const fromHand = cards.find(
        (card) => !discovered.has(card.id) && !used.has(card.id),
      );
      const selected = fromHand || randomUndiscovered(used);

      if (selected) {
        game.collection.ids.push(selected.id);
        used.add(selected.id);
        awards.push({ type: "interest", card: selected });
        game.lastAwardKeys.add(selected.id);
      } else {
        const goldIndex = game.collection.gold;
        game.collection.gold += 1;
        const key = `gold-${goldIndex}`;
        awards.push({ type: "gold", key });
        game.lastAwardKeys.add(key);
      }
    }

    saveCollection();
    renderCollection();
    return awards;
  }

  function awardSummary(awards: readonly Award[]): string {
    if (!awards.length) {
      return "no new trophy";
    }
    const gold = awards.filter((award) => award.type === "gold").length;
    if (gold === awards.length) {
      return `${gold} gold ${gold === 1 ? "chip" : "chips"}`;
    }
    return `${awards.length} ${awards.length === 1 ? "interest" : "interests"} claimed`;
  }

  function chipPosition(key: string, index: number) {
    const hash = hashString(`${key}-${index}`);
    return {
      x: 8 + (hash % 84),
      y: 18 + ((hash >>> 8) % 58),
      rotate: -22 + ((hash >>> 16) % 45),
      z: 10 + (index % 34),
    };
  }

  function chipBackArt(label: string, symbol: string, key: string): string {
    const pathId = `bj2-chip-arc-${key.replace(/[^a-z0-9-]/gi, "-")}`;
    return `
      <svg class="bj2-chip-back-art" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="${pathId}" d="M 18 55 C 28 23, 72 23, 82 55"></path>
        </defs>
        <text class="bj2-chip-back-ring" transform="translate(-1.6 0)">
          <textPath href="#${pathId}" startOffset="50%" text-anchor="middle" textLength="54" lengthAdjust="spacingAndGlyphs">${label}</textPath>
        </text>
        <text class="bj2-chip-back-symbol" x="50" y="62" dx="1" text-anchor="middle">${symbol}</text>
      </svg>
    `;
  }

  function getTrophyChipState(key: string): TrophyChipState {
    if (!trophyChipStates.has(key)) {
      trophyChipStates.set(key, {
        flipped: false,
        loose: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        frame: null,
        flipTimer: null,
        z: trophyChipZ,
      });
      trophyChipZ += 1;
    }
    return trophyChipStates.get(key)!;
  }

  function stopTrophyChipMotion(state: TrophyChipState): void {
    if (state.frame !== null) {
      window.cancelAnimationFrame(state.frame);
      state.frame = null;
    }
    state.vx = 0;
    state.vy = 0;
  }

  function trophyChipBounds(chip: HTMLElement) {
    const maxX = Math.max(0, felt.clientWidth - chip.offsetWidth);
    const maxY = Math.max(0, felt.clientHeight - chip.offsetHeight);
    return {
      minX: 0,
      minY: Math.min(136, maxY),
      maxX,
      maxY,
    };
  }

  function setLooseChipPosition(
    chip: HTMLElement,
    state: TrophyChipState,
    x: number,
    y: number,
  ): void {
    const bounds = trophyChipBounds(chip);
    state.x = Math.min(Math.max(x, bounds.minX), bounds.maxX);
    state.y = Math.min(Math.max(y, bounds.minY), bounds.maxY);
    chip.style.left = `${state.x}px`;
    chip.style.top = `${state.y}px`;
    chip.style.zIndex = String(state.z);
  }

  function loosenTrophyChip(chip: HTMLElement, state: TrophyChipState): void {
    if (state.loose) {
      return;
    }
    const chipRect = chip.getBoundingClientRect();
    const feltRect = felt.getBoundingClientRect();
    state.loose = true;
    state.z = trophyChipZ;
    trophyChipZ += 1;
    felt.append(chip);
    chip.classList.add("is-loose");
    setLooseChipPosition(
      chip,
      state,
      chipRect.left - feltRect.left,
      chipRect.top - feltRect.top,
    );
  }

  function toggleTrophyChip(chip: HTMLElement, state: TrophyChipState): void {
    state.flipped = !state.flipped;
    chip.classList.toggle("is-flipped", state.flipped);
    chip.setAttribute("aria-pressed", String(state.flipped));
    chip.classList.remove("is-flipping-forward", "is-flipping-backward");
    if (state.flipTimer !== null) {
      window.clearTimeout(state.flipTimer);
      state.flipTimer = null;
    }
    if (reduceMotion.matches) {
      return;
    }
    void chip.offsetWidth;
    chip.classList.add(
      state.flipped ? "is-flipping-forward" : "is-flipping-backward",
    );
    state.flipTimer = window.setTimeout(() => {
      chip.classList.remove("is-flipping-forward", "is-flipping-backward");
      state.flipTimer = null;
    }, 680);
  }

  function throwTrophyChip(chip: HTMLElement, state: TrophyChipState): void {
    if (reduceMotion.matches) {
      return;
    }

    let previousTime = performance.now();
    const travel = (time: number) => {
      const elapsed = Math.min(time - previousTime, 32);
      previousTime = time;
      const bounds = trophyChipBounds(chip);
      let nextX = state.x + state.vx * elapsed;
      let nextY = state.y + state.vy * elapsed;

      if (nextX < bounds.minX || nextX > bounds.maxX) {
        nextX = Math.min(Math.max(nextX, bounds.minX), bounds.maxX);
        state.vx *= -0.58;
      }
      if (nextY < bounds.minY || nextY > bounds.maxY) {
        nextY = Math.min(Math.max(nextY, bounds.minY), bounds.maxY);
        state.vy *= -0.58;
      }

      setLooseChipPosition(chip, state, nextX, nextY);
      const friction = Math.pow(0.92, elapsed / 16.67);
      state.vx *= friction;
      state.vy *= friction;

      if (Math.hypot(state.vx, state.vy) > 0.018) {
        state.frame = window.requestAnimationFrame(travel);
      } else {
        state.frame = null;
      }
    };

    state.frame = window.requestAnimationFrame(travel);
  }

  function attachTrophyChipInteractions(): void {
    for (const chip of trophyField.querySelectorAll<HTMLElement>(
      ".bj2-trophy-chip",
    )) {
      const key = chip.dataset.chipKey;
      if (!key) {
        continue;
      }
      const state = getTrophyChipState(key);

      chip.classList.toggle("is-flipped", state.flipped);
      chip.setAttribute("aria-pressed", String(state.flipped));

      if (state.loose) {
        felt.append(chip);
        chip.classList.add("is-loose");
        setLooseChipPosition(chip, state, state.x, state.y);
      }

      let drag: DragState | null = null;
      const moveDrag = (event: PointerEvent) => {
        if (!drag || event.pointerId !== drag.pointerId) {
          return;
        }
        const distance = Math.hypot(
          event.clientX - drag.startX,
          event.clientY - drag.startY,
        );
        if (!drag.moved && distance > 5) {
          drag.moved = true;
          loosenTrophyChip(chip, state);
        }
        if (!drag.moved) {
          return;
        }

        event.preventDefault();
        const now = performance.now();
        const elapsed = Math.max(now - drag.lastTime, 1);
        const deltaX = event.clientX - drag.lastX;
        const deltaY = event.clientY - drag.lastY;
        state.vx = Math.min(
          Math.max(state.vx * 0.5 + (deltaX / elapsed) * 0.5, -2.4),
          2.4,
        );
        state.vy = Math.min(
          Math.max(state.vy * 0.5 + (deltaY / elapsed) * 0.5, -2.4),
          2.4,
        );
        setLooseChipPosition(chip, state, state.x + deltaX, state.y + deltaY);
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.lastTime = now;
      };

      const finishDrag = (event: PointerEvent) => {
        if (!drag || event.pointerId !== drag.pointerId) {
          return;
        }
        const moved = drag.moved;
        drag = null;
        window.removeEventListener("pointermove", moveDrag);
        window.removeEventListener("pointerup", finishDrag);
        window.removeEventListener("pointercancel", finishDrag);
        chip.classList.remove("is-dragging");
        try {
          if (chip.hasPointerCapture(event.pointerId)) {
            chip.releasePointerCapture(event.pointerId);
          }
        } catch {
          // Reparenting a loose chip can release capture before pointerup.
        }
        if (event.type === "pointercancel") {
          return;
        }
        if (moved) {
          throwTrophyChip(chip, state);
        } else {
          toggleTrophyChip(chip, state);
        }
      };

      chip.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) {
          return;
        }
        event.preventDefault();
        stopTrophyChipMotion(state);
        state.z = trophyChipZ;
        trophyChipZ += 1;
        chip.style.zIndex = String(state.z);
        try {
          chip.setPointerCapture(event.pointerId);
        } catch {
          // Window listeners still keep a drag alive without pointer capture.
        }
        chip.classList.add("is-dragging");
        drag = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          lastX: event.clientX,
          lastY: event.clientY,
          lastTime: performance.now(),
          moved: false,
        };
        window.addEventListener("pointermove", moveDrag, { passive: false });
        window.addEventListener("pointerup", finishDrag);
        window.addEventListener("pointercancel", finishDrag);
      });

      chip.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleTrophyChip(chip, state);
        }
      });
    }
  }

  function renderCollection(): void {
    for (const state of trophyChipStates.values()) {
      stopTrophyChipMotion(state);
    }
    for (const chip of felt.querySelectorAll<HTMLElement>(
      ".bj2-trophy-chip.is-loose",
    )) {
      chip.remove();
    }
    const chips = [];

    game.collection.ids.forEach((id, index) => {
      const card = cardById.get(id);
      if (!card) {
        return;
      }
      const position = chipPosition(id, index);
      const textClass =
        card.word.length > 12
          ? " is-very-long"
          : card.word.length > 8
            ? " is-long"
            : "";
      chips.push(`
        <span
          class="bj2-trophy-chip${textClass}${game.lastAwardKeys.has(id) ? " is-new" : ""}"
          tabindex="0"
          role="button"
          data-chip-key="${id}"
          title="${card.fullLabel} — ${card.category}"
          aria-label="${card.fullLabel} interest trophy. Press to flip or drag to throw."
          style="--chip-color:${card.color};--chip-x:${position.x}%;--chip-y:${position.y}%;--chip-rotate:${position.rotate}deg;--chip-z:${position.z}"
        >
          <span class="bj2-chip-inner">
            <span class="bj2-chip-face is-front">${card.word}</span>
            <span class="bj2-chip-face is-back" aria-hidden="true">${chipBackArt("TROPHY", card.suit, id)}</span>
          </span>
        </span>
      `);
    });

    for (let index = 0; index < game.collection.gold; index += 1) {
      const key = `gold-${index}`;
      const position = chipPosition(key, game.collection.ids.length + index);
      chips.push(`
        <span
          class="bj2-trophy-chip is-gold${game.lastAwardKeys.has(key) ? " is-new" : ""}"
          tabindex="0"
          role="button"
          data-chip-key="${key}"
          title="Mastery chip — the full collection is complete"
          aria-label="Gold mastery trophy. Press to flip or drag to throw."
          style="--chip-x:${position.x}%;--chip-y:${position.y}%;--chip-rotate:${position.rotate}deg;--chip-z:${position.z}"
        >
          <span class="bj2-chip-inner">
            <span class="bj2-chip-face is-front">Gold</span>
            <span class="bj2-chip-face is-back" aria-hidden="true">${chipBackArt("MASTERY", "★", key)}</span>
          </span>
        </span>
      `);
    }

    trophyField.innerHTML = chips.length
      ? chips.join("")
      : '<span class="bj2-collection-empty">Win a hand; keep an interest.</span>';
    collectionCount.textContent = `${game.collection.ids.length} / 52${game.collection.gold ? ` · ${game.collection.gold} gold` : ""}`;
    attachTrophyChipInteractions();
  }

  function spawnFrustration(intensity: number): void {
    frustration.innerHTML = "";
    const grawlixes = ["$&#@!", "%#!", "?!@#", "&$#!", "#%@!", "@!$%"];
    const symbolColors = [
      "#ff6b6b",
      "#ffad42",
      "#f4df4e",
      "#5ee28a",
      "#55c2ff",
      "#a989ff",
      "#ff79c6",
    ];

    for (let index = 0; index < intensity; index += 1) {
      const burst = document.createElement("span");
      const grawlix =
        grawlixes[(index + Math.floor(Math.random() * 3)) % grawlixes.length];
      burst.className = "bj2-frustration-burst";
      burst.setAttribute("aria-hidden", "true");
      burst.style.setProperty("--burst-x", `${14 + Math.random() * 72}%`);
      burst.style.setProperty("--burst-rise", `${-5.5 - Math.random() * 7}rem`);
      burst.style.setProperty(
        "--burst-rotate",
        `${-16 + Math.random() * 32}deg`,
      );
      burst.style.setProperty("--burst-delay", `${index * 75}ms`);
      burst.style.setProperty(
        "--burst-speed",
        `${1500 + Math.random() * 650}ms`,
      );

      for (const [symbolIndex, symbol] of [...grawlix].entries()) {
        const glyph = document.createElement("span");
        glyph.className = "bj2-frustration-symbol";
        glyph.textContent = symbol;
        glyph.style.setProperty(
          "--symbol-color",
          symbolColors[(index * 2 + symbolIndex) % symbolColors.length],
        );
        burst.append(glyph);
      }

      frustration.append(burst);
    }

    liveStatus.textContent += " Frustrated muttering.";
    window.setTimeout(
      () => {
        frustration.innerHTML = "";
      },
      reduceMotion.matches ? 20 : 2800,
    );
  }

  dealButton.addEventListener("click", () => void startRound());
  hitButton.addEventListener("click", () => void hit());
  standButton.addEventListener("click", () => void stand());
  doubleButton.addEventListener("click", () => void doubleDown());
  splitButton.addEventListener("click", () => void splitHand());
  deckButton.addEventListener("click", () => {
    if (game.phase === "player") {
      void hit();
    } else if (game.phase === "idle" || game.phase === "result") {
      void startRound();
    }
  });
  window.addEventListener("resize", queueDialoguePointers);

  renderCollection();
  render();
  void startRound();

  return () => {
    window.removeEventListener("resize", queueDialoguePointers);
    clearDialogue();
    if (dialoguePointerFrame !== null) {
      window.cancelAnimationFrame(dialoguePointerFrame);
    }
    for (const state of trophyChipStates.values()) {
      stopTrophyChipMotion(state);
      if (state.flipTimer !== null) {
        window.clearTimeout(state.flipTimer);
      }
    }
    table.replaceChildren();
    table.classList.remove("bj2-table", "is-playing");
  };
}
