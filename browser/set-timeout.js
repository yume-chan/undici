export function setTimeout(callback, delay) {
  const id = globalThis.setTimeout(callback, delay);
  return {
    id,
    refresh() {
      clearTimeout(id);
      return setTimeout(callback, delay);
    },
  };
}

export function clearTimeout(timer) {
  if (!timer) {
    return;
  }

  globalThis.clearTimeout(timer.id);
}
