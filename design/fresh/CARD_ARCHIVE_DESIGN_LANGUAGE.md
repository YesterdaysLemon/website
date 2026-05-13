# Card Archive Design Language

This document locks the chosen design direction for the website so it can be implemented later with consistent visual and interaction rules.

## Chosen Direction

Use the **Card Archive** design language for the non-home pages.

The home page remains the immersive card table with draggable playing cards. The rest of the site should feel like an organized archive of cards drawn from that table: warm paper backgrounds, playing-card white content surfaces, suit-based accents, restrained borders, and compact typography.

The chosen navbar direction is **Suit Underline**: plain text navigation with a thin underline in the destination page's suit color for active and hover states. Avoid pill buttons or chip-style nav.

Reference mockups:

- `card-archive-page-mockups.html`
- `card-archive-navbar-options.html`

## Route And Suit Mapping

Use the same conceptual mapping established on the home page.

| Page | Rank | Suit | Accent |
| --- | --- | --- | --- |
| Projects | P | Spade | Warm blue-black |
| Blog | B | Heart | Deep garnet red |
| Resume | R | Club | Dark green-black |
| About | A | Diamond | Burnt orange-red |
| Contact | C | Spade | Warm blue-black |

## Color Tokens

Use these as the baseline palette.

```css
:root {
  --paper: #e7dfd0;
  --card: #fffdf8;
  --warm-card: #fdf9ef;
  --ink: #151918;
  --muted: #69645d;
  --line: rgba(21, 25, 24, 0.16);

  --spade: #172126;
  --heart: #8f2622;
  --club: #12342c;
  --diamond: #a64a26;

  --radius: 7px;
  --small-radius: 5px;
}
```

Guidance:

- Use `--paper` for page backgrounds.
- Use `--card` or `--warm-card` for content cards.
- Use `--ink` for primary body text.
- Use `--muted` for summaries, metadata, dates, and helper text.
- Use each page's suit color for page titles, eyebrow labels, suit marks, active nav underline, primary buttons, and important rank/suit markers.
- Do not use pure black or bright red; keep the colors warm and slightly aged.

## Typography

Keep the current pairing:

- Display and section titles: `Newsreader`, fallback `Georgia`, serif.
- Body, nav, metadata, controls: `Manrope`, fallback system sans.

Rules:

- Page titles should be large serif text colored by the active suit.
- Eyebrows should be uppercase, small, bold, and letter-spaced.
- Body text should stay readable and restrained, mostly `--ink` and `--muted`.
- Avoid decorative or casino-style typefaces.

## Navbar

Use the **Suit Underline** navbar.

Behavior:

- Nav links are plain text, not pills or buttons.
- Active link color becomes that route's suit color.
- Active link gets a thin underline in the same suit color.
- Hovered links may show the same underline in their own route color.
- Keep the brand text compact and uppercase.

Suggested structure:

```tsx
const navItems = [
  { to: "/about", label: "About", rank: "A", suit: "diamond", accent: "var(--diamond)" },
  { to: "/projects", label: "Projects", rank: "P", suit: "spade", accent: "var(--spade)" },
  { to: "/blog", label: "Blog", rank: "B", suit: "heart", accent: "var(--heart)" },
  { to: "/resume", label: "Resume", rank: "R", suit: "club", accent: "var(--club)" },
  { to: "mailto:mail@alirezaafshan.com", label: "Contact", rank: "C", suit: "spade", accent: "var(--spade)" },
];
```

Visual rule:

```css
.nav-link {
  position: relative;
  color: var(--muted);
  text-decoration: none;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.45rem;
  height: 2px;
  background: var(--route-accent);
  opacity: 0;
  transform: scaleX(0.45);
  transition: opacity 160ms ease, transform 160ms ease;
}

.nav-link:hover::after,
.nav-link[aria-current="page"]::after {
  opacity: 1;
  transform: scaleX(1);
}

.nav-link[aria-current="page"] {
  color: var(--route-accent);
}
```

## Page Shell

Non-home pages should use a warm archive-like shell.

Recommended layout:

- Background: `--paper`.
- Top nav: translucent warm card/paper surface with bottom border.
- Header: left-aligned page title and intro, with a small suit card on the right for larger screens.
- Main content: cards or panels using `--warm-card` or `--card`.
- Page accent: set per route using a CSS custom property such as `--route-accent`.

Header elements:

- Eyebrow: route context, e.g. `Selected work / P♠`.
- Title: route title, e.g. `Projects`.
- Intro: one concise sentence.
- Suit mark: small playing-card block showing the rank and suit.

## Cards And Panels

Use slight rounding, not sharp and not pill-like.

- Large cards/panels/screens: `7px` radius.
- Tags, small buttons, nav details: `5px` radius.
- Borders: `1px solid var(--line)`.
- Shadows should be soft and sparse.

Cards should feel like archive cards, not dashboard widgets:

- Warm white surface.
- Small rank/suit marker in the top-right corner.
- Serif card title.
- Muted summary copy.
- Tags or metadata kept compact.

Avoid:

- Excessive rounded corners.
- Heavy gradients.
- Decorative blobs.
- Button-heavy nav.
- Loud casino styling.

## Buttons And Links

Primary actions may use the active route accent as a filled background.

Examples:

- Blog: deep garnet button.
- Projects and Contact: warm blue-black button.
- Resume: green-black button.
- About: burnt orange-red button.

Secondary actions should be quiet:

- Paper/card background.
- Border in `--line` or the page accent at low opacity.
- Text in `--ink` or `--muted`.

Inline links can use the active route accent with underline offset.

## Page-Specific Notes

### Projects: P Spade

Accent: `--spade`.

Tone: practical, structured, case-study archive.

Use project cards with:

- Project title.
- Year/status metadata.
- Summary.
- Tags.
- Rank/suit marker such as `A♠`, `7♠`.

### Blog: B Heart

Accent: `--heart`.

Tone: warmer and more personal, but still restrained.

Use post cards with:

- Date.
- Post title.
- Summary.
- Tags.
- Primary `Read post` link/button in garnet.

### Resume: R Club

Accent: `--club`.

Tone: professional, grounded, structured.

Use sections for:

- Experience.
- Education.
- Skills.
- Download PDF action.

Club green-black should differentiate Resume from spade pages while remaining dark and serious.

### About: A Diamond

Accent: `--diamond`.

Tone: warm profile page.

Use:

- Short profile text.
- Current focus card.
- Quote or short statement block with a diamond accent rule.
- Contact and work links.

Diamond color should be burnt orange-red, distinct from Blog's heart red.

### Contact: C Spade

Accent: `--spade`.

Tone: direct, utility-focused.

Use:

- Primary email action.
- GitHub/resume links.
- Minimal context.

## Implementation Notes For Later

1. Refactor the existing `PageShell` so it accepts route design metadata:
   - `rank`
   - `suit`
   - `accent`
   - `eyebrow`
   - `title`
   - `intro`

2. Centralize route metadata in one object or array so the home cards, navbar, and page shells share the same mapping.

3. Replace the current pill navbar with Suit Underline links.

4. Update project/blog/resume/about/contact content cards to use the Card Archive card style.

5. Preserve accessibility:
   - Use real anchors/NavLinks.
   - Keep visible focus states.
   - Ensure active nav has `aria-current="page"`.
   - Do not rely on color alone; active state should also have underline.

6. Keep the home page visually distinct as the full table interaction. The archive language is for the rest of the site.

