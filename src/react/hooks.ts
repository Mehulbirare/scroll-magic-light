import { useEffect, useRef, useCallback } from 'react'
import { getAnimationStyles, applyStyles } from '../animations'
import { observe } from '../observer'
import type { AnimationConfig, ResolvedConfig } from '../types'

const DEFAULTS: ResolvedConfig = {
  animation: 'fadeUp',
  duration: 600,
  delay: 0,
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  threshold: 0.1,
  once: true,
  rootMargin: '0px',
  distance: 40,
}

function resolve(config: AnimationConfig): ResolvedConfig {
  return { ...DEFAULTS, ...config }
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  config: AnimationConfig = {}
): React.RefObject<T> {
  const ref = useRef<T>(null)
  const cfgRef = useRef(resolve(config))

  useEffect(() => {
    cfgRef.current = resolve(config)
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const cfg = cfgRef.current
    const { hidden, visible } = getAnimationStyles(cfg.animation, cfg.distance)

    applyStyles(el, hidden)
    el.style.transition = `opacity ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms, transform ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`
    el.style.willChange = 'transform, opacity'

    const cleanup = observe(
      el,
      (entry) => {
        if (entry.isIntersecting) {
          applyStyles(el, visible)
          setTimeout(() => {
            el.style.willChange = 'auto'
          }, cfg.duration + cfg.delay)
          if (cfg.once) cleanup()
        } else if (!cfg.once) {
          applyStyles(el, hidden)
        }
      },
      cfg.threshold,
      cfg.rootMargin
    )

    return cleanup
  }, [])

  return ref
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  config: AnimationConfig = {}
): {
  ref: React.RefObject<T>
  isVisible: boolean
  trigger: () => void
} {
  const ref = useRef<T>(null)
  const isVisibleRef = useRef(false)
  const forceUpdate = useRef<() => void>(() => {})
  const cfg = resolve(config)

  const trigger = useCallback(() => {
    const el = ref.current
    if (!el) return
    const { visible } = getAnimationStyles(cfg.animation, cfg.distance)
    applyStyles(el, visible)
  }, [cfg.animation, cfg.distance])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const { hidden, visible } = getAnimationStyles(cfg.animation, cfg.distance)

    applyStyles(el, hidden)
    el.style.transition = `opacity ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms, transform ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`
    el.style.willChange = 'transform, opacity'

    const cleanup = observe(
      el,
      (entry) => {
        if (entry.isIntersecting) {
          applyStyles(el, visible)
          isVisibleRef.current = true
          forceUpdate.current()
          setTimeout(() => {
            el.style.willChange = 'auto'
          }, cfg.duration + cfg.delay)
          if (cfg.once) cleanup()
        } else if (!cfg.once) {
          applyStyles(el, hidden)
          isVisibleRef.current = false
          forceUpdate.current()
        }
      },
      cfg.threshold,
      cfg.rootMargin
    )

    return cleanup
  }, [])

  return { ref, isVisible: isVisibleRef.current, trigger }
}

export function useScrollRevealGroup<T extends HTMLElement = HTMLDivElement>(
  count: number,
  config: AnimationConfig = {},
  stagger: number = 80
): React.RefObject<T>[] {
  const refs = Array.from({ length: count }, () => useRef<T>(null))
  const cfg = resolve(config)

  useEffect(() => {
    const cleanups: Array<() => void> = []

    refs.forEach((ref, i) => {
      const el = ref.current
      if (!el) return

      const delay = cfg.delay + i * stagger
      const elCfg = { ...cfg, delay }
      const { hidden, visible } = getAnimationStyles(elCfg.animation, elCfg.distance)

      applyStyles(el, hidden)
      el.style.transition = `opacity ${elCfg.duration}ms ${elCfg.easing} ${delay}ms, transform ${elCfg.duration}ms ${elCfg.easing} ${delay}ms`
      el.style.willChange = 'transform, opacity'

      const cleanup = observe(
        el,
        (entry) => {
          if (entry.isIntersecting) {
            applyStyles(el, visible)
            setTimeout(() => {
              el.style.willChange = 'auto'
            }, elCfg.duration + delay)
            if (elCfg.once) cleanup()
          } else if (!elCfg.once) {
            applyStyles(el, hidden)
          }
        },
        elCfg.threshold,
        elCfg.rootMargin
      )

      cleanups.push(cleanup)
    })

    return () => cleanups.forEach((c) => c())
  }, [])

  return refs
}
