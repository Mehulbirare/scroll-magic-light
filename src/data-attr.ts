import { ScrollMagicLite } from './core'
import type { AnimationConfig, AnimationType, ScrollMagicLiteOptions } from './types'

// data-sml-* values come from the DOM, which may include untrusted
// user-generated content. Validate everything at this boundary so hostile
// or malformed attributes can't break init or feed garbage into config.

const ANIMATION_TYPES = new Set<AnimationType>([
  'fadeIn', 'fadeUp', 'fadeDown', 'fadeLeft', 'fadeRight',
  'zoomIn', 'zoomOut', 'slideUp', 'slideDown', 'flipX', 'flipY',
])

// Each component is "auto" | "<num>px" | "<num>%" (optionally negative),
// matching the IntersectionObserver rootMargin grammar. Anything else would
// throw a SyntaxError in the observer constructor.
const ROOT_MARGIN_RE = /^(-?\d+(?:\.\d+)?(?:px|%)?|auto)( -?\d+(?:\.\d+)?(?:px|%)?| auto){0,3}$/

function parseNonNegInt(raw: string): number | undefined {
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

function parseConfig(el: HTMLElement): AnimationConfig {
  const d = el.dataset
  const config: AnimationConfig = {}

  if (d.sml && ANIMATION_TYPES.has(d.sml as AnimationType)) {
    config.animation = d.sml as AnimationType
  }

  if (d.smlDuration !== undefined) {
    const v = parseNonNegInt(d.smlDuration)
    if (v !== undefined) config.duration = v
  }

  if (d.smlDelay !== undefined) {
    const v = parseNonNegInt(d.smlDelay)
    if (v !== undefined) config.delay = v
  }

  if (d.smlEasing) config.easing = d.smlEasing

  if (d.smlThreshold !== undefined) {
    const t = parseFloat(d.smlThreshold)
    // IntersectionObserver throws a RangeError outside [0, 1].
    if (Number.isFinite(t)) config.threshold = Math.min(1, Math.max(0, t))
  }

  if (d.smlDistance !== undefined) {
    const v = parseNonNegInt(d.smlDistance)
    if (v !== undefined) config.distance = v
  }

  if (d.smlRootMargin !== undefined && ROOT_MARGIN_RE.test(d.smlRootMargin.trim())) {
    config.rootMargin = d.smlRootMargin.trim()
  }

  if (d.smlOnce) config.once = d.smlOnce !== 'false'

  return config
}

export function init(options?: ScrollMagicLiteOptions): ScrollMagicLite {
  const sml = new ScrollMagicLite(options)

  if (typeof window === 'undefined') return sml

  const run = () => {
    const elements = document.querySelectorAll('[data-sml]')
    elements.forEach((el) => {
      // Isolate failures: a single bad element must not abort init for the rest.
      try {
        sml.reveal(el, parseConfig(el as HTMLElement))
      } catch {
        /* ignore and continue */
      }
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
  } else {
    run()
  }

  return sml
}
