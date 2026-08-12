import { useEffect, useRef } from "react";

import type { Route } from "./+types/about-blackjack-lab";

import { mountInterestBlackjack } from "~/lib/interest-blackjack.client";
import "~/styles/interest-blackjack.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Interest blackjack | Alireza Afshan" },
    {
      name: "description",
      content:
        "A single-deck game of blackjack played with fifty-two of Alireza Afshan's interests.",
    },
  ];
}

export default function AboutBlackjackLab() {
  const tableRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const table = tableRef.current;
    if (!table) {
      return;
    }

    return mountInterestBlackjack(table);
  }, []);

  return (
    <main
      ref={tableRef}
      id="blackjack-table"
      className="blackjack-route blackjack-table min-h-screen overflow-x-hidden bg-[#0b2c24] font-sans text-[#fffdf8]"
    />
  );
}
