# Design System Specification

## 1. Overview & Creative North Star: "The Ethereal Intelligence"
This design system is built to move beyond the rigid, boxy constraints of traditional SaaS platforms. Our Creative North Star is **"The Ethereal Intelligence"**—a visual metaphor for a sophisticated AI that exists within a liquid, high-dimensional space. 

We achieve this through **Tonal Editorialism**: a rejection of the "1px solid border" in favor of depth created by light, shadow, and glass. The layout should feel intentional and asymmetric, using wide-tracking typography and overlapping surfaces to break the standard grid. We do not place content into boxes; we float insights onto a sophisticated, multi-layered canvas.

---

## 2. Color & Surface Architecture
The color palette is rooted in a deep, nocturnal base (`#0d0e12`), allowing the primary violets and secondary cyans to feel like self-illuminated light sources.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 100% opaque 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions. 

*   **Surface Hierarchy:**
    *   **Level 0 (Base):** `background` (#0d0e12) - The infinite canvas.
    *   **Level 1 (Sections):** `surface-container-low` (#121318) - Used for the 256px sidebar and structural regions.
    *   **Level 2 (Nesting):** `surface-container` (#18191e) - Used for main content areas.
    *   **Level 3 (Interactive):** `surface-container-highest` (#24252b) - Used for hover states and active elements.

### The Glass & Gradient Rule
To evoke a premium, "custom-built" feel, use **Glassmorphism** for floating overlays (modals, dropdowns, tooltips).
*   **Glass Spec:** `bg: rgba(30, 31, 37, 0.7)`, `backdrop-blur: 20px`, `border: 1px solid rgba(250, 248, 254, 0.1)`.
*   **AI Signaling:** For components powered by machine learning, inject a `radial-gradient` (Primary to Tertiary) at the top-right or bottom-left corners of the container to signify "intelligence" is active.

---

## 3. Typography: Editorial Authority
The type system pairs the geometric weight of **Manrope** with the high-utility legibility of **Inter**.

*   **Display & Headlines (Manrope 700-800):** Use `display-lg` (3.5rem) with -2% letter spacing for hero moments. The heavy weight against the dark background provides an "Editorial" impact.
*   **Body & Titles (Inter 400-600):** Optimized for high-density data. Use `body-md` (0.875rem) for primary reading.
*   **Monospace (JetBrains Mono 400-500):** Reserved for raw data outputs, code snippets, and "system-think" logs.

**Signature Polish:** The Logo must always be rendered in `Manrope 800` using the Primary-to-Primary-Dim linear gradient (135deg).

---

## 4. Elevation & Depth: Tonal Layering
Traditional dropshadows are clumsy. This system uses **Ambient Depth**.

*   **The Layering Principle:** Depth is achieved by "stacking" the surface tiers. A `surface-container-highest` card sitting on a `surface-container-low` section creates a natural lift.
*   **Ambient Shadows:** If an element must float (e.g., a Modal), use a diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should feel like a soft glow rather than a dark stain.
*   **Ghost Border Fallback:** If accessibility requires a stroke, use the **Ghost Border**: `outline-variant` token at **10% opacity**. Never use a high-contrast line.

---

## 5. Component Logic

### Buttons & CTAs
*   **Primary CTA:** `linear-gradient(135deg, #ba9eff 0%, #8455ef 100%)`. No border. White text (`on-primary`). 
*   **Secondary:** `surface-container-highest` fill with a `primary` Ghost Border (10%).
*   **Tertiary:** Transparent background, `primary` text, 200ms opacity transition on hover.

### Input Fields
*   **Style:** No bottom line or full box. Use a subtle `surface-container-high` background with `rounded-md` (0.75rem) corners.
*   **Focus State:** Transition the Ghost Border from 10% to 40% opacity and apply a subtle `primary` outer glow (4px blur).

### Cards & Lists
*   **The "No-Divider" Rule:** Explicitly forbid horizontal divider lines. Use `spacing-8` (2rem) of vertical whitespace or a subtle shift from `surface-container` to `surface-container-low` to distinguish items.
*   **Interaction:** Cards should utilize the **300ms Entry Animation** (Translate-Y: 10px to 0px, Opacity: 0 to 1).

### The AI Insights Panel (Custom Component)
A custom component for this system. Uses a `surface-container` base with a `tertiary` radial glow in the corner. Text is rendered in `JetBrains Mono` to suggest a "direct-from-core" stream of information.

---

## 6. Motion & Interaction Patterns
Motion is not a decoration; it is a feedback mechanism.

*   **Hover States:** All interactive elements must have a **200ms** transition. Use a subtle "lift" (scale 1.02) and a shift to a higher surface color.
*   **The Unlock Sequence:** When a feature is activated or "decrypted," use a **500ms** transition that shifts the component from grayscale (saturation 0) to full color.
*   **Navigation:** The 256px sidebar uses `surface-container-low`. Active links should not use a box, but a vertical `primary` accent pill (4px wide) on the left edge.

---

## 7. Do's and Don'ts

### Do
*   **Do** use extreme contrast in typography sizing to create hierarchy.
*   **Do** lean into the "Glassmorphism" for any element that sits "above" the main content flow.
*   **Do** use tonal shifts (e.g., `#121318` vs `#18191e`) to define page regions.

### Don't
*   **Don't** use 1px #000 or #FFF solid borders. It breaks the "Ethereal" aesthetic.
*   **Don't** use standard "drop shadows" with high opacity. 
*   **Don't** use more than one gradient-filled CTA per view; it creates visual noise.
*   **Don't** use "pure white" for body text. Use `on-surface` (#faf8fe) for a softer, more premium reading experience.