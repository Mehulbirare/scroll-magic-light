import { getAnimationStyles, applyStyles } from './animations'
import { observe } from './observer'
import type { AnimationConfig, ScrollMagicLiteOptions, ResolvedConfig } from './types'

const DEFAULT_CONFIG: ResolvedConfig = {
  animation: 'fadeUp',
  duration: 600,
  delay: 0,
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  threshold: 0.1,
  once: true,
  rootMargin: '0px',
  distance: 40,
}

function resolve(
  config: AnimationConfig,
  defaults: ResolvedConfig
): ResolvedConfig {
  return { ...defaults, ...config }
}

function prepareElement(el: HTMLElement, cfg: ResolvedConfig): void {
  const { hidden } = getAnimationStyles(cfg.animation, cfg.distance)
  applyStyles(el, hidden)
  el.style.transition = `opacity ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms, transform ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`
  el.style.willChange = 'transform, opacity'
}

function revealElement(el: HTMLElement, cfg: ResolvedConfig): void {
  const { visible } = getAnimationStyles(cfg.animation, cfg.distance)
  applyStyles(el, visible)
}

function hideElement(el: HTMLElement, cfg: ResolvedConfig): void {
  const { hidden } = getAnimationStyles(cfg.animation, cfg.distance)
  applyStyles(el, hidden)
}

function cleanupWillChange(el: HTMLElement, delay: number): void {
  setTimeout(() => {
    el.style.willChange = 'auto'
  }, delay)
}

export class ScrollMagicLite {
  private defaults: ResolvedConfig
  private cleanups = new Map<Element, () => void>()

  constructor(options: ScrollMagicLiteOptions = {}) {
    this.defaults = {
      ...DEFAULT_CONFIG,
      threshold: options.threshold ?? DEFAULT_CONFIG.threshold,
      rootMargin: options.rootMargin ?? DEFAULT_CONFIG.rootMargin,
      once: options.once ?? DEFAULT_CONFIG.once,
      animation: options.defaultAnimation ?? DEFAULT_CONFIG.animation,
      duration: options.defaultDuration ?? DEFAULT_CONFIG.duration,
      easing: options.defaultEasing ?? DEFAULT_CONFIG.easing,
    }
  }

  reveal(
    target: string | Element | Element[] | NodeList,
    config: AnimationConfig = {}
  ): this {
    if (typeof window === 'undefined') return this

    const elements = this.resolveTarget(target)
    const cfg = resolve(config, this.defaults)

    elements.forEach((el, i) => {
      const htmlEl = el as HTMLElement

      const perElementCfg: ResolvedConfig = config.delay !== undefined
        ? cfg
        : { ...cfg, delay: cfg.delay + i * 80 }

      prepareElement(htmlEl, perElementCfg)

      const cleanup = observe(
        el,
        (entry) => {
          if (entry.isIntersecting) {
            revealElement(htmlEl, perElementCfg)
            cleanupWillChange(htmlEl, perElementCfg.duration + perElementCfg.delay)
            if (perElementCfg.once) {
              cleanup()
              this.cleanups.delete(el)
            }
          } else if (!perElementCfg.once) {
            hideElement(htmlEl, perElementCfg)
          }
        },
        perElementCfg.threshold,
        perElementCfg.rootMargin
      )

      this.cleanups.set(el, cleanup)
    })

    return this
  }

  unreveal(target: string | Element | Element[] | NodeList): this {
    const elements = this.resolveTarget(target)
    elements.forEach((el) => {
      this.cleanups.get(el)?.()
      this.cleanups.delete(el)
    })
    return this
  }

  destroy(): void {
    this.cleanups.forEach((cleanup) => cleanup())
    this.cleanups.clear()
  }

  private resolveTarget(
    target: string | Element | Element[] | NodeList
  ): Element[] {
    if (typeof target === 'string') {
      return Array.from(document.querySelectorAll(target))
    }
    if (target instanceof Element) return [target]
    return Array.from(target) as Element[]
  }
}

export function createScrollMagic(
  options?: ScrollMagicLiteOptions
): ScrollMagicLite {
  return new ScrollMagicLite(options)
}
