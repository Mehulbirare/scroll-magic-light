import type { AnimationType, AnimationStyles } from './types'

const DEFAULT_DISTANCE = 40

export function getAnimationStyles(
  type: AnimationType,
  distance: number = DEFAULT_DISTANCE
): AnimationStyles {
  switch (type) {
    case 'fadeIn':
      return {
        hidden: { opacity: '0' },
        visible: { opacity: '1', transform: 'none' },
      }

    case 'fadeUp':
      return {
        hidden: { opacity: '0', transform: `translateY(${distance}px)` },
        visible: { opacity: '1', transform: 'translateY(0)' },
      }

    case 'fadeDown':
      return {
        hidden: { opacity: '0', transform: `translateY(-${distance}px)` },
        visible: { opacity: '1', transform: 'translateY(0)' },
      }

    case 'fadeLeft':
      return {
        hidden: { opacity: '0', transform: `translateX(${distance}px)` },
        visible: { opacity: '1', transform: 'translateX(0)' },
      }

    case 'fadeRight':
      return {
        hidden: { opacity: '0', transform: `translateX(-${distance}px)` },
        visible: { opacity: '1', transform: 'translateX(0)' },
      }

    case 'zoomIn':
      return {
        hidden: { opacity: '0', transform: 'scale(0.85)' },
        visible: { opacity: '1', transform: 'scale(1)' },
      }

    case 'zoomOut':
      return {
        hidden: { opacity: '0', transform: 'scale(1.15)' },
        visible: { opacity: '1', transform: 'scale(1)' },
      }

    case 'slideUp':
      return {
        hidden: { transform: `translateY(${distance}px)` },
        visible: { transform: 'translateY(0)' },
      }

    case 'slideDown':
      return {
        hidden: { transform: `translateY(-${distance}px)` },
        visible: { transform: 'translateY(0)' },
      }

    case 'flipX':
      return {
        hidden: { opacity: '0', transform: 'rotateX(90deg)' },
        visible: { opacity: '1', transform: 'rotateX(0deg)' },
      }

    case 'flipY':
      return {
        hidden: { opacity: '0', transform: 'rotateY(90deg)' },
        visible: { opacity: '1', transform: 'rotateY(0deg)' },
      }

    default:
      return {
        hidden: { opacity: '0' },
        visible: { opacity: '1' },
      }
  }
}

export function applyStyles(
  el: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
): void {
  for (const prop in styles) {
    const key = prop as keyof CSSStyleDeclaration
    if (typeof styles[key] === 'string') {
      ;(el.style as unknown as Record<string, string>)[prop] = styles[key] as string
    }
  }
}
