import { useState } from "react";
import type {
  ButtonHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";

import type { SuitName } from "~/lib/route-design";

const suitSymbols: Record<SuitName, string> = {
  club: "♣",
  diamond: "♦",
  heart: "♥",
  spade: "♠",
};

type PillFaceProps = {
  children: ReactNode;
  className?: string;
  suit: SuitName;
};

type TactilePillProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-pressed" | "children" | "type"
> &
  PillFaceProps & {
    onPressedChange?: (pressed: boolean) => void;
    pressed?: boolean;
  };

function pillClassName(suit: SuitName, className?: string) {
  return ["tactile-pill", `suit-${suit}`, className].filter(Boolean).join(" ");
}

function PillContents({
  children,
  suit,
}: Pick<PillFaceProps, "children" | "suit">) {
  return (
    <>
      <span aria-hidden="true" className="tactile-pill-suit">
        {suitSymbols[suit]}
      </span>
      <span className="tactile-pill-label">{children}</span>
    </>
  );
}

export function TactilePill({
  children,
  className,
  disabled,
  onClick,
  onPressedChange,
  pressed,
  suit,
  ...buttonProps
}: TactilePillProps) {
  const [internalPressed, setInternalPressed] = useState(false);
  const [pressCount, setPressCount] = useState(-1);
  const isControlled = pressed !== undefined;
  const isPressed = isControlled ? pressed : internalPressed;

  function handleClick(event: ReactMouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    const nextPressed = !isPressed;
    setPressCount((current) => current + 1);

    if (!isControlled) {
      setInternalPressed(nextPressed);
    }

    onPressedChange?.(nextPressed);
  }

  return (
    <button
      {...buttonProps}
      aria-pressed={isPressed}
      className={[
        pillClassName(suit, className),
        pressCount >= 0 ? "has-been-pressed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-press-phase={pressCount >= 0 ? pressCount % 2 : undefined}
      disabled={disabled}
      onClick={handleClick}
      type="button"
    >
      <PillContents suit={suit}>{children}</PillContents>
      {pressCount >= 0 ? (
        <span aria-hidden="true" className="tactile-pill-pop" key={pressCount}>
          {suitSymbols[suit]}
        </span>
      ) : null}
    </button>
  );
}
