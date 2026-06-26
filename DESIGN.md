---
name: Jedi
description: A high-density, flat-bordered developer-focused job application tracker.
colors:
  primary: "#171717"
  neutral-bg: "#fafafa"
  neutral-fg: "#171717"
  border: "#e5e5e5"
  accent-blue: "#2563eb"
  accent-yellow: "#d97706"
  accent-green: "#16a34a"
  accent-red: "#dc2626"
typography:
  display:
    fontFamily: "Geist Sans, system-ui, -apple-system, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Geist Sans, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#262626"
---

# Design System: Jedi

## 1. Overview

**Creative North Star: "The Console Terminal"**

Jedi is designed around the metaphor of a developer's terminal console: clean, ultra-sharp, high-contrast, and focused on pure information utility. There is no room for unnecessary card styling, decorative glow effects, or visual padding. The interface is optimized for speed, dense data layout, and keyboard-friendly navigation.

Key characteristics:
- Flat visual style using 1px borders rather than shadows or depth layering.
- Clear, distinct typographic scale using system-sans and monospace values for metadata.
- Sharp borders (4px/sm radius) and high contrast hover/focus states to enforce utility.

## 2. Colors

The palette is anchored in raw neutral grays (white to deep black) with highly focused, high-contrast semantic accents for status tracking.

### Primary
- **Console Primary** (#171717 / oklch(0.205 0 0)): Used for major text headers, primary buttons, and critical UI anchors. In dark mode, this flips to white (#ffffff).

### Neutral
- **Console Background** (#fafafa / oklch(1 0 0)): The clean canvas. In dark mode, flips to (#0a0a0a / oklch(0.145 0 0)).
- **Console Border** (#e5e5e5 / oklch(0.922 0 0)): 1px divider lines. In dark mode, oklch(1 0 0 / 10%).

### Accents (Semantic Statuses)
- **Applied Blue** (#2563eb): Represents candidate intent.
- **Interviewing Yellow** (#d97706): Highlights active engagement.
- **Offered Green** (#16a34a): Represents successful outcomes.
- **Rejected Red** (#dc2626): Indicates standard pipeline termination.

**The Contrast Rule.** Text color must maintain at least a 4.5:1 contrast ratio against the background. Muted colors must not cross into illegibility.

## 3. Typography

**Display Font:** Geist Sans (with system-ui, -apple-system fallbacks)
**Body Font:** Geist Sans
**Mono Font:** Geist Mono (with system-mono fallbacks)

### Hierarchy
- **Display** (800, 1.75rem, 1.2): Title headers only (e.g. logo, core section title).
- **Headline** (600, 1.25rem, 1.3): Page subsections or dialog headers.
- **Title** (600, 1rem, 1.4): Card/list titles, table headers.
- **Body** (400, 0.875rem, 1.5): Core readable prose and note contents. Limit to 75ch.
- **Label** (500, 0.75rem, uppercase, 0.05em spacing): Status badges, dates, metadata labels.

**The Monospace Metadata Rule.** Use monospace font settings for all timestamps, record counts, and secondary indicators to reinforce the console theme.

## 4. Elevation

Jedi is entirely flat and bordered. We reject elevation shadows and depth overlays to maintain an efficient, technical appearance.

**The Flat-By-Default Rule.** Surfaces do not use drop-shadows. Modals, dialogs, and cards are rendered with sharp, high-contrast 1px borders (#e5e5e5 / dark: 10% opacity white) and clean background colors to convey structure.

## 5. Components

### Buttons
- **Shape:** 4px radius (`rounded-sm`).
- **Primary:** Black background, white text, 8px 16px padding.
- **Hover / Focus:** Solid dark gray background on hover, distinct focus ring.

### Badges / Tags
- **Shape:** 4px radius (`rounded-sm`).
- **Style:** Colored text with a 10% opacity matching background tint.

### Cards / Containers
- **Corner Style:** 4px radius (`rounded-sm`).
- **Background:** White (`neutral-bg` / dark: dark gray).
- **Border:** 1px solid border. No shadow.

### Inputs / Fields
- **Style:** 1px border, 4px radius, monospace placeholder styling.
- **Focus:** 1px dark primary border with keyboard focus outline.

## 6. Do's and Don'ts

### Do:
- **Do** use 1px borders and sharp (4px) corners for card outlines and inputs.
- **Do** use monospace font styles for numbers, dates, and minor metadata elements.
- **Do** maintain a strict light/dark mode contrast exceeding 4.5:1.

### Don't:
- **Don't** use decorative drop-shadows or glow gradients.
- **Don't** use warm cream, sand, or beige background colors (monoculture SaaS style).
- **Don't** use side-stripe borders (e.g., thick left border on state changes or alerts).
- **Don't** use gradient text under any circumstances.
- **Don't** animate layouts or image hovers decoratively.
