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
    React.Children.map(children, (child, i) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const itemRef = useScrollReveal<HTMLElement>({
        ...config,
        delay: (delay as number) + i * stagger,
      })

      return React.createElement(Item, { ref: itemRef, className: itemClassName }, child)
    })
  )
}
