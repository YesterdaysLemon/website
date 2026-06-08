import type { CSSProperties } from "react";

import type { RouteDesign } from "~/lib/route-design";

const underConstructionAssets = [
  "verycoolskullwithhardhatandshovelslikeajollyroger.gif",
  "undrkunstuksonwithhammer.gif",
  "skullpoppingoutofholewithconstructiondebris.gif",
  "manusingjackhammerwithdifficulty.gif",
  "anthropromorphisedhammerhittinganthronail.gif",
] as const;

type UnderConstructionOverlayProps = {
  route: RouteDesign;
};

export function shouldShowUnderConstructionOverlay(route: RouteDesign) {
  return Boolean(route.underConstruction && import.meta.env.PROD);
}

export function UnderConstructionOverlay({
  route,
}: UnderConstructionOverlayProps) {
  return (
    <aside
      aria-label={`${route.label} is under construction`}
      className="under-construction-overlay"
      style={{ "--route-accent": route.accent } as CSSProperties}
    >
      <div className="under-construction-stage" aria-hidden="true">
        {underConstructionAssets.map((asset, index) => (
          <img
            alt=""
            className={`under-construction-sprite under-construction-sprite-${index + 1}`}
            key={asset}
            src={`/under-construction/${asset}`}
          />
        ))}
      </div>

      <div className="under-construction-copy">
        <p className="under-construction-kicker">
          {route.rank}
          {route.suit} / Under Construction
        </p>
        <h2>Still wiring this page together</h2>
        <p>
          The {route.label.toLowerCase()} archive is getting polished up. The
          rest of the site is open while this corner stays behind the caution
          tape.
        </p>
      </div>
    </aside>
  );
}
