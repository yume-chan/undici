export default function setImmediate(callback, ...args) {
  const id = { cancelled: false };
  Promise.resolve().then(() => {
    if (id.cancelled) {
      return;
    }
    callback(...args)
  });
  return id;
};
