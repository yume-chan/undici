function nextTick(callback, ...args) {
  Promise.resolve().then(() => callback(...args));
}

function emitWarning(message) {
  console.warn(message);
}

export default {
  nextTick,
  emitWarning,
};
