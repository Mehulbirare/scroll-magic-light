# scroll-magic-lite

[![npm version](https://img.shields.io/npm/v/scroll-magic-lite?color=6c63ff&style=flat-square)](https://www.npmjs.com/package/scroll-magic-lite)
[![npm downloads](https://img.shields.io/npm/dm/scroll-magic-lite?color=6c63ff&style=flat-square)](https://www.npmjs.com/package/scroll-magic-lite)
[![bundle size](https://img.shields.io/bundlephobia/minzip/scroll-magic-lite?color=6c63ff&label=gzip&style=flat-square)](https://bundlephobia.com/package/scroll-magic-lite)
[![CI](https://img.shields.io/github/actions/workflow/status/Mehulbirare/scroll-magic-light/ci.yml?color=6c63ff&style=flat-square)](https://github.com/Mehulbirare/scroll-magic-light/actions)
[![license](https://img.shields.io/npm/l/scroll-magic-lite?color=6c63ff&style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-native-6c63ff?style=flat-square)](https://www.typescriptlang.org)

> Ultra-smooth scroll animations. IntersectionObserver based, zero scroll listeners, zero jank.
> Works with **React**, **Next.js**, or plain **HTML** via a single `data-sml` attribute.

**[Live Demo →](https://mehulbirare.github.io/scroll-magic-light)**

---

## Why not AOS / ScrollReveal?

| | scroll-magic-lite | AOS | ScrollReveal | GSAP ScrollTrigger |
|---|---|---|---|---|
| No scroll listeners | ✅ | ❌ | ❌ | ❌ |
| React hooks | ✅ | ❌ | ❌ | ❌ |
| Next.js / SSR safe | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Data-attribute API | ✅ | ✅ | ❌ | ❌ |
| CDN / script tag | ✅ | ✅ | ✅ | ✅ |
| TypeScript native | ✅ | ⚠️ | ⚠️ | ✅ |
| Bundle size (gzip) | **~3 KB** | ~14 KB | ~6 KB | ~67 KB |
| Free license | ✅ MIT | ✅ MIT | ✅ MIT | ❌ Paid |

AOS and ScrollReveal attach a `scroll` listener that fires on every scroll event (60+ times/sec), then call `getBoundingClientRect()` which forces a layout recalculation. `scroll-magic-lite` uses `IntersectionObserver` — the browser handles visibility natively with zero main-thread work. Animations only touch `transform` and `opacity`, which are composited on the GPU and never trigger layout or paint.

---

## Installation

```bash
npm install scroll-magic-lite
# or
yarn add scroll-magic-lite
# or
pnpm add scroll-magic-lite
```

---

## Usage

### Option 1: HTML / CDN (zero JS required)

Drop a script tag and add `data-sml` to any element. Auto-initializes on `DOMContentLoaded`.

```html
<script src="https://unpkg.com/scroll-magic-lite/dist/scroll-magic-lite.global.js"></script>

<h1 data-sml="fadeUp">Appears on scroll</h1>
<p  data-sml="fadeUp" data-sml-delay="150">With stagger</p>
<div data-sml="zoomIn" data-sml-duration="800">Zoom in</div>
```

All `data-sml-*` attributes:

| Attribute | Example | Description |
|---|---|---|
| `data-sml` | `"fadeUp"` | Animation preset |
| `data-sml-duration` | `"600"` | Duration in ms |
| `data-sml-delay` | `"150"` | Delay in ms |
| `data-sml-easing` | `"ease-out"` | CSS easing |
| `data-sml-threshold` | `"0.2"` | 0–1, fraction visible to trigger |
| `data-sml-distance` | `"60"` | px travel for slide/fade animations |
| `data-sml-once` | `"false"` | Re-animate on every scroll (default: `"true"`) |

---

### Option 2: React / Next.js

```tsx
// app/page.tsx or any Client Component
'use client'
import { useScrollReveal } from 'scroll-magic-lite/react'

export default function Hero() {
  const titleRef = useScrollReveal({ animation: 'fadeUp', duration: 700 })
  const subRef   = useScrollReveal({ animation: 'fadeUp', delay: 150 })
  const imgRef   = useScrollReveal({ animation: 'zoomIn', threshold: 0.2 })

  return (
    <section>
      <h1 ref={titleRef}>Ship it.</h1>
      <p  ref={subRef}>Scroll animations that don't suck.</p>
      <img ref={imgRef} src="/hero.png" />
    </section>
  )
}
```

#### Staggered lists

```tsx
import { useScrollRevealGroup } from 'scroll-magic-lite/react'

function FeatureGrid() {
  const refs = useScrollRevealGroup(6, { animation: 'fadeUp' }, 80)
  const items = ['Fast', 'Smooth', 'Tiny', 'Typed', 'SSR safe', 'Zero jank']

  return (
    <div className="grid">
      {items.map((item, i) => (
        <div key={item} ref={refs[i]}>{item}</div>
      ))}
    </div>
  )
}
```

#### Visibility state

```tsx
import { useScrollAnimation } from 'scroll-magic-lite/react'

function Card() {
  const { ref, isVisible } = useScrollAnimation({ animation: 'fadeUp', once: false })

  return <div ref={ref} className={isVisible ? 'active' : ''}>{...}</div>
}
```

#### `<ScrollReveal>` component

```tsx
import { ScrollReveal } from 'scroll-magic-lite/react'

export default function Page() {
  return (
    <ScrollReveal animation="fadeUp" delay={100}>
      <p>Animated section</p>
    </ScrollReveal>
  )
}
```

---

### Option 3: Vanilla JS

```js
import { ScrollMagicLite } from 'scroll-magic-lite'

const sml = new ScrollMagicLite()

// Single element or CSS selector
sml.reveal('.hero-title', { animation: 'fadeUp' })

// Multiple elements auto-stagger (80ms between each)
sml.reveal('.card', { animation: 'zoomIn', duration: 500 })

// Or use init() for data-attribute scanning
import { init } from 'scroll-magic-lite'
init()

// Cleanup
sml.destroy()
```

---

## Animations

| Name | Effect |
|---|---|
| `fadeIn` | opacity 0 → 1 |
| `fadeUp` | fade + slide up |
| `fadeDown` | fade + slide down |
| `fadeLeft` | fade + slide from right |
| `fadeRight` | fade + slide from left |
| `zoomIn` | fade + scale 85% → 100% |
| `zoomOut` | fade + scale 115% → 100% |
| `slideUp` | slide up (no fade) |
| `slideDown` | slide down (no fade) |
| `flipX` | 3D rotate on X axis |
| `flipY` | 3D rotate on Y axis |

---

## API Reference

### `new ScrollMagicLite(options?)`

| Option | Type | Default | Description |
|---|---|---|---|
| `defaultAnimation` | `AnimationType` | `'fadeUp'` | Default animation preset |
| `defaultDuration` | `number` | `600` | Default duration in ms |
| `defaultEasing` | `string` | `'cubic-bezier(0.25,0.46,0.45,0.94)'` | Default CSS easing |
| `threshold` | `number` | `0.1` | Default IntersectionObserver threshold |
| `rootMargin` | `string` | `'0px'` | Default rootMargin |
| `once` | `boolean` | `true` | Animate only once by default |

### `.reveal(target, config?)`

`target` can be a CSS selector string, `Element`, `Element[]`, or `NodeList`.

When a selector matches multiple elements, delay automatically staggers by 80ms unless `delay` is explicitly set.

### `.destroy()`

Disconnects all observers and cleans up all tracked elements.

---

### `useScrollReveal(config?)`

React hook. Returns a `ref` to attach to any HTML element.

### `useScrollAnimation(config?)`

Like `useScrollReveal` but also returns `{ isVisible, trigger }`.

### `useScrollRevealGroup(count, config?, stagger?)`

Returns an array of refs with automatic stagger delay. `stagger` defaults to `80`ms.

---

## How it works

1. **IntersectionObserver pool** — observers are pooled by `{threshold, rootMargin}`. 100 elements with the same config share one observer, not 100.
2. **CSS transitions on GPU properties** — every animation only changes `transform` and `opacity`. These are composited on the GPU and never trigger a layout or paint step.
3. **`will-change` lifecycle** — `will-change: transform, opacity` is applied before animation and removed after, so the GPU layer isn't held permanently.
4. **SSR guard** — every call to `window`, `document`, or `IntersectionObserver` is inside a `typeof window !== 'undefined'` check.

---

## Contributing

Issues and PRs are welcome. Please open an issue first for significant changes.

```bash
git clone https://github.com/Mehulbirare/scroll-magic-light.git
cd scroll-magic-light
npm install
npm run dev    # watch mode
npm run build  # production build
```

---

## License

MIT © [Mehul Birare](https://github.com/Mehulbirare)
