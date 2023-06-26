/**
 * useStorage
 * @param key
 * @returns
 */
export function useStorage<T = unknown>(key: string) {
  return {
    get: () => {
      const data = localStorage.getItem(`${window.location.host}/${key}`)
      return data ? (JSON.parse(data) as T) : null
    },
    set: (data: T) => localStorage.setItem(`${window.location.host}/${key}`, JSON.stringify(data)),
    remove: () => localStorage.removeItem(`${window.location.host}/${key}`)
  }
}

/**
 * toCurrency
 * @param val
 * @returns
 */
export function toCurrency(val: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  return formatter.format(val)
}

/**
 * scrollTop
 */
export function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * onScrollEvent
 * @param params
 */
export function onScrollEvent(params: {
  element: HTMLElement | Window
  callback: CallableFunction
  bottom: number
  remove?: boolean
}) {
  const { bottom, callback, element, remove } = params

  const eventHandler = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    const scrolled = window.scrollY
    if (scrollable - scrolled === bottom) {
      callback()
    }
  }

  if (remove) element.removeEventListener('scroll', eventHandler)
  else element.addEventListener('scroll', eventHandler)
}
/**
 * defaultImage
 * @returns
 */
export function setDefaultImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/images/default.png'
}
