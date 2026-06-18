import React from 'react'
import { useScrollReveal } from './hooks'
import type { AnimationConfig } from '../types'

interface ScrollRevealProps extends AnimationConfig {
  children: React.ReactNode
  as?: keyof HTMLElementTagNameMap
  className?: string
  style?: React.CSSProperties
}

export function ScrollReveal({
  children,
  as: Tag = 'div',
  className,
  style,
  ...config
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLElement>(config)

  return React.createElement(Tag, { ref, className, style }, children)
}

interface ScrollRevealListProps extends AnimationConfig {
  children: React.ReactNode[]
  as?: keyof HTMLElementTagNameMap
  itemAs?: keyof HTMLElementTagNameMap
  className?: string
  itemClassName?: string
  stagger?: number
}

// Each list item is its own component, so useScrollReveal is called once at the
// top level of a component (not inside a loop) — keeping the Rules of Hooks intact.
function ScrollRevealItem({
  as: Item,
  className,
  config,
  children,
}: {
  as: keyof HTMLElementTagNameMap
  className?: string
  config: AnimationConfig
  children: React.ReactNode
}) {
  const ref = useScrollReveal<HTMLElement>(config)
  return React.createElement(Item, { ref, className }, children)
}

export function ScrollRevealList({
  children,
  as: Wrapper = 'div',
  itemAs: Item = 'div',
  className,
  itemClassName,
  stagger = 80,
  delay = 0,
  ...config
}: ScrollRevealListProps) {
  return React.createElement(
    Wrapper,
    { className },
    React.Children.map(children, (child, i) =>
      React.createElement(ScrollRevealItem, {
        key: i,
        as: Item,
        className: itemClassName,
        config: { ...config, delay: (delay as number) + i * stagger },
        children: child,
      })
    )
  )
}
