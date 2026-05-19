# scroll-magic-lite

Ultra-smooth scroll animation engine. IntersectionObserver based, zero jank, Next.js ready.

```
npm install scroll-magic-lite
```

---

## Why

Most scroll animation libraries register `scroll` event listeners that fire hundreds of times per second, forcing layout recalculations and causing jank. **scroll-magic-lite** uses the `IntersectionObserver` API instead — the browser handles all viewport detection natively, and animations run on GPU-composited properties (`transform`, `opacity`) only.

- No scroll listeners
- No layout thrashing
- Shared observer pool (one observer per threshold/rootMargin pair, regardless of element count)
- SSR safe — all browser APIs are guarded for Next.js
- Tree-shakeable — import only what you use

---

## React / Next.js

### `useScrollReveal` hook

```tsx
import { useScrollReveal } from 'scroll-magic-lite/react'

function Hero() {
  const ref = useScrollReveal({ animation: 'fadeUp', duration: 700 })

  return <h1 ref={ref}>Hello world</h1>
}
```

### `useScrollRevealGroup` — staggered lists

```tsx
import { useScrollRevealGroup } from 'scroll-magic-lite/react'

function FeatureList() {
  const refs = useScrollRevealGroup(3, { animation: 'fadeUp' }, 100)

  return (
    <ul>
      <li ref={refs[0]}>Fast</li>
      <li ref={refs[1]}>Smooth</li>
      <li ref={refs[2]}>Tiny</li>
    </ul>
  )
}
```

### `useScrollAnimation` — visibility state

```tsx
import { useScrollAnimation } from 'scroll-magic-lite/react'

function Card() {
  const { ref, isVisible } = useScrollAnimation({ animation: 'zoomIn', once: false })

  return (
    <div ref={ref} className={isVisible ? 'active' : ''}>
      content
    </div>
  )
}
```

### `<ScrollReveal>` component

```tsx
import { ScrollReveal } from 'scroll-magic-lite/react'

export default function Page() {
  return (
    <ScrollReveal animation="fadeUp" duration={600} delay={100}>
      <p>Animated on scroll</p>
    </ScrollReveal>
  )
}
```

---

## Vanilla JS

```js
import { ScrollMagicLite } from 'scroll-magic-lite'

const sml = new ScrollMagicLite()

// single element or CSS selector
sml.reveal('.hero', { animation: 'fadeUp' })

// auto-stagger multiple elements (80ms between each)
sml.reveal('.card', { animation: 'fadeUp', duration: 500 })

// clean up
sml.destroy()
```

---

## Animation types

| Name        | Effect                          |
|-------------|---------------------------------|
| `fadeIn`    | opacity 0 → 1                   |
| `fadeUp`    | fade in + slide up              |
| `fadeDown`  | fade in + slide down            |
| `fadeLeft`  | fade in + slide from right      |
| `fadeRight` | fade in + slide from left       |
| `zoomIn`    | fade in + scale up from 85%     |
| `zoomOut`   | fade in + scale down from 115%  |
| `slideUp`   | slide up (no fade)              |
| `slideDown` | slide down (no fade)            |
| `flipX`     | 3D flip on X axis               |
| `flipY`     | 3D flip on Y axis               |

---

## Options

| Option        | Type     | Default                              | Description                           |
|---------------|----------|--------------------------------------|---------------------------------------|
| `animation`   | string   | `'fadeUp'`                           | Animation preset                      |
| `duration`    | number   | `600`                                | Transition duration in ms             |
| `delay`       | number   | `0`                                  | Transition delay in ms                |
| `easing`      | string   | `'cubic-bezier(0.25,0.46,0.45,0.94)'`| CSS easing function                   |
| `threshold`   | number   | `0.1`                                | 0–1, how much of element must be visible |
| `once`        | boolean  | `true`                               | Animate only once (true) or every time (false) |
| `rootMargin`  | string   | `'0px'`                              | IntersectionObserver rootMargin       |
| `distance`    | number   | `40`                                 | px distance for slide/fade animations |

---

## Next.js app router

`useScrollReveal` uses `useEffect` internally so it only runs on the client. No `'use client'` wrapper needed on the hook itself, but any component that calls it must be a client component:

```tsx
'use client'
import { useScrollReveal } from 'scroll-magic-lite/react'
```

---

## License

MIT
