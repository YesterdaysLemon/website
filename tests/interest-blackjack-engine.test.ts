import assert from "node:assert/strict";
import test from "node:test";

import {
  canDouble,
  canSplit,
  createHand,
  dealerShouldHit,
  handValue,
  isBlackjack,
  makeInterestDeck,
  resolveHandAgainstDealer,
  shouldShuffleBeforeRound,
  shuffleCards,
  type Card,
  type GameState,
} from "../app/lib/interest-blackjack-engine.ts";

const deck = makeInterestDeck();

function card(id: string): Card {
  const found = deck.find((candidate) => candidate.id === id);
  assert.ok(found, `missing fixture card ${id}`);
  return found;
}

function gameWith(cards: Card[], hands = 1): GameState {
  return {
    deck: [],
    dealer: [],
    hands: [
      createHand(cards),
      ...Array.from({ length: hands - 1 }, () => createHand()),
    ],
    activeHandIndex: 0,
    phase: "player",
    revealDealer: false,
    shufflePending: false,
    collection: { ids: [], gold: 0 },
    lastAwardKeys: new Set(),
  };
}

test("the interest deck is one complete, unique deck", () => {
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map(({ id }) => id)).size, 52);
  for (const suit of ["club", "heart", "diamond", "spade"]) {
    assert.equal(
      deck.filter((candidate) => candidate.suitName === suit).length,
      13,
    );
  }
});

test("shuffle accepts a deterministic random source and preserves its input", () => {
  const source = [1, 2, 3];
  assert.deepEqual(
    shuffleCards(source, () => 0),
    [2, 3, 1],
  );
  assert.deepEqual(source, [1, 2, 3]);
});

test("ace totals distinguish soft hands, hard hands, and naturals", () => {
  assert.deepEqual(handValue([card("club-A"), card("heart-6")]), {
    total: 17,
    soft: true,
  });
  assert.deepEqual(
    handValue([card("club-A"), card("heart-6"), card("spade-K")]),
    { total: 17, soft: false },
  );
  assert.equal(isBlackjack([card("club-A"), card("diamond-K")]), true);
  assert.equal(
    isBlackjack([card("club-A"), card("heart-5"), card("spade-5")]),
    false,
  );
});

test("double and split permissions stay inside the table rules", () => {
  assert.equal(canDouble(gameWith([card("club-8"), card("heart-8")])), true);
  assert.equal(canSplit(gameWith([card("club-8"), card("heart-8")])), true);
  assert.equal(canSplit(gameWith([card("club-10"), card("heart-K")])), false);
  assert.equal(canSplit(gameWith([card("club-8"), card("heart-8")], 4)), false);

  const splitAces = gameWith([card("club-A"), card("heart-A")]);
  splitAces.hands[0].splitAces = true;
  assert.equal(canDouble(splitAces), false);
  assert.equal(canSplit(splitAces), false);
});

test("dealer hits soft seventeen but stands on hard seventeen", () => {
  assert.equal(dealerShouldHit([card("club-A"), card("heart-6")]), true);
  assert.equal(dealerShouldHit([card("club-10"), card("heart-7")]), false);
  assert.equal(dealerShouldHit([card("club-10"), card("heart-6")]), true);
});

test("round resolution handles wins, losses, pushes, and busts", () => {
  const dealer = [card("club-10"), card("heart-8")];
  assert.deepEqual(
    resolveHandAgainstDealer(
      createHand([card("diamond-K"), card("spade-9")]),
      dealer,
    ),
    { outcome: "win", label: "win" },
  );
  assert.deepEqual(
    resolveHandAgainstDealer(
      createHand([card("diamond-10"), card("spade-8")]),
      dealer,
    ),
    { outcome: "push", label: "push" },
  );
  assert.deepEqual(
    resolveHandAgainstDealer(
      createHand([card("diamond-10"), card("spade-7")]),
      dealer,
    ),
    { outcome: "loss", label: "loss" },
  );

  const bust = createHand([card("diamond-K"), card("spade-9"), card("club-5")]);
  bust.state = "bust";
  assert.deepEqual(resolveHandAgainstDealer(bust, dealer), {
    outcome: "loss",
    label: "bust",
  });
});

test("a fresh shoe is prepared before a thin deck can start a complex round", () => {
  assert.equal(shouldShuffleBeforeRound(25), true);
  assert.equal(shouldShuffleBeforeRound(26), false);
});
