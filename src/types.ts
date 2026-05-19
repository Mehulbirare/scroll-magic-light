export type AnimationType =
  | 'fadeIn'
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'slideUp'
  | 'slideDown'
  | 'flipX'
  | 'flipY'

export interface AnimationConfig {
  animation?: AnimationType
  duration?: number
  delay?: number
  easing?: string
  threshold?: number
  once?: boolean
  rootMargin?: string
  distance?: number
}

export interface ResolvedConfig extends Required<AnimationConfig> {}

export interface ScrollMagicLiteOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
  defaultAnimation?: AnimationType
  defaultDuration?: number
  defaultEasing?: string
}

export interface AnimationStyles {
  hidden: Partial<CSSStyleDeclaration>
  visible: Partial<CSSStyleDeclaration>
}
