import { ScrollMagicLite, createScrollMagic } from './core'
import { init } from './data-attr'
import { getAnimationStyles } from './animations'
import type { AnimationConfig, AnimationType, ScrollMagicLiteOptions } from './types'

if (typeof window !== 'undefined') {
  const autoInit = () => {
    // opt-out: set window.smlAutoInit = false before script loads
    if ((window as unknown as Record<string, unknown>).smlAutoInit !== false) {
      init()
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit, { once: true })
  } else {
    autoInit()
  }
}

export { ScrollMagicLite, createScrollMagic, init, getAnimationStyles }
export type { AnimationConfig, AnimationType, ScrollMagicLiteOptions }
