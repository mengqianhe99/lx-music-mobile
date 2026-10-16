import { useSyncExternalStore } from 'react'

let current = 'home'
const listeners = new Set<() => void>()

export const getHomeTab = () => current

export const setHomeTab = (tab: string) => {
  if (current == tab) return
  current = tab
  listeners.forEach(fn => { fn() })
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export const useHomeTab = () => useSyncExternalStore(subscribe, getHomeTab)

export const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 5) return '夜深了'
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}
