type ObserverCallback = (entry: IntersectionObserverEntry) => void

interface ObserverPool {
  observer: IntersectionObserver
  callbacks: Map<Element, ObserverCallback>
}

const pools = new Map<string, ObserverPool>()

function makeKey(threshold: number, rootMargin: string): string {
  return `${threshold}|${rootMargin}`
}

export function observe(
  el: Element,
  callback: ObserverCallback,
  threshold: number,
  rootMargin: string
): () => void {
  const key = makeKey(threshold, rootMargin)

  if (!pools.has(key)) {
    const callbacks = new Map<Element, ObserverCallback>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          callbacks.get(entry.target)?.(entry)
        }
      },
      { threshold, rootMargin }
    )
    pools.set(key, { observer, callbacks })
  }

  const pool = pools.get(key)!
  pool.callbacks.set(el, callback)
  pool.observer.observe(el)

  return () => {
    pool.observer.unobserve(el)
    pool.callbacks.delete(el)

    if (pool.callbacks.size === 0) {
      pool.observer.disconnect()
      pools.delete(key)
    }
  }
}
