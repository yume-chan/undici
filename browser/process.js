export function nextTick(callback, ...args) {
  Promise.resolve().then(() => callback(...args));
}

export const env = {};

export const versions = {
  node: "20.0",
};

export function emitWarning(message) {
  console.warn(message);
}
