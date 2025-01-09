export function setTimeout (callback, delay, ...args) {
  const id = globalThis.setTimeout(callback, delay, ...args)
  return {
    id,
    unref () { },
    refresh () {
      clearTimeout(id)
      return setTimeout(callback, delay)
    }
  }
}

export function clearTimeout (timer) {
  if (!timer) {
    return
  }

  globalThis.clearTimeout(timer.id)
}
