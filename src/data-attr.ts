import { ScrollMagicLite } from './core'
import type { AnimationConfig, AnimationType, ScrollMagicLiteOptions } from './types'

function parseConfig(el: HTMLElement): AnimationConfig {
  const d = el.dataset
  const config: AnimationConfig = {}

  if (d.sml) config.animation = d.sml as AnimationType
  if (d.smlDuration) config.duration = parseInt(d.smlDuration, 10)
  if (d.smlDelay) config.delay = parseInt(d.smlDelay, 10)
  if (d.smlEasing) config.easing = d.smlEasing
  if (d.smlThreshold) config.threshold = parseFloat(d.smlThreshold)
  if (d.smlDistance) config.distance = parseInt(d.smlDistance, 10)
  if (d.smlOnce) config.once = d.smlOnce !== 'false'

  return config
}

export function init(options?: ScrollMagicLiteOptions): ScrollMagicLite {
  const sml = new ScrollMagicLite(options)

  if (typeof window === 'undefined') return sml

  const run = () => {
    const elements = document.querySelectorAll('[data-sml]')
    elements.forEach((el) => {
      sml.reveal(el, parseConfig(el as HTMLElement))
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
  } else {
    run()
  }

  return sml
}
