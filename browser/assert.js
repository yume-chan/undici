const noop = () => { };

export default new Proxy(noop, {
  get(target, p, receiver) {
    if (p in target) {
      return target[p];
    }

    return noop;
  },
});
