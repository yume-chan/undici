function nextTick(callback, ...args) {
  Promise.resolve().then(() => callback(...args));
}

const env = {};

const versions = {
  node: "20.0",
};

function emitWarning(message) {
  console.warn(message);
}

export default {
  nextTick,
  env,
  versions,
  emitWarning,
};
