function nextTick(callback, ...args) {
  Promise.resolve().then(() => callback(...args));
}

const env = {};

function emitWarning(message) {
  console.warn(message);
}

export default {
  nextTick,
  env,
  emitWarning,
};
